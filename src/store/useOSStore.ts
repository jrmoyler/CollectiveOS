import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { AppId, WindowState, CRMDeal, BrowserTab } from '../types';

interface OSStore {
  // Windows
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

  // Active department for menubar
  activeDepartment: string;
  setActiveDepartment: (dept: string) => void;

  // CRM
  deals: CRMDeal[];
  moveDeal: (dealId: string, stage: CRMDeal['stage']) => void;
  addDeal: (deal: Omit<CRMDeal, 'id'>) => void;

  // Browser
  browserTabs: BrowserTab[];
  addBrowserTab: (url: string) => void;
  closeBrowserTab: (id: string) => void;
  setActiveBrowserTab: (id: string) => void;
  updateBrowserTabUrl: (id: string, url: string, title?: string) => void;
}

const APP_TITLES: Record<AppId, string> = {
  'agent-hive': 'Agent Hive',
  'crm': 'Collective CRM',
  'c-u-later': 'C-U-Later',
  'collect-a-sign': 'Collect-A-Sign',
  'browser': 'Chrome',
};

const APP_DEFAULTS: Record<AppId, { width: number; height: number }> = {
  'agent-hive': { width: 900, height: 620 },
  'crm': { width: 1000, height: 650 },
  'c-u-later': { width: 850, height: 600 },
  'collect-a-sign': { width: 800, height: 600 },
  'browser': { width: 1000, height: 700 },
};

const INITIAL_DEALS: CRMDeal[] = [
  { id: '1', name: 'Enterprise AI Suite', company: 'TechCorp Global', value: 250000, stage: 'lead', winProbability: 35, contact: 'Sarah Chen', lastActivity: '2h ago' },
  { id: '2', name: 'Data Pipeline Integration', company: 'DataFlow Inc', value: 180000, stage: 'lead', winProbability: 42, contact: 'Marcus Rivera', lastActivity: '4h ago' },
  { id: '3', name: 'ML Ops Platform', company: 'CloudScale', value: 420000, stage: 'negotiation', winProbability: 68, contact: 'Aisha Patel', lastActivity: '1h ago' },
  { id: '4', name: 'Predictive Analytics', company: 'RetailMax', value: 95000, stage: 'negotiation', winProbability: 72, contact: 'James Wu', lastActivity: '30m ago' },
  { id: '5', name: 'NLP Chatbot Deploy', company: 'FinServ Ltd', value: 320000, stage: 'negotiation', winProbability: 81, contact: 'Elena Volkov', lastActivity: '1d ago' },
  { id: '6', name: 'Computer Vision QA', company: 'ManuTech', value: 150000, stage: 'won', winProbability: 100, contact: 'David Kim', lastActivity: '2d ago' },
  { id: '7', name: 'AI Security Audit', company: 'SecureNet', value: 88000, stage: 'won', winProbability: 100, contact: 'Lisa Nakamura', lastActivity: '3d ago' },
  { id: '8', name: 'AutoML Pipeline', company: 'BioGen Research', value: 540000, stage: 'lead', winProbability: 28, contact: 'Omar Hassan', lastActivity: '5h ago' },
];

export const useOSStore = create<OSStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 100,

  openApp: (appId) => {
    const existing = get().windows.find(w => w.appId === appId && !w.isMinimized);
    if (existing) {
      get().focusWindow(existing.id);
      return;
    }

    const minimized = get().windows.find(w => w.appId === appId && w.isMinimized);
    if (minimized) {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === minimized.id ? { ...w, isMinimized: false, zIndex: state.nextZIndex } : w
        ),
        activeWindowId: minimized.id,
        nextZIndex: state.nextZIndex + 1,
      }));
      return;
    }

    const defaults = APP_DEFAULTS[appId];
    const offset = get().windows.length * 30;
    const newWindow: WindowState = {
      id: uuidv4(),
      appId,
      title: APP_TITLES[appId],
      x: 80 + offset,
      y: 60 + offset,
      width: defaults.width,
      height: defaults.height,
      isMinimized: false,
      isMaximized: false,
      zIndex: get().nextZIndex,
    };

    set(state => ({
      windows: [...state.windows, newWindow],
      activeWindowId: newWindow.id,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeWindow: (id) => {
    set(state => ({
      windows: state.windows.filter(w => w.id !== id),
      activeWindowId: state.activeWindowId === id
        ? state.windows.filter(w => w.id !== id).sort((a, b) => b.zIndex - a.zIndex)[0]?.id || null
        : state.activeWindowId,
    }));
  },

  focusWindow: (id) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, zIndex: state.nextZIndex } : w
      ),
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  minimizeWindow: (id) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: state.activeWindowId === id
        ? state.windows.filter(w => w.id !== id && !w.isMinimized).sort((a, b) => b.zIndex - a.zIndex)[0]?.id || null
        : state.activeWindowId,
    }));
  },

  maximizeWindow: (id) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: state.nextZIndex } : w
      ),
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  updateWindowPosition: (id, x, y) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, x, y } : w
      ),
    }));
  },

  updateWindowSize: (id, width, height) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, width, height } : w
      ),
    }));
  },

  activeDepartment: 'Nexus Labs',
  setActiveDepartment: (dept) => set({ activeDepartment: dept }),

  deals: INITIAL_DEALS,
  moveDeal: (dealId, stage) => {
    set(state => ({
      deals: state.deals.map(d =>
        d.id === dealId
          ? { ...d, stage, winProbability: stage === 'won' ? 100 : d.winProbability }
          : d
      ),
    }));
  },
  addDeal: (deal) => {
    set(state => ({
      deals: [...state.deals, { ...deal, id: uuidv4() }],
    }));
  },

  browserTabs: [
    { id: 'tab-1', title: 'Google', url: 'https://www.google.com', isActive: true },
  ],
  addBrowserTab: (url) => {
    const id = uuidv4();
    set(state => ({
      browserTabs: [
        ...state.browserTabs.map(t => ({ ...t, isActive: false })),
        { id, title: 'New Tab', url, isActive: true },
      ],
    }));
  },
  closeBrowserTab: (id) => {
    set(state => {
      const remaining = state.browserTabs.filter(t => t.id !== id);
      if (remaining.length === 0) {
        return { browserTabs: [{ id: uuidv4(), title: 'New Tab', url: 'https://www.google.com', isActive: true }] };
      }
      const wasActive = state.browserTabs.find(t => t.id === id)?.isActive;
      if (wasActive && remaining.length > 0) {
        remaining[remaining.length - 1].isActive = true;
      }
      return { browserTabs: remaining };
    });
  },
  setActiveBrowserTab: (id) => {
    set(state => ({
      browserTabs: state.browserTabs.map(t => ({ ...t, isActive: t.id === id })),
    }));
  },
  updateBrowserTabUrl: (id, url, title) => {
    set(state => ({
      browserTabs: state.browserTabs.map(t =>
        t.id === id ? { ...t, url, title: title || t.title } : t
      ),
    }));
  },
}));
