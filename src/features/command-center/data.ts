import type {
  AgentDefinition,
  CommandMetric,
  ProjectDefinition,
  SearchResult,
  ToolCategory,
  ToolDefinition,
  ToolRuntime,
  VentureStream,
} from './types';

export const commandMetrics: CommandMetric[] = [
  { id: 'registered', label: 'Class registrations', value: '100+', detail: 'Cohort begins Sunday', trend: 'up' },
  { id: 'projects', label: 'Active portfolio', value: '14', detail: 'Collective AI + client work', trend: 'steady' },
  { id: 'agents', label: 'Council online', value: '10', detail: 'Founder-directed specialists', trend: 'up' },
  { id: 'august', label: 'August launches', value: '3', detail: 'Academy, Roaming Lemon, Command OS', trend: 'attention' },
];

export const collectiveProjects: ProjectDefinition[] = [
  {
    id: 'kre8trix',
    name: 'Kre8trix Platform',
    description: 'Creator and venture platform coordinated through Collective AI product, partnership, and operating workflows.',
    kind: 'collective-ai',
    division: 'Quantum Ledger / Nexus Labs',
    health: 'building',
    progress: 38,
    nextMilestone: 'Unify product architecture, partner workspace, and funding cohort operations.',
    collaborators: ['JR Moyler', 'Collective AI team'],
    tags: ['platform', 'creator economy', 'funding'],
    valueLabel: 'Strategic platform',
  },
  {
    id: 'legacy-app',
    name: 'Legacy App Build',
    description: 'Client application build with product design, agent support, testing, and deployment coordination.',
    kind: 'client',
    division: 'Nexus Labs',
    health: 'attention',
    progress: 31,
    nextMilestone: 'Lock the production scope and connect the Hermes agent workflow.',
    collaborators: ['JR Moyler', 'Coach Kay'],
    tags: ['app', 'client', 'agent'],
    valueLabel: 'Client delivery',
  },
  {
    id: 'exclusive-essence',
    name: 'Exclusive Essence',
    description: 'Website maintenance, Shopify catalog experience, AI content engine, campaigns, and retail growth systems.',
    kind: 'client',
    division: 'Signal Velocity / Nexus Labs',
    health: 'on-track',
    progress: 74,
    nextMilestone: 'Stabilize maintenance cadence and activate the content engine.',
    liveUrl: 'https://exclusiveessence21.wixstudio.com/my-site',
    collaborators: ['JR Moyler', 'Exclusive Essence'],
    tags: ['commerce', 'website', 'content'],
    valueLabel: 'Recurring client',
  },
  {
    id: 'child-care-compass',
    name: 'Child Care Compass',
    description: 'Multi-persona child-care operations platform for administrators, teachers, and parents.',
    kind: 'client',
    division: 'Hybrid Living / Nexus Labs',
    health: 'building',
    progress: 52,
    nextMilestone: 'Complete the core persona workflows and publish the next production build.',
    repository: 'https://github.com/jrmoyler/child-compass',
    collaborators: ['JR Moyler', 'Devon Scott'],
    tags: ['child care', 'operations', 'app'],
    valueLabel: 'Product build',
  },
  {
    id: 'collective-merch-closet',
    name: 'Collective Merch Closet',
    description: 'AI-assisted merch catalog and virtual fitting-room experience using the Collective garment atlas.',
    kind: 'collective-ai',
    division: 'The Collective / Binary Loom',
    health: 'building',
    progress: 63,
    nextMilestone: 'Verify the fitting-room API and production catalog experience.',
    repository: 'https://github.com/jrmoyler/Collective-Merch-Closet',
    collaborators: ['JR Moyler'],
    tags: ['commerce', 'virtual try-on', 'merch'],
    valueLabel: 'Internal commerce',
  },
  {
    id: 'collective-atlas',
    name: 'Collective Atlas',
    description: 'Living 3D isometric world for Collective AI and its 20 divisions with scroll-driven navigation.',
    kind: 'collective-ai',
    division: 'The Collective / Animus Prime',
    health: 'building',
    progress: 44,
    nextMilestone: 'Replace static scenes with interactive living mini-worlds.',
    collaborators: ['JR Moyler', 'Collective AI creative agents'],
    tags: ['three.js', 'world', 'divisions'],
    valueLabel: 'Flagship experience',
  },
  {
    id: 'collective-times',
    name: 'The Collective Times',
    description: 'Daily executive intelligence newspaper, opportunity engine, and division intelligence matrix.',
    kind: 'platform',
    division: 'Signal Velocity',
    health: 'planning',
    progress: 27,
    nextMilestone: 'Connect research automation to the interactive publication pipeline.',
    collaborators: ['JR Moyler', 'ZenFlow'],
    tags: ['intelligence', 'news', 'automation'],
    valueLabel: 'Executive intelligence',
  },
  {
    id: 'zenflow',
    name: 'ZenFlow Agent Lattice',
    description: 'Collective AI multi-agent coordination layer and 600-agent lattice.',
    kind: 'platform',
    division: 'ZenFlow',
    health: 'building',
    progress: 35,
    nextMilestone: 'Connect HATAALII council routing to persisted agent runs.',
    collaborators: ['JR Moyler', 'Dr. Joseph Johnson'],
    tags: ['agents', 'orchestration', 'platform'],
    valueLabel: 'Core infrastructure',
  },
  {
    id: 'crownfall',
    name: 'Crownfall — The Twenty Realms',
    description: 'Premium 3D action game translating Collective AI divisions into distinct civilizations.',
    kind: 'collective-ai',
    division: 'Animus Prime',
    health: 'building',
    progress: 48,
    nextMilestone: 'Complete the next playable content and asset-polish pass.',
    repository: 'https://github.com/jrmoyler/crownfall-the-twenty-realms',
    collaborators: ['JR Moyler'],
    tags: ['game', 'three.js', '3D'],
    valueLabel: 'Interactive IP',
  },
  {
    id: 'future-champs',
    name: 'Future Champs Series',
    description: 'Youth performance, education, and media products supported by Kinetic Edge systems.',
    kind: 'collective-ai',
    division: 'Kinetic Edge',
    health: 'planning',
    progress: 22,
    nextMilestone: 'Package the workbook, curriculum, and media production pipeline.',
    collaborators: ['JR Moyler', 'Kinetic Edge'],
    tags: ['youth', 'education', 'sports'],
    valueLabel: 'Education IP',
  },
  {
    id: 'impact-community',
    name: 'Impact Community Action Website',
    description: 'Community-action website and digital operating layer.',
    kind: 'client',
    division: 'Civic Core / Nexus Labs',
    health: 'planning',
    progress: 18,
    nextMilestone: 'Complete discovery and approve the initial product scope.',
    collaborators: ['JR Moyler', 'Ahk'],
    tags: ['community', 'website', 'civic'],
    valueLabel: 'Client opportunity',
  },
  {
    id: 'kennel-app',
    name: 'Kennel Dog App',
    description: 'Kennel-management and customer application concept.',
    kind: 'client',
    division: 'Animus Prime / Nexus Labs',
    health: 'planning',
    progress: 12,
    nextMilestone: 'Define personas, operations, and first build milestone.',
    collaborators: ['JR Moyler', 'Ahk'],
    tags: ['animals', 'operations', 'app'],
    valueLabel: 'Pending build',
  },
];

export const ventureStreams: VentureStream[] = [
  { id: 'ai-builds', name: 'AI Systems & Application Builds', description: 'Websites, agents, applications, automation, and operating systems.', stage: 'active', monthlyTarget: 12000, collected: 3200, nextAction: 'Convert qualified class and referral leads into two scoped builds.', collectiveAllocation: 20 },
  { id: 'obm', name: 'AI-Augmented OBM', description: 'Human operational leadership amplified by agent reporting, SOPs, and execution.', stage: 'active', monthlyTarget: 6000, collected: 2000, nextAction: 'Lock two reserved-capacity retainers.', collectiveAllocation: 20 },
  { id: 'academy', name: 'AI Academy & Cohorts', description: 'Classes, implementation labs, recordings, materials, and alumni support.', stage: 'launching', monthlyTarget: 5000, collected: 0, nextAction: 'Deliver Sunday class and route attendees into next-best offers.', collectiveAllocation: 25 },
  { id: 'roaming-lemon', name: 'Roaming Lemon', description: 'Mobile lemonade operation, Lemon Chase, loyalty, and event sales.', stage: 'launching', monthlyTarget: 8000, collected: 0, nextAction: 'Complete the operating checklist and soft-launch path.', collectiveAllocation: 25 },
  { id: 'legalshield', name: 'LegalShield', description: 'Membership education, consultations, follow-up, and associate production.', stage: 'active', monthlyTarget: 2500, collected: 0, nextAction: 'Complete Fast Start training and first production sprint.', collectiveAllocation: 15 },
  { id: 'insurance', name: 'Life Insurance', description: 'Primerica licensing and client-service pipeline.', stage: 'licensing', monthlyTarget: 4000, collected: 0, nextAction: 'Complete licensing and operational setup.', collectiveAllocation: 20 },
  { id: 'trading', name: 'Markets Lab', description: 'Options and crypto research, strategy testing, journaling, and execution tracking.', stage: 'building', monthlyTarget: 1500, collected: 0, nextAction: 'Activate paper-trading and journal workflows.', collectiveAllocation: 10 },
];

export const agentCouncil: AgentDefinition[] = [
  { id: 'hataalii', name: 'HATAALII', role: 'Founder Chief of Staff', description: 'Translates founder intent into coordinated execution across every project and venture.', status: 'online', framework: 'ZenFlow', specialties: ['prioritization', 'delegation', 'briefings'] },
  { id: 'zenith', name: 'ZENITH Orchestrator', role: 'Agent Router', description: 'Selects crews, workflows, models, tools, and execution paths.', status: 'online', framework: 'LangGraph', specialties: ['routing', 'state machines', 'workflows'] },
  { id: 'knowledge-keeper', name: 'Knowledge Keeper', role: 'Institutional Memory', description: 'Maintains decisions, documents, project history, and reusable intelligence.', status: 'ready', framework: 'RAG / Qdrant', specialties: ['memory', 'retrieval', 'decisions'] },
  { id: 'revenue-command', name: 'Revenue Command', role: 'Revenue Strategist', description: 'Prioritizes collections, proposals, conversions, and capital for Collective AI.', status: 'working', framework: 'CrewAI', specialties: ['sales', 'forecasting', 'pricing'] },
  { id: 'solutions-architect', name: 'AI Solutions Architect', role: 'Systems Architect', description: 'Turns business needs into AI services, agents, applications, and operating systems.', status: 'online', framework: 'MetaGPT', specialties: ['architecture', 'agents', 'delivery'] },
  { id: 'portfolio-director', name: 'Collective Portfolio Director', role: 'Program Director', description: 'Coordinates JR Moyler responsibilities across official Collective AI projects.', status: 'working', framework: 'LangGraph', specialties: ['portfolio', 'milestones', 'dependencies'] },
  { id: 'academy-director', name: 'Academy Director', role: 'Cohort Operator', description: 'Runs registration, curriculum, delivery, support, and follow-on pathways.', status: 'ready', framework: 'CrewAI', specialties: ['education', 'cohorts', 'community'] },
  { id: 'creative-director', name: 'Creative Production Director', role: 'Studio Orchestrator', description: 'Routes image, video, voice, 3D, game, and brand-production workflows.', status: 'ready', framework: 'ComfyUI / Blender', specialties: ['visuals', 'video', '3D'] },
  { id: 'build-director', name: 'Build Director', role: 'Software Delivery Lead', description: 'Coordinates repositories, tests, deployments, QA, and client releases.', status: 'working', framework: 'MetaGPT / GitHub', specialties: ['engineering', 'QA', 'deployment'] },
  { id: 'lemon-gm', name: 'Roaming Lemon GM', role: 'Venture Operator', description: 'Coordinates licensing, menu, inventory, locations, events, and Lemon Chase.', status: 'ready', framework: 'CrewAI', specialties: ['retail', 'events', 'inventory'] },
];

function tool(
  id: string,
  name: string,
  category: ToolCategory,
  description: string,
  repository: string,
  runtime: ToolRuntime,
  tags: string[],
  options: Partial<Pick<ToolDefinition, 'defaultPort' | 'launchCommand' | 'uiPath' | 'status'>> = {},
): ToolDefinition {
  return { id, name, category, description, repository, runtime, tags, status: 'not-installed', ...options };
}

export const toolRegistry: ToolDefinition[] = [
  tool('mirofish', 'MiroFish', 'Agent Council', 'Multi-agent simulation and prediction engine for scenario exploration.', 'https://github.com/666ghj/MiroFish', 'framework', ['simulation', 'agents']),
  tool('mirofish-offline', 'MiroFish Offline', 'Agent Council', 'Offline-oriented MiroFish fork for local simulation workflows.', 'https://github.com/nikmcfly/MiroFish-Offline', 'framework', ['offline', 'simulation']),
  tool('camel', 'CAMEL', 'Agent Council', 'Multi-agent framework for communicative agents and role-playing societies.', 'https://github.com/camel-ai/camel', 'framework', ['agents', 'societies']),
  tool('crewai', 'CrewAI', 'Agent Council', 'Role-based autonomous agent crews and production flows.', 'https://github.com/crewAIInc/crewAI', 'framework', ['crews', 'automation']),
  tool('autogen', 'AutoGen', 'Agent Council', 'Microsoft framework for event-driven and conversational multi-agent systems.', 'https://github.com/microsoft/autogen', 'framework', ['agents', 'events']),
  tool('langgraph', 'LangGraph', 'Agent Council', 'Stateful agent workflows, durable execution, and human-in-the-loop graphs.', 'https://github.com/langchain-ai/langgraph', 'framework', ['state', 'orchestration']),
  tool('metagpt', 'MetaGPT', 'Agent Council', 'Software-company-style multi-agent framework for product and engineering work.', 'https://github.com/geekan/MetaGPT', 'framework', ['software', 'agents']),

  tool('voicebox', 'Voicebox', 'Voice & Audio', 'Local AI voice studio and voice-cloning workspace.', 'https://github.com/jamiepine/voicebox', 'local-service', ['voice', 'cloning']),
  tool('openvoice', 'OpenVoice', 'Voice & Audio', 'Instant voice cloning and flexible speech-style control.', 'https://github.com/myshell-ai/OpenVoice', 'cli', ['voice', 'cloning']),
  tool('f5-tts', 'F5-TTS', 'Voice & Audio', 'Flow-matching text-to-speech research and inference toolkit.', 'https://github.com/SWivid/F5-TTS', 'local-service', ['tts', 'speech']),
  tool('fish-speech', 'Fish Speech', 'Voice & Audio', 'Open-source speech generation system for high-quality multilingual audio.', 'https://github.com/fishaudio/fish-speech', 'local-service', ['tts', 'multilingual']),
  tool('coqui-tts', 'Coqui TTS / XTTS', 'Voice & Audio', 'Deep-learning toolkit for text-to-speech training and inference.', 'https://github.com/coqui-ai/TTS', 'cli', ['tts', 'xtts']),
  tool('whisperlive', 'WhisperLive', 'Voice & Audio', 'Low-latency real-time transcription server built around Whisper backends.', 'https://github.com/collabora/WhisperLive', 'local-service', ['transcription', 'realtime']),
  tool('whisper', 'Whisper', 'Voice & Audio', 'OpenAI general-purpose speech-recognition model and inference package.', 'https://github.com/openai/whisper', 'cli', ['transcription', 'speech']),
  tool('realtimestt', 'RealtimeSTT', 'Voice & Audio', 'Real-time speech-to-text library for voice applications.', 'https://github.com/KoljaB/RealtimeSTT', 'local-service', ['transcription', 'realtime']),
  tool('ebook2audiobook', 'ebook2audiobook', 'Voice & Audio', 'Convert ebooks into narrated audiobooks with local and cloud speech engines.', 'https://github.com/DrewThomasson/ebook2audiobook', 'local-service', ['audiobook', 'publishing']),
  tool('pdf-narrator', 'PDF Narrator', 'Voice & Audio', 'Narrate PDF documents through an automated audio pipeline.', 'https://github.com/mateogon/pdf-narrator', 'cli', ['pdf', 'audiobook']),

  tool('triposr', 'TripoSR', '3D & Visual', 'Generate 3D objects from a single image.', 'https://github.com/VAST-AI-Research/TripoSR', 'local-service', ['image-to-3d', 'mesh']),
  tool('instantmesh', 'InstantMesh', '3D & Visual', 'Sparse-view reconstruction for creating 3D meshes from images.', 'https://github.com/TencentARC/InstantMesh', 'local-service', ['image-to-3d', 'mesh']),
  tool('gaussian-splatting', 'Gaussian Splatting', '3D & Visual', 'Official implementation for real-time radiance-field rendering with 3D Gaussians.', 'https://github.com/graphdeco-inria/gaussian-splatting', 'cli', ['splatting', 'rendering']),
  tool('supersplat', 'SuperSplat', '3D & Visual', 'Browser-based editor for inspecting and editing Gaussian splats.', 'https://github.com/playcanvas/supersplat', 'web-ui', ['splatting', 'editor']),
  tool('unirig', 'UniRig', '3D & Visual', 'Automatic rigging pipeline for 3D characters and assets.', 'https://github.com/VAST-AI-Research/UniRig', 'local-service', ['rigging', 'characters']),
  tool('puppeteer-3d', 'Puppeteer', '3D & Visual', 'Rigging and animation research pipeline for generated 3D characters.', 'https://github.com/Seed3D/Puppeteer', 'local-service', ['rigging', 'animation']),

  tool('comfyui', 'ComfyUI', 'Studios', 'Node-based generative image, video, and model workflow environment.', 'https://github.com/comfyanonymous/ComfyUI', 'local-service', ['image', 'video', 'workflows'], { defaultPort: 8188, launchCommand: 'python main.py' }),
  tool('comfystudio', 'ComfyStudio', 'Studios', 'Video-editing and production environment built around ComfyUI workflows.', 'https://github.com/JaimeIsMe/ComfyStudio', 'desktop-app', ['video', 'editing']),
  tool('godot', 'Godot Engine', 'Studios', 'Open-source 2D and 3D game engine.', 'https://github.com/godotengine/godot', 'desktop-app', ['game', 'engine']),
  tool('blender', 'Blender', 'Studios', 'Open-source 3D creation suite for modeling, animation, rendering, and VFX.', 'https://github.com/blender/blender', 'desktop-app', ['3D', 'animation']),
  tool('penpot', 'Penpot', 'Studios', 'Open-source design and prototyping platform.', 'https://github.com/penpot/penpot', 'web-ui', ['design', 'prototype']),

  tool('plane', 'Plane', 'Productivity', 'Open-source project and product-management workspace.', 'https://github.com/makeplane/plane', 'web-ui', ['projects', 'kanban']),
  tool('wekan', 'WeKan', 'Productivity', 'Open-source kanban board for team and personal workflows.', 'https://github.com/wekan/wekan', 'web-ui', ['kanban', 'tasks']),
  tool('logseq', 'Logseq', 'Productivity', 'Privacy-first knowledge graph, notes, and research environment.', 'https://github.com/logseq/logseq', 'desktop-app', ['knowledge', 'notes']),
  tool('appflowy', 'AppFlowy', 'Productivity', 'Open-source workspace for documents, databases, and collaborative planning.', 'https://github.com/AppFlowy-IO/AppFlowy', 'desktop-app', ['documents', 'workspace']),
  tool('twenty', 'Twenty CRM', 'Productivity', 'Open-source CRM for contacts, organizations, opportunities, and workflows.', 'https://github.com/twentyhq/twenty', 'web-ui', ['crm', 'sales']),
  tool('documenso', 'Documenso', 'Productivity', 'Open-source electronic-signature platform.', 'https://github.com/documenso/documenso', 'web-ui', ['documents', 'signature']),
  tool('calcom', 'Cal.com', 'Productivity', 'Open-source scheduling infrastructure for appointments and classes.', 'https://github.com/calcom/cal.com', 'web-ui', ['calendar', 'booking']),
  tool('chatwoot', 'Chatwoot', 'Productivity', 'Open-source customer engagement and support platform.', 'https://github.com/chatwoot/chatwoot', 'web-ui', ['support', 'inbox']),
  tool('formbricks', 'Formbricks', 'Productivity', 'Open-source surveys, feedback, and experience management.', 'https://github.com/formbricks/formbricks', 'web-ui', ['forms', 'feedback']),
  tool('baserow', 'Baserow', 'Productivity', 'Open-source no-code database and application platform.', 'https://github.com/bramw/baserow', 'web-ui', ['database', 'operations']),

  tool('freqtrade', 'Freqtrade', 'Trading & Markets', 'Open-source cryptocurrency trading bot with strategy testing and dry-run support.', 'https://github.com/freqtrade/freqtrade', 'local-service', ['crypto', 'backtesting']),
  tool('lean', 'LEAN', 'Trading & Markets', 'QuantConnect open-source algorithmic trading engine.', 'https://github.com/QuantConnect/Lean', 'cli', ['stocks', 'options', 'backtesting']),
  tool('ccxt', 'CCXT', 'Trading & Markets', 'Unified cryptocurrency exchange API library.', 'https://github.com/ccxt/ccxt', 'framework', ['crypto', 'market data']),

  tool('ollama', 'Ollama', 'Infrastructure', 'Run and manage local language models through a local API.', 'https://github.com/ollama/ollama', 'local-service', ['local models', 'llm'], { defaultPort: 11434, launchCommand: 'ollama serve' }),
  tool('label-studio', 'Label Studio', 'Infrastructure', 'Open-source data-labeling platform for machine-learning datasets.', 'https://github.com/HumanSignal/label-studio', 'local-service', ['data', 'labeling'], { defaultPort: 8080, launchCommand: 'label-studio start' }),
  tool('coolify', 'Coolify', 'Infrastructure', 'Self-hosted application and service deployment platform.', 'https://github.com/coollabsio/coolify', 'web-ui', ['deployment', 'hosting']),
  tool('litellm', 'LiteLLM', 'Infrastructure', 'OpenAI-compatible model gateway, routing, budgets, and observability.', 'https://github.com/BerriAI/litellm', 'local-service', ['models', 'gateway']),
  tool('open-webui', 'Open WebUI', 'Infrastructure', 'Self-hosted user interface for Ollama and OpenAI-compatible model APIs.', 'https://github.com/open-webui/open-webui', 'web-ui', ['chat', 'local models']),
  tool('dify', 'Dify', 'Infrastructure', 'Open-source platform for developing LLM applications and workflows.', 'https://github.com/langgenius/dify', 'web-ui', ['agents', 'workflows']),
  tool('langflow', 'Langflow', 'Infrastructure', 'Visual framework for building and testing agent and retrieval workflows.', 'https://github.com/langflow-ai/langflow', 'web-ui', ['agents', 'visual builder']),
  tool('langfuse', 'Langfuse', 'Infrastructure', 'Open-source LLM tracing, prompt management, evaluation, and analytics.', 'https://github.com/langfuse/langfuse', 'web-ui', ['observability', 'prompts']),
  tool('qdrant', 'Qdrant', 'Infrastructure', 'Vector database for semantic search and Knowledge Keeper memory.', 'https://github.com/qdrant/qdrant', 'local-service', ['vectors', 'memory']),
  tool('metabase', 'Metabase', 'Infrastructure', 'Open-source business intelligence and analytics.', 'https://github.com/metabase/metabase', 'web-ui', ['analytics', 'dashboards']),
  tool('uptime-kuma', 'Uptime Kuma', 'Infrastructure', 'Self-hosted uptime and service-status monitoring.', 'https://github.com/louislam/uptime-kuma', 'web-ui', ['monitoring', 'status']),
  tool('posthog', 'PostHog', 'Infrastructure', 'Open-source product analytics, session replay, and feature management.', 'https://github.com/PostHog/posthog', 'web-ui', ['analytics', 'product']),
  tool('minio', 'MinIO', 'Infrastructure', 'S3-compatible object storage for files, media, models, and datasets.', 'https://github.com/minio/minio', 'local-service', ['storage', 'assets']),

  tool('openhands', 'OpenHands', 'Developer Tools', 'Open-source platform for agentic software development.', 'https://github.com/All-Hands-AI/OpenHands', 'web-ui', ['coding', 'agents']),
  tool('continue', 'Continue', 'Developer Tools', 'Open-source AI coding assistant for IDE workflows.', 'https://github.com/continuedev/continue', 'desktop-app', ['coding', 'IDE']),
  tool('aider', 'Aider', 'Developer Tools', 'Terminal-based repository-aware AI pair programmer.', 'https://github.com/Aider-AI/aider', 'cli', ['coding', 'git']),
  tool('playwright', 'Playwright', 'Developer Tools', 'Reliable browser automation and end-to-end testing.', 'https://github.com/microsoft/playwright', 'framework', ['testing', 'browser']),
  tool('appsmith', 'Appsmith', 'Developer Tools', 'Open-source platform for rapidly building internal tools.', 'https://github.com/appsmithorg/appsmith', 'web-ui', ['internal tools', 'low-code']),
  tool('docling', 'Docling', 'Developer Tools', 'Document conversion and structured extraction for AI pipelines.', 'https://github.com/docling-project/docling', 'cli', ['documents', 'ingestion']),
  tool('meilisearch', 'Meilisearch', 'Developer Tools', 'Fast search engine for projects, contacts, tools, and documents.', 'https://github.com/meilisearch/meilisearch', 'local-service', ['search', 'indexing']),
];

export function searchCommandCenter(query: string): SearchResult[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [];

  const matches = (values: string[]) => values.some(value => value.toLocaleLowerCase().includes(normalized));

  const projects: SearchResult[] = collectiveProjects
    .filter(project => matches([project.name, project.description, project.division, ...project.tags]))
    .map(project => ({ id: project.id, type: 'project', title: project.name, subtitle: project.nextMilestone, section: 'portfolio' }));

  const ventures: SearchResult[] = ventureStreams
    .filter(stream => matches([stream.name, stream.description, stream.nextAction]))
    .map(stream => ({ id: stream.id, type: 'venture', title: stream.name, subtitle: stream.nextAction, section: 'revenue' }));

  const agents: SearchResult[] = agentCouncil
    .filter(agent => matches([agent.name, agent.role, agent.description, ...agent.specialties]))
    .map(agent => ({ id: agent.id, type: 'agent', title: agent.name, subtitle: agent.role, section: 'council' }));

  const tools: SearchResult[] = toolRegistry
    .filter(item => matches([item.name, item.category, item.description, ...item.tags]))
    .map(item => ({ id: item.id, type: 'tool', title: item.name, subtitle: item.category, section: 'tools' }));

  return [...projects, ...ventures, ...agents, ...tools].slice(0, 24);
}
