import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, RotateCw, Plus, X,
  Lock, Star, Globe
} from 'lucide-react';
import { useOSStore } from '../../../store/useOSStore';

export function BrowserApp() {
  const { browserTabs, addBrowserTab, closeBrowserTab, setActiveBrowserTab, updateBrowserTabUrl } = useOSStore();
  const activeTab = browserTabs.find(t => t.isActive);
  const [urlInput, setUrlInput] = useState(activeTab?.url || '');

  const handleNavigate = useCallback(() => {
    if (!activeTab) return;
    let url = urlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = `https://${url}`;
      } else {
        url = `https://www.google.com/search?igu=1&q=${encodeURIComponent(url)}`;
      }
    }
    updateBrowserTabUrl(activeTab.id, url, new URL(url).hostname);
    setUrlInput(url);
  }, [activeTab, urlInput, updateBrowserTabUrl]);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveBrowserTab(tabId);
    const tab = browserTabs.find(t => t.id === tabId);
    if (tab) setUrlInput(tab.url);
  }, [browserTabs, setActiveBrowserTab]);

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div
        className="flex items-center gap-0.5 px-2 pt-1 shrink-0 overflow-x-auto"
        style={{ background: 'rgba(15, 23, 42, 0.6)' }}
      >
        {browserTabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg cursor-pointer text-xs max-w-[180px] min-w-[100px] transition-colors group ${
              tab.isActive
                ? 'bg-slate-800/80 text-slate-200'
                : 'text-slate-500 hover:text-slate-400 hover:bg-slate-800/30'
            }`}
          >
            <Globe className="w-3 h-3 shrink-0 text-slate-500" />
            <span className="truncate flex-1 text-[11px]">{tab.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); closeBrowserTab(tab.id); }}
              className="opacity-0 group-hover:opacity-100 hover:text-slate-200 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { addBrowserTab('https://www.google.com/webhp?igu=1'); setUrlInput('https://www.google.com'); }}
          className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-400 hover:bg-slate-800/30 shrink-0"
        >
          <Plus className="w-3 h-3" />
        </motion.button>
      </div>

      {/* Address bar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-b shrink-0"
        style={{
          background: 'rgba(15, 23, 42, 0.5)',
          borderColor: 'rgba(52, 211, 153, 0.06)',
        }}
      >
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-400 hover:bg-slate-800/50">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-400 hover:bg-slate-800/50">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { if (activeTab) updateBrowserTabUrl(activeTab.id, activeTab.url); }}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-400 hover:bg-slate-800/50"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/60 border border-slate-700/40">
          <Lock className="w-3 h-3 text-emerald-400" />
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleNavigate()}
            className="flex-1 text-xs text-slate-300 bg-transparent focus:outline-none placeholder:text-slate-600"
            placeholder="Search or enter URL"
          />
          <Star className="w-3 h-3 text-slate-600 hover:text-amber-400 cursor-pointer" />
        </div>
      </div>

      {/* Browser content - iframe/webview */}
      <div className="flex-1 bg-white relative">
        {activeTab && (
          <iframe
            key={activeTab.url}
            src={activeTab.url}
            title={activeTab.title}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            referrerPolicy="no-referrer"
          />
        )}
        {/* Fallback overlay if iframe blocked */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-slate-900/80 text-[9px] text-slate-500 pointer-events-none">
            Some sites may restrict iframe embedding
          </div>
        </div>
      </div>
    </div>
  );
}
