import { create } from 'zustand';
import { executionNodeClient } from './executionNodeClient';
import type {
  ExecutionNodeCapabilities,
  ExecutionNodeHealth,
  ToolJob,
  ToolRuntimeLog,
  ToolRuntimeStatus,
} from './types';

interface NodeStateInput {
  connected: boolean;
  health: ExecutionNodeHealth | null;
  capabilities: ExecutionNodeCapabilities | null;
  error?: string | null;
}

interface ToolRuntimeStore {
  nodeConnected: boolean;
  nodeChecking: boolean;
  health: ExecutionNodeHealth | null;
  capabilities: ExecutionNodeCapabilities | null;
  nodeError: string | null;
  toolStatuses: Record<string, ToolRuntimeStatus>;
  logsByTool: Record<string, ToolRuntimeLog[]>;
  jobs: ToolJob[];
  activeToolId: string | null;
  workspaceOpen: boolean;
  activeWorkspaceTab: 'workspace' | 'console' | 'logs' | 'config';
  setNodeState: (input: NodeStateInput) => void;
  setToolStatus: (status: ToolRuntimeStatus) => void;
  openWorkspace: (toolId: string) => void;
  closeWorkspace: () => void;
  setWorkspaceTab: (tab: ToolRuntimeStore['activeWorkspaceTab']) => void;
  connect: () => Promise<void>;
  refreshTools: () => Promise<void>;
  installTool: (toolId: string) => Promise<void>;
  startTool: (toolId: string) => Promise<void>;
  stopTool: (toolId: string) => Promise<void>;
  refreshLogs: (toolId: string) => Promise<void>;
  createJob: (input: { toolId: string; title: string; input: Record<string, unknown>; actionId?: string }) => Promise<ToolJob | null>;
  reset: () => void;
}

const INITIAL_STATE = {
  nodeConnected: false,
  nodeChecking: false,
  health: null,
  capabilities: null,
  nodeError: null,
  toolStatuses: {},
  logsByTool: {},
  jobs: [],
  activeToolId: null,
  workspaceOpen: false,
  activeWorkspaceTab: 'workspace' as const,
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Execution node unavailable';
}

export const useToolRuntimeStore = create<ToolRuntimeStore>((set, get) => ({
  ...INITIAL_STATE,

  setNodeState: input => set({
    nodeConnected: input.connected,
    health: input.health,
    capabilities: input.capabilities,
    nodeError: input.error ?? null,
  }),

  setToolStatus: status => set(state => ({
    toolStatuses: { ...state.toolStatuses, [status.toolId]: status },
  })),

  openWorkspace: toolId => set({
    activeToolId: toolId,
    workspaceOpen: true,
    activeWorkspaceTab: 'workspace',
  }),

  closeWorkspace: () => set({ workspaceOpen: false, activeToolId: null }),

  setWorkspaceTab: activeWorkspaceTab => set({ activeWorkspaceTab }),

  connect: async () => {
    if (get().nodeChecking) return;
    set({ nodeChecking: true, nodeError: null });
    try {
      const [health, capabilities, tools] = await Promise.all([
        executionNodeClient.health(),
        executionNodeClient.capabilities(),
        executionNodeClient.listTools(),
      ]);
      const toolStatuses = Object.fromEntries(tools.map(tool => [tool.toolId, tool]));
      set({ nodeConnected: true, nodeChecking: false, health, capabilities, toolStatuses, nodeError: null });
    } catch (error) {
      set({ nodeConnected: false, nodeChecking: false, health: null, capabilities: null, nodeError: errorMessage(error) });
    }
  },

  refreshTools: async () => {
    try {
      const tools = await executionNodeClient.listTools();
      set({
        toolStatuses: Object.fromEntries(tools.map(tool => [tool.toolId, tool])),
        nodeConnected: true,
        nodeError: null,
      });
    } catch (error) {
      set({ nodeConnected: false, nodeError: errorMessage(error) });
    }
  },

  installTool: async toolId => {
    try {
      get().setToolStatus(await executionNodeClient.installTool(toolId));
    } catch (error) {
      set({ nodeError: errorMessage(error) });
    }
  },

  startTool: async toolId => {
    try {
      get().setToolStatus(await executionNodeClient.startTool(toolId));
    } catch (error) {
      set({ nodeError: errorMessage(error) });
    }
  },

  stopTool: async toolId => {
    try {
      get().setToolStatus(await executionNodeClient.stopTool(toolId));
    } catch (error) {
      set({ nodeError: errorMessage(error) });
    }
  },

  refreshLogs: async toolId => {
    try {
      const logs = await executionNodeClient.logs(toolId);
      set(state => ({ logsByTool: { ...state.logsByTool, [toolId]: logs } }));
    } catch (error) {
      set({ nodeError: errorMessage(error) });
    }
  },

  createJob: async input => {
    try {
      const job = await executionNodeClient.createJob(input);
      set(state => ({ jobs: [job, ...state.jobs.filter(item => item.id !== job.id)] }));
      return job;
    } catch (error) {
      set({ nodeError: errorMessage(error) });
      return null;
    }
  },

  reset: () => set({ ...INITIAL_STATE }),
}));
