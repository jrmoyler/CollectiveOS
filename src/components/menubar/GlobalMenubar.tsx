import { useState, useEffect } from 'react';
import { Wifi, Battery, BatteryCharging, Signal } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { motion } from 'framer-motion';

export function GlobalMenubar() {
  const activeDepartment = useOSStore(s => s.activeDepartment);
  const activeWindowId = useOSStore(s => s.activeWindowId);
  const windows = useOSStore(s => s.windows);
  const [time, setTime] = useState(new Date());
  const [batteryLevel] = useState(87);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const activeApp = windows.find(w => w.id === activeWindowId);

  return (
    <motion.div
      initial={{ y: -36 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 h-8 z-[9999] flex items-center justify-between px-4 glass-panel safe-area-top"
      style={{
        background: 'rgba(15, 23, 42, 0.88)',
        borderBottom: '1px solid rgba(52, 211, 153, 0.1)',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderRadius: 0,
      }}
    >
      {/* Left: CollectiveOS branding + active app menu */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold tracking-wider text-emerald-400 text-glow-emerald">
          CollectiveOS
        </span>
        {activeApp && (
          <span className="text-xs text-slate-400">
            {activeApp.title}
          </span>
        )}
        <div className="hidden md:flex items-center gap-3 ml-2 text-[11px] text-slate-500">
          <span className="hover:text-slate-300 cursor-pointer">File</span>
          <span className="hover:text-slate-300 cursor-pointer">Edit</span>
          <span className="hover:text-slate-300 cursor-pointer">View</span>
          <span className="hover:text-slate-300 cursor-pointer">Window</span>
          <span className="hover:text-slate-300 cursor-pointer">Help</span>
        </div>
      </div>

      {/* Center: Active Department */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] text-emerald-400/70 font-medium">
          {activeDepartment}
        </span>
      </div>

      {/* Right: System status */}
      <div className="flex items-center gap-3">
        <Signal className="w-3 h-3 text-slate-400" />
        <Wifi className="w-3 h-3 text-emerald-400" />
        <div className="flex items-center gap-1">
          {batteryLevel > 20 ? (
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <BatteryCharging className="w-3.5 h-3.5 text-ruby-500" />
          )}
          <span className="text-[10px] text-slate-400">{batteryLevel}%</span>
        </div>
        <span className="text-[11px] text-slate-400 ml-1">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
