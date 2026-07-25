import type { ToolDefinition } from './types';

export interface RuntimeCapabilities {
  runtime: 'web' | 'electron' | 'capacitor';
  canLaunchNative: boolean;
  canManageServices: boolean;
}

export type ToolAction = 'open-ui' | 'view-setup' | 'launch-native' | 'open-repository';

export interface ToolPrimaryAction {
  label: string;
  action: ToolAction;
}

declare global {
  interface Window {
    electronAPI?: unknown;
    Capacitor?: { isNativePlatform?: () => boolean };
  }
}

export function detectRuntimeCapabilities(): RuntimeCapabilities {
  if (typeof window === 'undefined') {
    return { runtime: 'web', canLaunchNative: false, canManageServices: false };
  }

  if (window.electronAPI) {
    return { runtime: 'electron', canLaunchNative: true, canManageServices: true };
  }

  if (window.Capacitor?.isNativePlatform?.()) {
    return { runtime: 'capacitor', canLaunchNative: true, canManageServices: false };
  }

  return { runtime: 'web', canLaunchNative: false, canManageServices: false };
}

export function getToolLocalUrl(tool: ToolDefinition): string | null {
  if (!tool.defaultPort) return null;
  const path = tool.uiPath?.startsWith('/') ? tool.uiPath : tool.uiPath ? `/${tool.uiPath}` : '';
  return `http://localhost:${tool.defaultPort}${path}`;
}

export function getToolPrimaryAction(
  tool: ToolDefinition,
  capabilities: RuntimeCapabilities,
): ToolPrimaryAction {
  if (tool.runtime === 'web-ui' && tool.defaultPort) {
    return { label: 'Open UI', action: 'open-ui' };
  }

  if (tool.runtime === 'local-service' && capabilities.canManageServices) {
    return { label: 'Launch', action: 'launch-native' };
  }

  if (tool.runtime === 'desktop-app' && capabilities.canLaunchNative) {
    return { label: 'Launch native', action: 'launch-native' };
  }

  if (tool.launchCommand || tool.runtime === 'local-service' || tool.runtime === 'cli' || tool.runtime === 'desktop-app') {
    return { label: 'View setup', action: 'view-setup' };
  }

  return { label: 'Open repository', action: 'open-repository' };
}
