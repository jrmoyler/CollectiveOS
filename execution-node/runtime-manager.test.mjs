import test from 'node:test';
import assert from 'node:assert/strict';
import { RuntimeManager } from './runtime-manager.mjs';

const recipes = [
  {
    id: 'sample',
    name: 'Sample',
    adapter: 'managed-service',
    ports: [9000],
    recipe: { install: ['install sample'], start: ['start sample'], stop: ['stop sample'] },
  },
];

function createRunner() {
  const calls = [];
  return {
    calls,
    run: async ({ command, onLog }) => {
      calls.push(command);
      onLog?.('info', `ran ${command}`);
      return { pid: 42, exitCode: null, stop: async () => {} };
    },
  };
}

test('rejects unknown tools instead of executing supplied names', async () => {
  const runner = createRunner();
  const manager = new RuntimeManager({ recipes, runner });
  await assert.rejects(manager.start('rm -rf /'), /Unknown tool/);
  assert.equal(runner.calls.length, 0);
});

test('uses allow-listed recipe commands for lifecycle actions', async () => {
  const runner = createRunner();
  const manager = new RuntimeManager({ recipes, runner });

  await manager.install('sample');
  const status = await manager.start('sample');

  assert.deepEqual(runner.calls, ['install sample', 'start sample']);
  assert.equal(status.state, 'running');
  assert.equal(status.pid, 42);
});

test('retains bounded logs per tool', async () => {
  const manager = new RuntimeManager({ recipes, runner: createRunner(), maxLogs: 2 });
  manager.appendLog('sample', 'info', 'one');
  manager.appendLog('sample', 'warn', 'two');
  manager.appendLog('sample', 'error', 'three');

  assert.deepEqual(manager.logs('sample').map(log => log.message), ['two', 'three']);
});

test('creates tracked jobs without accepting browser shell text', async () => {
  const manager = new RuntimeManager({ recipes, runner: createRunner() });
  const job = await manager.createJob({ toolId: 'sample', title: 'Inspect', actionId: 'inspect', input: { prompt: 'hello' } });

  assert.equal(job.status, 'queued');
  assert.equal(job.toolId, 'sample');
  assert.equal('command' in job.input, false);
});
