import { toolRegistry } from '../command-center/data';
import type { ToolRuntime } from '../command-center/types';
import type { ToolAdapter, ToolManifest, ToolPrimaryAction } from './types';

const LIBRARY_IDS = new Set(['ccxt', 'playwright']);

function defaultAdapter(runtime: ToolRuntime, id: string): ToolAdapter {
  if (LIBRARY_IDS.has(id)) return 'library';
  switch (runtime) {
    case 'web-ui':
      return 'embedded-web';
    case 'local-service':
      return 'managed-service';
    case 'desktop-app':
      return 'native-app';
    case 'cli':
      return 'cli';
    case 'framework':
      return 'agent-framework';
  }
}

function primaryAction(adapter: ToolAdapter): ToolPrimaryAction {
  switch (adapter) {
    case 'embedded-web':
      return 'open-workspace';
    case 'managed-service':
      return 'start';
    case 'native-app':
      return 'launch';
    case 'cli':
    case 'agent-framework':
    case 'library':
      return 'run-job';
  }
}

const OVERRIDES: Record<string, Partial<ToolManifest>> = {
  mirofish: {
    adapter: 'agent-framework',
    ports: [3000, 5001],
    uiPort: 3000,
    apiPath: '/',
    capabilities: ['embed', 'api', 'jobs', 'logs', 'files'],
    recipe: {
      install: ['git clone https://github.com/666ghj/MiroFish.git .', 'cp .env.example .env', 'npm run setup:all'],
      start: ['npm run dev'],
      stop: [],
      healthPath: '/',
    },
  },
  comfyui: {
    adapter: 'managed-service',
    ports: [8188],
    uiPort: 8188,
    capabilities: ['embed', 'api', 'jobs', 'logs', 'files'],
    recipe: {
      install: ['git clone https://github.com/comfy-org/comfyui.git .', 'python -m pip install -r requirements.txt'],
      start: ['python main.py --listen 127.0.0.1 --port 8188'],
      stop: [],
      healthPath: '/system_stats',
    },
  },
  ollama: {
    adapter: 'managed-service',
    ports: [11434],
    uiPort: undefined,
    apiPath: '/api',
    capabilities: ['api', 'jobs', 'logs'],
    recipe: {
      install: ['curl -fsSL https://ollama.com/install.sh | sh'],
      start: ['ollama serve'],
      stop: [],
      healthPath: '/api/tags',
      executable: 'ollama',
    },
  },
  'open-webui': {
    adapter: 'embedded-web',
    ports: [3000],
    uiPort: 3000,
    capabilities: ['embed', 'api', 'jobs', 'logs', 'files'],
    recipe: {
      install: ['docker pull ghcr.io/open-webui/open-webui:main'],
      start: [
        'docker run -d -p 127.0.0.1:3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main',
      ],
      stop: ['docker stop open-webui'],
      healthPath: '/health',
    },
  },
  'label-studio': {
    adapter: 'managed-service',
    ports: [8080],
    uiPort: 8080,
    capabilities: ['embed', 'api', 'jobs', 'logs', 'files'],
    recipe: {
      install: ['python -m pip install label-studio'],
      start: ['label-studio start --host 127.0.0.1 --port 8080'],
      stop: [],
      healthPath: '/health',
      executable: 'label-studio',
    },
  },
  qdrant: {
    adapter: 'managed-service',
    ports: [6333, 6334],
    uiPort: 6333,
    apiPath: '/',
    capabilities: ['embed', 'api', 'jobs', 'logs'],
    recipe: {
      install: ['docker pull qdrant/qdrant'],
      start: ['docker run -d -p 127.0.0.1:6333:6333 -p 127.0.0.1:6334:6334 -v qdrant_storage:/qdrant/storage --name qdrant qdrant/qdrant'],
      stop: ['docker stop qdrant'],
      healthPath: '/healthz',
    },
  },
  meilisearch: {
    adapter: 'managed-service',
    ports: [7700],
    uiPort: 7700,
    capabilities: ['api', 'jobs', 'logs'],
    recipe: {
      install: ['docker pull getmeili/meilisearch:latest'],
      start: ['docker run -d -p 127.0.0.1:7700:7700 -v meili_data:/meili_data --name meilisearch getmeili/meilisearch:latest'],
      stop: ['docker stop meilisearch'],
      healthPath: '/health',
    },
  },
  'uptime-kuma': {
    adapter: 'embedded-web',
    ports: [3001],
    uiPort: 3001,
    capabilities: ['embed', 'api', 'logs'],
    recipe: {
      install: ['docker pull louislam/uptime-kuma:2'],
      start: ['docker run -d --restart=always -p 127.0.0.1:3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:2'],
      stop: ['docker stop uptime-kuma'],
      healthPath: '/',
    },
  },
  langflow: {
    adapter: 'embedded-web',
    ports: [7860],
    uiPort: 7860,
    capabilities: ['embed', 'api', 'jobs', 'logs', 'files'],
    recipe: {
      install: ['python -m pip install langflow'],
      start: ['langflow run --host 127.0.0.1 --port 7860'],
      stop: [],
      healthPath: '/health',
      executable: 'langflow',
    },
  },
  freqtrade: {
    adapter: 'managed-service',
    ports: [8080],
    uiPort: 8080,
    capabilities: ['embed', 'api', 'jobs', 'logs', 'files'],
    recipe: {
      install: ['docker pull freqtradeorg/freqtrade:stable'],
      start: ['docker compose up -d'],
      stop: ['docker compose down'],
      healthPath: '/api/v1/ping',
      dockerCompose: true,
    },
  },
  blender: {
    adapter: 'native-app',
    capabilities: ['native-launch', 'jobs', 'logs', 'files'],
    recipe: { executable: 'blender', start: ['blender'] },
  },
  godot: {
    adapter: 'native-app',
    capabilities: ['native-launch', 'jobs', 'logs', 'files'],
    recipe: { executable: 'godot', start: ['godot'] },
  },
};

export const toolManifests: ToolManifest[] = toolRegistry.map(tool => {
  const adapter = defaultAdapter(tool.runtime, tool.id);
  const base: ToolManifest = {
    id: tool.id,
    name: tool.name,
    adapter,
    workspaceRoute: `/tools/${tool.id}`,
    primaryAction: primaryAction(adapter),
    ports: tool.defaultPort ? [tool.defaultPort] : [],
    uiPort: tool.defaultPort,
    uiPath: tool.uiPath ?? '/',
    capabilities:
      adapter === 'embedded-web'
        ? ['embed', 'logs']
        : adapter === 'managed-service'
          ? ['api', 'jobs', 'logs']
          : adapter === 'native-app'
            ? ['native-launch', 'files']
            : adapter === 'library'
              ? ['api', 'jobs']
              : ['jobs', 'logs'],
    recipe: tool.launchCommand ? { start: [tool.launchCommand] } : undefined,
  };

  const override = OVERRIDES[tool.id];
  if (!override) return base;
  const merged = { ...base, ...override };
  merged.primaryAction = primaryAction(merged.adapter);
  merged.workspaceRoute = `/tools/${tool.id}`;
  merged.uiPath = override.uiPath ?? base.uiPath;
  return merged;
});

const manifestMap = new Map(toolManifests.map(manifest => [manifest.id, manifest]));

export function getToolManifest(toolId: string): ToolManifest | undefined {
  return manifestMap.get(toolId);
}
