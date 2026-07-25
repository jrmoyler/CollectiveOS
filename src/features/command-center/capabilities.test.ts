import { describe, expect, it } from 'vitest';
import { getToolPrimaryAction, type RuntimeCapabilities } from './capabilities';
import type { ToolDefinition } from './types';

const localService: ToolDefinition = {
  id: 'ollama',
  name: 'Ollama',
  category: 'Infrastructure',
  description: 'Run local language models.',
  repository: 'https://github.com/ollama/ollama',
  runtime: 'local-service',
  status: 'available',
  defaultPort: 11434,
  launchCommand: 'ollama serve',
  tags: ['local models'],
};

const embeddedWeb: ToolDefinition = {
  id: 'plane',
  name: 'Plane',
  category: 'Productivity',
  description: 'Project management workspace.',
  repository: 'https://github.com/makeplane/plane',
  runtime: 'web-ui',
  status: 'available',
  defaultPort: 3000,
  tags: ['projects'],
};

describe('runtime-aware tool actions', () => {
  it('opens reachable web interfaces in browser sessions', () => {
    const capabilities: RuntimeCapabilities = { runtime: 'web', canLaunchNative: false, canManageServices: false };
    expect(getToolPrimaryAction(embeddedWeb, capabilities)).toEqual({ label: 'Open UI', action: 'open-ui' });
  });

  it('shows setup for local services in browser sessions', () => {
    const capabilities: RuntimeCapabilities = { runtime: 'web', canLaunchNative: false, canManageServices: false };
    expect(getToolPrimaryAction(localService, capabilities)).toEqual({ label: 'View setup', action: 'view-setup' });
  });

  it('allows local service launch in Electron', () => {
    const capabilities: RuntimeCapabilities = { runtime: 'electron', canLaunchNative: true, canManageServices: true };
    expect(getToolPrimaryAction(localService, capabilities)).toEqual({ label: 'Launch', action: 'launch-native' });
  });
});
