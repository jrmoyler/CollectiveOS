import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useToolRuntimeStore } from './useToolRuntimeStore';
import { ToolWorkspace } from './ToolWorkspace';

vi.mock('./executionNodeClient', () => ({
  executionNodeClient: {
    embedUrl: (toolId: string) => `http://127.0.0.1:4280/embed/${toolId}/`,
    installTool: vi.fn(),
    startTool: vi.fn(),
    stopTool: vi.fn(),
    logs: vi.fn(),
    createJob: vi.fn(),
  },
}));

describe('ToolWorkspace', () => {
  beforeEach(() => {
    useToolRuntimeStore.getState().reset();
  });

  it('renders a tool inside HATAALII OS with lifecycle controls', () => {
    useToolRuntimeStore.getState().setNodeState({
      connected: true,
      health: { ok: true, nodeId: 'local', version: '2.0.0', platform: 'linux', uptimeSeconds: 30 },
      capabilities: { docker: true, git: true, node: true, python: true, gpu: true, blender: true, godot: true, ollama: true },
    });
    useToolRuntimeStore.getState().setToolStatus({ toolId: 'comfyui', state: 'installed', ports: [8188], updatedAt: '2026-07-25T00:00:00.000Z' });

    render(<ToolWorkspace toolId="comfyui" />);

    expect(screen.getByRole('heading', { name: 'ComfyUI' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start ComfyUI/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /repository/i })).not.toBeInTheDocument();
  });

  it('shows an in-OS execution node connection surface when unavailable', () => {
    render(<ToolWorkspace toolId="ollama" />);
    expect(screen.getByText(/Connect an execution node/i)).toBeInTheDocument();
  });

  it('switches between workspace and logs without leaving the OS', () => {
    render(<ToolWorkspace toolId="comfyui" />);
    fireEvent.click(screen.getByRole('button', { name: /Logs/i }));
    expect(screen.getAllByText(/Runtime logs/i).length).toBeGreaterThan(0);
  });
});
