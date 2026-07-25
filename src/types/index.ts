export type AppId =
  | 'founder-cockpit'
  | 'mission-control'
  | 'agent-council'
  | 'tool-forge'
  | 'agent-hive'
  | 'crm'
  | 'c-u-later'
  | 'collect-a-sign'
  | 'browser';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface AppDefinition {
  id: AppId;
  name: string;
  icon: string;
  color: string;
  department?: string;
}

export interface Agent {
  id: string;
  name: string;
  department: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
  avatar: string;
  specialty: string;
}

export interface ChatMessage {
  id: string;
  agentId: string;
  agentName: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export interface CRMDeal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: 'lead' | 'negotiation' | 'won';
  winProbability: number;
  contact: string;
  lastActivity: string;
}

export interface SignatureDocument {
  id: string;
  name: string;
  status: 'pending' | 'signed';
  fileUrl?: string;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

export type Platform = 'desktop' | 'mobile';
