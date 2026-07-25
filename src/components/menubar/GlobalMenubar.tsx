import { useEffect, useState } from 'react';
import { Battery, BatteryCharging, Bot, Signal, Sparkles, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOSStore } from '../../store/useOSStore';

export function GlobalMenubar() {
  const activeDepartment = useOSStore(state => state.activeDepartment);
  const activeWindowId = useOSStore(state => state.activeWindowId);
  const windows = useOSStore(state => state.windows);
  const openApp = useOSStore(state => state.openApp);
  const [time, setTime] = useState(() => new Date());
  const [batteryLevel] = useState(87);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const activeApp = windows.find(windowState => windowState.id === activeWindowId);

  return (
    <motion.div
      initial={{ y: -36 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="safe-area-top glass-panel fixed left-0 right-0 top-0 z-[9999] flex h-8 items-center justify-between border-x-0 border-t-0 border-emerald-400/10 bg-slate-950/90 px-3 sm:px-4"
      style={{ borderRadius: 0 }}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <button type="button" onClick={() => openApp('founder-cockpit')} className="flex shrink-0 items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-emerald-300" aria-label="Open Founder Cockpit">
          <Bot className="h-3.5 w-3.5" /> HATAALII OS
        </button>
        <span className="hidden text-[10px] uppercase tracking-[0.14em] text-slate-600 sm:inline">CollectiveOS</span>
        {activeApp ? <span className="max-w-[160px] truncate text-xs text-slate-400">{activeApp.title}</span> : null}
        <div className="ml-1 hidden items-center gap-3 text-[11px] text-slate-500 lg:flex">
          <button type="button" className="hover:text-slate-300">File</button>
          <button type="button" className="hover:text-slate-300">View</button>
          <button type="button" className="hover:text-slate-300">Window</button>
          <button type="button" className="hover:text-slate-300">Help</button>
        </div>
      </div>

      <button type="button" onClick={() => openApp('agent-council')} className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[11px] text-emerald-300/80 md:flex" aria-label="Open Agent Council">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
        {activeDepartment}
        <Sparkles className="h-3 w-3" />
      </button>

      <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
        <Signal className="hidden h-3 w-3 text-slate-400 sm:block" />
        <Wifi className="h-3 w-3 text-emerald-400" />
        <div className="hidden items-center gap-1 sm:flex">
          {batteryLevel > 20 ? <Battery className="h-3.5 w-3.5 text-emerald-400" /> : <BatteryCharging className="h-3.5 w-3.5 text-ruby-500" />}
          <span className="text-[10px] text-slate-400">{batteryLevel}%</span>
        </div>
        <span className="text-[10px] text-slate-400 sm:text-[11px]">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </motion.div>
  );
}
