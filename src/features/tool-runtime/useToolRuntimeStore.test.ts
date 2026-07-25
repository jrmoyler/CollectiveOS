import { beforeEach, describe, expect, it } from 'vitest';
import { useToolRuntimeStore } from './useToolRuntimeStore';

describe('useToolRuntimeStore', () => {
  beforeEach(() => {
    useToolRuntimeStore.getState().reset();
  });

  it('opens an internal tool workspace without navigating externally', () => {
    useToolRuntimeStore.getState().openWorkspace('comfyui');
    const state = useToolRuntimeStore.getState();
    expect(state.activeToolId).toBe('comfyui');
    expect(state.workspaceOpen).toBe(true);
  });

  it('applies runtime status updates immutably', () => {
    const status = { toolId: 'ollama', state: 'running' as const, ports: [11434], updatedAt: '2026-07-25T00:00:00.000Z' };
    useToolRuntimeStore.getState().setToolStatus(status);
    expect(useToolRuntimeStore.getState().toolStatuses.ollama).toEqual(status);
  });

  it('stores node connection state and capabilities', () => {
    useToolRuntimeStore.getState().setNodeState({
      connected: true,
      health: { ok: true, nodeId: 'local', version: '2.0.0', platform: 'linux', uptimeSeconds: 30 },
      capabilities: { docker: true, git: true, node: true, python: true, gpu: false, blender: false, godot: false, ollama: true },
    });
    expect(useToolRuntimeStore.getState().nodeConnected).toBe(true);
    expect(useToolRuntimeStore.getState().capabilities?.docker).toBe(true);
  });
});
