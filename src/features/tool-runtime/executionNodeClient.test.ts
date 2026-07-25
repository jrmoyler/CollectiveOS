import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExecutionNodeClient } from './executionNodeClient';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ExecutionNodeClient', () => {
  it('reads execution-node health and sends bearer authentication', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true, nodeId: 'local', version: '2.0.0', platform: 'linux', uptimeSeconds: 12 }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new ExecutionNodeClient({ baseUrl: 'http://127.0.0.1:4280', token: 'secret' });
    const health = await client.health();

    expect(health.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:4280/health', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer secret' }),
    }));
  });

  it('uses allow-listed lifecycle endpoints instead of accepting command text', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ toolId: 'ollama', state: 'starting', ports: [11434], updatedAt: '2026-07-25T00:00:00.000Z' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new ExecutionNodeClient({ baseUrl: 'http://127.0.0.1:4280' });
    await client.startTool('ollama');

    expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:4280/v1/tools/ollama/start', expect.objectContaining({ method: 'POST' }));
    const body = fetchMock.mock.calls[0]?.[1]?.body;
    expect(body).toBeUndefined();
  });

  it('creates tracked jobs through the jobs endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      id: 'job-1', toolId: 'mirofish', title: 'Scenario', status: 'queued', input: {}, createdAt: '2026-07-25T00:00:00.000Z', updatedAt: '2026-07-25T00:00:00.000Z',
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new ExecutionNodeClient({ baseUrl: 'http://127.0.0.1:4280' });
    const job = await client.createJob({ toolId: 'mirofish', title: 'Scenario', input: { prompt: 'Model the launch' } });

    expect(job.id).toBe('job-1');
    expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:4280/v1/jobs', expect.objectContaining({ method: 'POST' }));
  });
});
