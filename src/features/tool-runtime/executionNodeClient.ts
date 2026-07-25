import type {
  ExecutionNodeCapabilities,
  ExecutionNodeHealth,
  ToolJob,
  ToolRuntimeLog,
  ToolRuntimeStatus,
} from './types';

interface ExecutionNodeClientOptions {
  baseUrl?: string;
  token?: string;
  timeoutMs?: number;
}

interface CreateJobInput {
  toolId: string;
  title: string;
  input: Record<string, unknown>;
  actionId?: string;
}

export class ExecutionNodeError extends Error {
  readonly status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = 'ExecutionNodeError';
    this.status = status;
  }
}

export class ExecutionNodeClient {
  readonly baseUrl: string;
  private readonly token?: string;
  private readonly timeoutMs: number;

  constructor(options: ExecutionNodeClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? import.meta.env.VITE_EXECUTION_NODE_URL ?? 'http://127.0.0.1:4280').replace(/\/$/, '');
    this.token = options.token ?? import.meta.env.VITE_EXECUTION_NODE_TOKEN;
    this.timeoutMs = options.timeoutMs ?? 6500;
  }

  health(): Promise<ExecutionNodeHealth> {
    return this.request('/health');
  }

  capabilities(): Promise<ExecutionNodeCapabilities> {
    return this.request('/v1/capabilities');
  }

  listTools(): Promise<ToolRuntimeStatus[]> {
    return this.request('/v1/tools');
  }

  tool(toolId: string): Promise<ToolRuntimeStatus> {
    return this.request(`/v1/tools/${encodeURIComponent(toolId)}`);
  }

  installTool(toolId: string): Promise<ToolRuntimeStatus> {
    return this.request(`/v1/tools/${encodeURIComponent(toolId)}/install`, { method: 'POST' });
  }

  startTool(toolId: string): Promise<ToolRuntimeStatus> {
    return this.request(`/v1/tools/${encodeURIComponent(toolId)}/start`, { method: 'POST' });
  }

  stopTool(toolId: string): Promise<ToolRuntimeStatus> {
    return this.request(`/v1/tools/${encodeURIComponent(toolId)}/stop`, { method: 'POST' });
  }

  logs(toolId: string): Promise<ToolRuntimeLog[]> {
    return this.request(`/v1/tools/${encodeURIComponent(toolId)}/logs`);
  }

  createJob(input: CreateJobInput): Promise<ToolJob> {
    return this.request('/v1/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  }

  job(jobId: string): Promise<ToolJob> {
    return this.request(`/v1/jobs/${encodeURIComponent(jobId)}`);
  }

  embedUrl(toolId: string, path = '/'): string {
    const safePath = path.startsWith('/') ? path.slice(1) : path;
    return `${this.baseUrl}/embed/${encodeURIComponent(toolId)}/${safePath}`;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort(), this.timeoutMs);
    const headers = new Headers(init.headers);
    if (this.token) headers.set('Authorization', `Bearer ${this.token}`);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers,
        signal: controller.signal,
      });
      if (!response.ok) {
        const detail = await response.text();
        throw new ExecutionNodeError(detail || `Execution node returned ${response.status}`, response.status);
      }
      return await response.json() as T;
    } catch (error) {
      if (error instanceof ExecutionNodeError) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ExecutionNodeError('Execution node request timed out');
      }
      throw new ExecutionNodeError(error instanceof Error ? error.message : 'Execution node unavailable');
    } finally {
      globalThis.clearTimeout(timeout);
    }
  }
}

export const executionNodeClient = new ExecutionNodeClient();
