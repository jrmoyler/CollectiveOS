import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { AppId, BrowserTab, CRMDeal, WindowState } from '../types';

interface OSStore {
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  activeDepartment: string;
  setActiveDepartment: (department: string) => void;
  deals: CRMDeal[];
  moveDeal: (dealId: string, stage: CRMDeal['stage']) => void;
  addDeal: (deal: Omit<CRMDeal, 'id'>) => void;
  browserTabs: BrowserTab[];
  addBrowserTab: (url: string) => void;
  closeBrowserTab: (id: string) => void;
  setActiveBrowserTab: (id: string) => void;
  updateBrowserTabUrl: (id: string, url: string, title?: string) => void;
}

const APP_TITLES: Record<AppId, string> = {
  'founder-cockpit': 'Founder Cockpit',
  'mission-control': 'Collective AI Mission Control',
  'agent-council': 'Agent Council & Orchestrator',
  'tool-forge': 'Open-source Tool Forge',
  'agent-hive': 'Agent Hive',
  crm: 'Collective CRM',
  'c-u-later': 'C-U-Later',
  'collect-a-sign': 'Collect-A-Sign',
  browser: 'Chrome',
};

const APP_DEFAULTS: Record<AppId, { width: number; height: number }> = {
  'founder-cockpit': { width: 1120, height: 720 },
  'mission-control': { width: 1180, height: 760 },
  'agent-council': { width: 1080, height: 720 },
  'tool-forge': { width: 1180, height: 760 },
  'agent-hive': { width: 900, height: 620 },
  crm: { width: 1000, height: 650 },
  'c-u-later': { width: 850, height: 600 },
  'collect-a-sign': { width: 800, height: 600 },
  browser: { width: 1000, height: 700 },
};

const INITIAL_DEALS: CRMDeal[] = [
  { id: '1', name: 'AI Business Operating System', company: 'Qualified Class Lead', value: 6000, stage: 'lead', winProbability: 35, contact: 'Discovery pending', lastActivity: 'Today' },
  { id: '2', name: 'AI-Augmented OBM Retainer', company: 'Operations Client A', value: 2400, stage: 'negotiation', winProbability: 68, contact: 'Founder', lastActivity: '2h ago' },
  { id: '3', name: 'Exclusive Essence Maintenance', company: 'Exclusive Essence', value: 1600, stage: 'won', winProbability: 100, contact: 'Client team', lastActivity: 'Today' },
  { id: '4', name: 'Custom Agent Workforce', company: 'Qualified Referral', value: 4500, stage: 'lead', winProbability: 42, contact: 'Discovery pending', lastActivity: '1d ago' },
  { id: '5', name: 'AI Conversion Website', company: 'Local Business', value: 2500, stage: 'negotiation', winProbability: 72, contact: 'Owner', lastActivity: '4h ago' },
];

function createWindow(appId: AppId, existingCount: number, zIndex: number): WindowState {
  const defaults = APP_DEFAULTS[appId];
  const offset = (existingCount % 6) * 28;
  return {
    id: uuidv4(),
    appId,
    title: APP_TITLES[appId],
    x: 48 + offset,
    y: 48 + offset,
    width: defaults.width,
    height: defaults.height,
    isMinimized: false,
    isMaximized: false,
    zIndex,
  };
}

function highestWindowId(windows: WindowState[]): string | null {
  return [...windows].sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null;
}

export const useOSStore = create<OSStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 100,

  openApp: appId => {
    const existing = get().windows.find(windowState => windowState.appId === appId && !windowState.isMinimized);
    if (existing) {
      get().focusWindow(existing.id);
      return;
    }

    const minimized = get().windows.find(windowState => windowState.appId === appId && windowState.isMinimized);
    if (minimized) {
      set(state => ({
        windows: state.windows.map(windowState => windowState.id === minimized.id
          ? { ...windowState, isMinimized: false, zIndex: state.nextZIndex }
          : windowState),
        activeWindowId: minimized.id,
        nextZIndex: state.nextZIndex + 1,
      }));
      return;
    }

    const newWindow = createWindow(appId, get().windows.length, get().nextZIndex);
    set(state => ({
      windows: [...state.windows, newWindow],
      activeWindowId: newWindow.id,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeWindow: id => set(state => {
    const remaining = state.windows.filter(windowState => windowState.id !== id);
    return {
      windows: remaining,
      activeWindowId: state.activeWindowId === id ? highestWindowId(remaining) : state.activeWindowId,
    };
  }),

  focusWindow: id => set(state => ({
    windows: state.windows.map(windowState => windowState.id === id ? { ...windowState, zIndex: state.nextZIndex } : windowState),
    activeWindowId: id,
    nextZIndex: state.nextZIndex + 1,
  })),

  minimizeWindow: id => set(state => {
    const windows = state.windows.map(windowState => windowState.id === id ? { ...windowState, isMinimized: true } : windowState);
    const visible = windows.filter(windowState => !windowState.isMinimized && windowState.id !== id);
    return {
      windows,
      activeWindowId: state.activeWindowId === id ? highestWindowId(visible) : state.activeWindowId,
    };
  }),

  maximizeWindow: id => set(state => ({
    windows: state.windows.map(windowState => windowState.id === id
      ? { ...windowState, isMaximized: !windowState.isMaximized, zIndex: state.nextZIndex }
      : windowState),
    activeWindowId: id,
    nextZIndex: state.nextZIndex + 1,
  })),

  updateWindowPosition: (id, x, y) => set(state => ({
    windows: state.windows.map(windowState => windowState.id === id ? { ...windowState, x, y } : windowState),
  })),

  updateWindowSize: (id, width, height) => set(state => ({
    windows: state.windows.map(windowState => windowState.id === id ? { ...windowState, width, height } : windowState),
  })),

  activeDepartment: 'Founder Command',
  setActiveDepartment: activeDepartment => set({ activeDepartment }),

  deals: INITIAL_DEALS,
  moveDeal: (dealId, stage) => set(state => ({
    deals: state.deals.map(deal => deal.id === dealId
      ? { ...deal, stage, winProbability: stage === 'won' ? 100 : deal.winProbability }
      : deal),
  })),
  addDeal: deal => set(state => ({ deals: [...state.deals, { ...deal, id: uuidv4() }] })),

  browserTabs: [{ id: 'tab-1', title: 'Collective AI', url: 'https://www.collectiveaiinc.com', isActive: true }],
  addBrowserTab: url => {
    const id = uuidv4();
    set(state => ({
      browserTabs: [
        ...state.browserTabs.map(tab => ({ ...tab, isActive: false })),
        { id, title: 'New Tab', url, isActive: true },
      ],
    }));
  },
  closeBrowserTab: id => set(state => {
    const remaining = state.browserTabs.filter(tab => tab.id !== id);
    if (!remaining.length) {
      return { browserTabs: [{ id: uuidv4(), title: 'New Tab', url: 'https://www.google.com', isActive: true }] };
    }
    if (state.browserTabs.find(tab => tab.id === id)?.isActive) {
      const last = remaining[remaining.length - 1];
      return { browserTabs: remaining.map(tab => ({ ...tab, isActive: tab.id === last.id })) };
    }
    return { browserTabs: remaining };
  }),
  setActiveBrowserTab: id => set(state => ({
    browserTabs: state.browserTabs.map(tab => ({ ...tab, isActive: tab.id === id })),
  })),
  updateBrowserTabUrl: (id, url, title) => set(state => ({
    browserTabs: state.browserTabs.map(tab => tab.id === id ? { ...tab, url, title: title ?? tab.title } : tab),
  })),
}));
