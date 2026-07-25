export type ToolAdapter =
  | 'embedded-web'
  | 'managed-service'
  | 'native-app'
  | 'cli'
  | 'agent-framework'
  | 'library';

export type ToolLifecycleState =
  | 'discovered'
  | 'installable'
  | 'installing'
  | 'installed'
  | 'starting'
  | 'running'
  | 'stopping'
  | 'stopped'
  | 'failed'
  | 'unavailable';

export type ToolPrimaryAction = 'open-workspace' | 'install' | 'start' | 'launch' | 'run-job';

export interface ToolRecipe {
  install?: string[];
  start?: string[];
  stop?: string[];
  healthPath?: string;
  workingDirectory?: string;
  dockerCompose?: boolean;
  executable?: string;
}

export interface ToolManifest {
  id: string;
  name: string;
  adapter: ToolAdapter;
  workspaceRoute: string;
  primaryAction: ToolPrimaryAction;
  ports: number[];
  uiPort?: number;
  uiPath: string;
  apiPath?: string;
  capabilities: Array<'embed' | 'api' | 'jobs' | 'logs' | 'native-launch' | 'files'>;
  recipe?: ToolRecipe;
}

export interface ExecutionNodeHealth {
  ok: boolean;
  nodeId: string;
  version: string;
  platform: string;
  uptimeSeconds: number;
}

export interface ExecutionNodeCapabilities {
  docker: boolean;
  git: boolean;
  node: boolean;
  python: boolean;
  gpu: boolean;
  blender: boolean;
  godot: boolean;
  ollama: boolean;
}

export interface ToolRuntimeStatus {
  toolId: string;
  state: ToolLifecycleState;
  pid?: number;
  containerId?: string;
  ports: number[];
  message?: string;
  updatedAt: string;
}

export interface ToolRuntimeLog {
  id: string;
  toolId: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export interface ToolJob {
  id: string;
  toolId: string;
  title: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  input: Record<string, unknown>;
  output?: string;
  createdAt: string;
  updatedAt: string;
}
