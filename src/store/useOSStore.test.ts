import { describe, it, expect, beforeEach } from 'vitest';
import { useOSStore } from './useOSStore';
import type { AppId } from '../types';

describe('useOSStore', () => {
  // Reset store before each test to ensure isolation
  beforeEach(() => {
    useOSStore.setState({
      windows: [],
      activeWindowId: null,
      nextZIndex: 100,
      activeDepartment: 'Nexus Labs',
      deals: [],
      browserTabs: [{ id: 'tab-1', title: 'Google', url: 'https://www.google.com', isActive: true }],
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useOSStore.getState();
      expect(state.windows).toEqual([]);
      expect(state.activeWindowId).toBeNull();
      expect(state.nextZIndex).toBe(100);
      expect(state.activeDepartment).toBe('Nexus Labs');
    });
  });

  describe('Window Management - openApp', () => {
    it('should open a new app window with correct properties', () => {
      const { openApp } = useOSStore.getState();
      openApp('agent-hive');

      const state = useOSStore.getState();
      expect(state.windows).toHaveLength(1);
      expect(state.windows[0].appId).toBe('agent-hive');
      expect(state.windows[0].title).toBe('Agent Hive');
      expect(state.windows[0].width).toBe(900);
      expect(state.windows[0].height).toBe(620);
      expect(state.windows[0].isMinimized).toBe(false);
      expect(state.windows[0].isMaximized).toBe(false);
      expect(state.windows[0].zIndex).toBe(100);
      expect(state.activeWindowId).toBe(state.windows[0].id);
    });

    it('should focus existing window instead of opening duplicate', () => {
      const { openApp } = useOSStore.getState();
      openApp('crm');
      const firstState = useOSStore.getState();
      const windowId = firstState.windows[0].id;
      const initialZIndex = firstState.windows[0].zIndex;

      openApp('crm');
      const secondState = useOSStore.getState();

      expect(secondState.windows).toHaveLength(1);
      expect(secondState.windows[0].id).toBe(windowId);
      expect(secondState.windows[0].zIndex).toBeGreaterThan(initialZIndex);
    });

    it('should restore minimized window when opening same app', () => {
      const { openApp, minimizeWindow } = useOSStore.getState();
      openApp('browser');
      const windowId = useOSStore.getState().windows[0].id;

      minimizeWindow(windowId);
      expect(useOSStore.getState().windows[0].isMinimized).toBe(true);

      openApp('browser');
      expect(useOSStore.getState().windows[0].isMinimized).toBe(false);
      expect(useOSStore.getState().activeWindowId).toBe(windowId);
    });

    it('should cascade multiple windows with offset positioning', () => {
      const { openApp } = useOSStore.getState();
      openApp('agent-hive');
      openApp('crm');
      openApp('browser');

      const state = useOSStore.getState();
      expect(state.windows).toHaveLength(3);

      // Check cascading offsets
      expect(state.windows[0].x).toBe(80);
      expect(state.windows[0].y).toBe(60);
      expect(state.windows[1].x).toBe(110);
      expect(state.windows[1].y).toBe(90);
      expect(state.windows[2].x).toBe(140);
      expect(state.windows[2].y).toBe(120);
    });
  });

  describe('Window Management - closeWindow', () => {
    it('should close window and update activeWindowId', () => {
      const { openApp, closeWindow } = useOSStore.getState();
      openApp('agent-hive');
      const windowId = useOSStore.getState().windows[0].id;

      closeWindow(windowId);
      const state = useOSStore.getState();

      expect(state.windows).toHaveLength(0);
      expect(state.activeWindowId).toBeNull();
    });

    it('should set next highest zIndex window as active when closing active window', () => {
      const { openApp, closeWindow } = useOSStore.getState();
      openApp('agent-hive');
      openApp('crm');
      openApp('browser');

      const state = useOSStore.getState();
      const activeId = state.activeWindowId;
      const remainingWindows = state.windows.filter(w => w.id !== activeId);
      const expectedNewActive = remainingWindows.sort((a, b) => b.zIndex - a.zIndex)[0];

      closeWindow(activeId!);
      expect(useOSStore.getState().activeWindowId).toBe(expectedNewActive.id);
    });

    it('should handle closing non-existent window gracefully', () => {
      const { closeWindow } = useOSStore.getState();

      // Should not throw error
      expect(() => closeWindow('non-existent-id')).not.toThrow();
      expect(useOSStore.getState().windows).toHaveLength(0);
    });
  });

  describe('Window Management - focusWindow', () => {
    it('should focus window and update zIndex', () => {
      const { openApp, focusWindow } = useOSStore.getState();
      openApp('agent-hive');
      openApp('crm');

      const state = useOSStore.getState();
      const firstWindowId = state.windows[0].id;
      const initialZIndex = state.windows[0].zIndex;

      focusWindow(firstWindowId);
      const newState = useOSStore.getState();

      expect(newState.activeWindowId).toBe(firstWindowId);
      expect(newState.windows[0].zIndex).toBeGreaterThan(initialZIndex);
    });
  });

  describe('Window Management - minimizeWindow', () => {
    it('should minimize window', () => {
      const { openApp, minimizeWindow } = useOSStore.getState();
      openApp('agent-hive');
      const windowId = useOSStore.getState().windows[0].id;

      minimizeWindow(windowId);
      expect(useOSStore.getState().windows[0].isMinimized).toBe(true);
    });

    it('should set next window as active when minimizing active window', () => {
      const { openApp, minimizeWindow } = useOSStore.getState();
      openApp('agent-hive');
      openApp('crm');

      const state = useOSStore.getState();
      const activeId = state.activeWindowId;

      minimizeWindow(activeId!);
      const newState = useOSStore.getState();

      expect(newState.activeWindowId).not.toBe(activeId);
      expect(newState.activeWindowId).toBeTruthy();
    });

    it('should set activeWindowId to null when all windows are minimized', () => {
      const { openApp, minimizeWindow } = useOSStore.getState();
      openApp('agent-hive');
      const windowId = useOSStore.getState().windows[0].id;

      minimizeWindow(windowId);
      expect(useOSStore.getState().activeWindowId).toBeNull();
    });
  });

  describe('Window Management - maximizeWindow', () => {
    it('should toggle maximize state and focus window', () => {
      const { openApp, maximizeWindow } = useOSStore.getState();
      openApp('agent-hive');
      const windowId = useOSStore.getState().windows[0].id;

      maximizeWindow(windowId);
      let state = useOSStore.getState();
      expect(state.windows[0].isMaximized).toBe(true);
      expect(state.activeWindowId).toBe(windowId);

      maximizeWindow(windowId);
      state = useOSStore.getState();
      expect(state.windows[0].isMaximized).toBe(false);
    });
  });

  describe('Window Management - updateWindowPosition', () => {
    it('should update window position', () => {
      const { openApp, updateWindowPosition } = useOSStore.getState();
      openApp('agent-hive');
      const windowId = useOSStore.getState().windows[0].id;

      updateWindowPosition(windowId, 200, 300);
      const state = useOSStore.getState();

      expect(state.windows[0].x).toBe(200);
      expect(state.windows[0].y).toBe(300);
    });

    it('should handle negative coordinates', () => {
      const { openApp, updateWindowPosition } = useOSStore.getState();
      openApp('agent-hive');
      const windowId = useOSStore.getState().windows[0].id;

      updateWindowPosition(windowId, -50, -100);
      const state = useOSStore.getState();

      expect(state.windows[0].x).toBe(-50);
      expect(state.windows[0].y).toBe(-100);
    });
  });

  describe('Window Management - updateWindowSize', () => {
    it('should update window size', () => {
      const { openApp, updateWindowSize } = useOSStore.getState();
      openApp('agent-hive');
      const windowId = useOSStore.getState().windows[0].id;

      updateWindowSize(windowId, 1200, 800);
      const state = useOSStore.getState();

      expect(state.windows[0].width).toBe(1200);
      expect(state.windows[0].height).toBe(800);
    });
  });

  describe('Department Management', () => {
    it('should set active department', () => {
      const { setActiveDepartment } = useOSStore.getState();
      setActiveDepartment('Kinetic Edge');

      expect(useOSStore.getState().activeDepartment).toBe('Kinetic Edge');
    });
  });

  describe('CRM - Deal Management', () => {
    beforeEach(() => {
      // Add some test deals
      useOSStore.setState({
        deals: [
          { id: '1', name: 'Deal 1', company: 'Company A', value: 100000, stage: 'lead', winProbability: 30, contact: 'John Doe', lastActivity: '1h ago' },
          { id: '2', name: 'Deal 2', company: 'Company B', value: 200000, stage: 'negotiation', winProbability: 70, contact: 'Jane Smith', lastActivity: '2h ago' },
        ],
      });
    });

    it('should move deal to different stage', () => {
      const { moveDeal } = useOSStore.getState();
      moveDeal('1', 'negotiation');

      const deal = useOSStore.getState().deals.find(d => d.id === '1');
      expect(deal?.stage).toBe('negotiation');
    });

    it('should set winProbability to 100 when moving to won stage', () => {
      const { moveDeal } = useOSStore.getState();
      moveDeal('2', 'won');

      const deal = useOSStore.getState().deals.find(d => d.id === '2');
      expect(deal?.stage).toBe('won');
      expect(deal?.winProbability).toBe(100);
    });

    it('should preserve winProbability when moving to non-won stage', () => {
      const { moveDeal } = useOSStore.getState();
      moveDeal('2', 'lead');

      const deal = useOSStore.getState().deals.find(d => d.id === '2');
      expect(deal?.stage).toBe('lead');
      expect(deal?.winProbability).toBe(70);
    });

    it('should add new deal with generated ID', () => {
      const { addDeal } = useOSStore.getState();
      const newDeal = {
        name: 'New Deal',
        company: 'New Company',
        value: 50000,
        stage: 'lead' as const,
        winProbability: 25,
        contact: 'Bob Johnson',
        lastActivity: 'Just now',
      };

      addDeal(newDeal);
      const state = useOSStore.getState();

      expect(state.deals).toHaveLength(3);
      expect(state.deals[2].name).toBe('New Deal');
      expect(state.deals[2].id).toBeTruthy();
    });
  });

  describe('Browser - Tab Management', () => {
    it('should add new browser tab and set as active', () => {
      const { addBrowserTab } = useOSStore.getState();
      addBrowserTab('https://example.com');

      const state = useOSStore.getState();
      expect(state.browserTabs).toHaveLength(2);
      expect(state.browserTabs[1].url).toBe('https://example.com');
      expect(state.browserTabs[1].isActive).toBe(true);
      expect(state.browserTabs[0].isActive).toBe(false);
    });

    it('should close browser tab', () => {
      const { addBrowserTab, closeBrowserTab } = useOSStore.getState();
      addBrowserTab('https://example.com');

      const state = useOSStore.getState();
      const tabId = state.browserTabs[1].id;

      closeBrowserTab(tabId);
      expect(useOSStore.getState().browserTabs).toHaveLength(1);
    });

    it('should create new tab when closing last tab', () => {
      const { closeBrowserTab } = useOSStore.getState();
      const initialTabId = useOSStore.getState().browserTabs[0].id;

      closeBrowserTab(initialTabId);
      const state = useOSStore.getState();

      expect(state.browserTabs).toHaveLength(1);
      expect(state.browserTabs[0].title).toBe('New Tab');
      expect(state.browserTabs[0].url).toBe('https://www.google.com');
      expect(state.browserTabs[0].isActive).toBe(true);
    });

    it('should set last tab as active when closing active tab', () => {
      const { addBrowserTab, closeBrowserTab } = useOSStore.getState();
      addBrowserTab('https://example1.com');
      addBrowserTab('https://example2.com');

      const state = useOSStore.getState();
      const activeTabId = state.browserTabs.find(t => t.isActive)!.id;

      closeBrowserTab(activeTabId);
      const newState = useOSStore.getState();

      expect(newState.browserTabs[newState.browserTabs.length - 1].isActive).toBe(true);
    });

    it('should set active browser tab', () => {
      const { addBrowserTab, setActiveBrowserTab } = useOSStore.getState();
      addBrowserTab('https://example.com');

      const firstTabId = useOSStore.getState().browserTabs[0].id;
      setActiveBrowserTab(firstTabId);

      const state = useOSStore.getState();
      expect(state.browserTabs[0].isActive).toBe(true);
      expect(state.browserTabs[1].isActive).toBe(false);
    });

    it('should update browser tab URL and title', () => {
      const { updateBrowserTabUrl } = useOSStore.getState();
      const tabId = useOSStore.getState().browserTabs[0].id;

      updateBrowserTabUrl(tabId, 'https://newurl.com', 'New Title');
      const state = useOSStore.getState();

      expect(state.browserTabs[0].url).toBe('https://newurl.com');
      expect(state.browserTabs[0].title).toBe('New Title');
    });

    it('should update URL without changing title if not provided', () => {
      const { updateBrowserTabUrl } = useOSStore.getState();
      const tabId = useOSStore.getState().browserTabs[0].id;
      const originalTitle = useOSStore.getState().browserTabs[0].title;

      updateBrowserTabUrl(tabId, 'https://newurl.com');
      const state = useOSStore.getState();

      expect(state.browserTabs[0].url).toBe('https://newurl.com');
      expect(state.browserTabs[0].title).toBe(originalTitle);
    });
  });

  describe('Edge Cases', () => {
    it('should handle opening all app types', () => {
      const appIds: AppId[] = ['agent-hive', 'crm', 'c-u-later', 'collect-a-sign', 'browser'];
      const { openApp } = useOSStore.getState();

      appIds.forEach(appId => openApp(appId));

      const state = useOSStore.getState();
      expect(state.windows).toHaveLength(5);
      expect(state.windows.map(w => w.appId)).toEqual(appIds);
    });

    it('should maintain correct zIndex ordering with multiple operations', () => {
      const { openApp, focusWindow } = useOSStore.getState();
      openApp('agent-hive');
      openApp('crm');
      openApp('browser');

      const state = useOSStore.getState();
      const firstWindowId = state.windows[0].id;

      focusWindow(firstWindowId);
      const newState = useOSStore.getState();
      const focusedWindow = newState.windows.find(w => w.id === firstWindowId)!;

      expect(focusedWindow.zIndex).toBeGreaterThan(newState.windows[1].zIndex);
      expect(focusedWindow.zIndex).toBeGreaterThan(newState.windows[2].zIndex);
    });
  });
});
