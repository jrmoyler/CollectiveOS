import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const now = () => new Date().toISOString();

export class SystemRunner {
  constructor({ dataRoot = path.resolve('.hataalii-runtime') } = {}) {
    this.dataRoot = dataRoot;
  }

  async run({ toolId, command, cwd, wait = false, onLog }) {
    const workingDirectory = cwd ?? path.join(this.dataRoot, toolId);
    await mkdir(workingDirectory, { recursive: true });

    const child = spawn(command, {
      cwd: workingDirectory,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, HATAALII_TOOL_ID: toolId },
    });

    child.stdout?.on('data', chunk => onLog?.('info', chunk.toString().trimEnd()));
    child.stderr?.on('data', chunk => onLog?.('error', chunk.toString().trimEnd()));
    child.on('error', error => onLog?.('error', error.message));

    const handle = {
      pid: child.pid,
      exitCode: null,
      stop: async () => {
        if (!child.killed) child.kill('SIGTERM');
      },
      process: child,
    };

    if (wait) {
      const exitCode = await new Promise((resolve, reject) => {
        child.once('error', reject);
        child.once('exit', code => resolve(code ?? 0));
      });
      handle.exitCode = exitCode;
      if (exitCode !== 0) throw new Error(`Command failed with exit code ${exitCode}`);
    }

    return handle;
  }
}

export class RuntimeManager {
  constructor({ recipes, runner = new SystemRunner(), maxLogs = 300 } = {}) {
    this.recipes = new Map((recipes ?? []).map(recipe => [recipe.id, recipe]));
    this.runner = runner;
    this.maxLogs = maxLogs;
    this.handles = new Map();
    this.logStore = new Map();
    this.jobs = new Map();
    this.statuses = new Map();

    for (const recipe of this.recipes.values()) {
      this.statuses.set(recipe.id, this.makeStatus(recipe.id, recipe.recipe ? 'installable' : 'discovered'));
    }
  }

  makeStatus(toolId, state, extra = {}) {
    const recipe = this.requireRecipe(toolId);
    return {
      toolId,
      state,
      ports: recipe.ports ?? [],
      updatedAt: now(),
      ...extra,
    };
  }

  requireRecipe(toolId) {
    const recipe = this.recipes.get(toolId);
    if (!recipe) throw new Error(`Unknown tool: ${toolId}`);
    return recipe;
  }

  list() {
    return [...this.recipes.values()].map(recipe => ({
      ...this.status(recipe.id),
      name: recipe.name,
      adapter: recipe.adapter,
      uiPort: recipe.recipe?.uiPort,
      healthPath: recipe.recipe?.healthPath,
    }));
  }

  status(toolId) {
    this.requireRecipe(toolId);
    return this.statuses.get(toolId) ?? this.makeStatus(toolId, 'discovered');
  }

  setStatus(toolId, state, extra = {}) {
    const status = this.makeStatus(toolId, state, extra);
    this.statuses.set(toolId, status);
    return status;
  }

  async install(toolId) {
    const tool = this.requireRecipe(toolId);
    const commands = tool.recipe?.install ?? [];
    if (!commands.length) return this.setStatus(toolId, 'unavailable', { message: 'No verified automatic installation recipe is registered.' });

    this.setStatus(toolId, 'installing');
    try {
      for (const command of commands) {
        this.appendLog(toolId, 'info', `$ ${command}`);
        await this.runner.run({
          toolId,
          command,
          wait: true,
          onLog: (level, message) => this.appendLog(toolId, level, message),
        });
      }
      return this.setStatus(toolId, 'installed');
    } catch (error) {
      this.appendLog(toolId, 'error', error instanceof Error ? error.message : String(error));
      return this.setStatus(toolId, 'failed', { message: error instanceof Error ? error.message : String(error) });
    }
  }

  async start(toolId) {
    const tool = this.requireRecipe(toolId);
    const commands = tool.recipe?.start ?? [];
    if (!commands.length) return this.setStatus(toolId, 'unavailable', { message: 'Configure an internal endpoint or verified start recipe in HATAALII OS.' });

    this.setStatus(toolId, 'starting');
    try {
      let handle;
      for (const [index, command] of commands.entries()) {
        this.appendLog(toolId, 'info', `$ ${command}`);
        handle = await this.runner.run({
          toolId,
          command,
          wait: index < commands.length - 1,
          onLog: (level, message) => this.appendLog(toolId, level, message),
        });
      }
      if (handle) this.handles.set(toolId, handle);
      return this.setStatus(toolId, 'running', { pid: handle?.pid });
    } catch (error) {
      this.appendLog(toolId, 'error', error instanceof Error ? error.message : String(error));
      return this.setStatus(toolId, 'failed', { message: error instanceof Error ? error.message : String(error) });
    }
  }

  async stop(toolId) {
    const tool = this.requireRecipe(toolId);
    this.setStatus(toolId, 'stopping');
    try {
      const commands = tool.recipe?.stop ?? [];
      if (commands.length) {
        for (const command of commands) {
          this.appendLog(toolId, 'info', `$ ${command}`);
          await this.runner.run({
            toolId,
            command,
            wait: true,
            onLog: (level, message) => this.appendLog(toolId, level, message),
          });
        }
      } else {
        await this.handles.get(toolId)?.stop?.();
      }
      this.handles.delete(toolId);
      return this.setStatus(toolId, 'stopped');
    } catch (error) {
      this.appendLog(toolId, 'error', error instanceof Error ? error.message : String(error));
      return this.setStatus(toolId, 'failed', { message: error instanceof Error ? error.message : String(error) });
    }
  }

  appendLog(toolId, level, message) {
    this.requireRecipe(toolId);
    if (!message) return;
    const previous = this.logStore.get(toolId) ?? [];
    const next = [...previous, { id: randomUUID(), toolId, level, message, timestamp: now() }].slice(-this.maxLogs);
    this.logStore.set(toolId, next);
  }

  logs(toolId) {
    this.requireRecipe(toolId);
    return this.logStore.get(toolId) ?? [];
  }

  async createJob({ toolId, title, actionId, input = {} }) {
    const tool = this.requireRecipe(toolId);
    const safeInput = Object.fromEntries(Object.entries(input).filter(([key]) => !['command', 'shell', 'script'].includes(key)));
    const job = {
      id: randomUUID(),
      toolId,
      title: String(title || `${tool.name} job`),
      status: 'queued',
      input: safeInput,
      actionId: actionId ? String(actionId) : undefined,
      createdAt: now(),
      updatedAt: now(),
    };
    this.jobs.set(job.id, job);
    this.appendLog(toolId, 'info', `Queued job: ${job.title}`);
    return job;
  }

  job(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error(`Unknown job: ${jobId}`);
    return job;
  }
}
