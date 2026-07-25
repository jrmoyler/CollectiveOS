export type CommandSection = 'cockpit' | 'portfolio' | 'revenue' | 'council' | 'tools';

export type ProjectHealth = 'on-track' | 'attention' | 'building' | 'planning';
export type ProjectKind = 'collective-ai' | 'client' | 'platform' | 'venture';

export interface ProjectDefinition {
  id: string;
  name: string;
  description: string;
  kind: ProjectKind;
  division: string;
  health: ProjectHealth;
  progress: number;
  nextMilestone: string;
  repository?: string;
  liveUrl?: string;
  collaborators: string[];
  tags: string[];
  valueLabel: string;
}

export interface VentureStream {
  id: string;
  name: string;
  description: string;
  stage: 'active' | 'launching' | 'licensing' | 'building';
  monthlyTarget: number;
  collected: number;
  nextAction: string;
  collectiveAllocation: number;
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'online' | 'ready' | 'working';
  framework: string;
  specialties: string[];
}

export type ToolCategory =
  | 'Agent Council'
  | 'Voice & Audio'
  | '3D & Visual'
  | 'Studios'
  | 'Productivity'
  | 'Trading & Markets'
  | 'Infrastructure'
  | 'Developer Tools';

export type ToolRuntime = 'web-ui' | 'local-service' | 'desktop-app' | 'cli' | 'framework';

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  repository: string;
  runtime: ToolRuntime;
  status: 'available' | 'not-installed' | 'configured';
  defaultPort?: number;
  launchCommand?: string;
  uiPath?: string;
  tags: string[];
}

export interface CommandMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: 'up' | 'steady' | 'attention';
}

export interface SearchResult {
  id: string;
  type: 'project' | 'venture' | 'agent' | 'tool';
  title: string;
  subtitle: string;
  section: CommandSection;
}
