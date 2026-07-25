import { motion } from 'framer-motion';
import {
  Bot,
  Briefcase,
  FolderKanban,
  Globe,
  LayoutDashboard,
  PenTool,
  Users,
  Video,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { usePlatform } from '../../hooks/usePlatform';
import type { AppId } from '../../types';

interface DockApp {
  id: AppId;
  name: string;
  Icon: LucideIcon;
  color: string;
  glowColor: string;
}

const DOCK_APPS: DockApp[] = [
  { id: 'founder-cockpit', name: 'Founder Cockpit', Icon: LayoutDashboard, color: '#34d399', glowColor: 'rgba(52, 211, 153, 0.4)' },
  { id: 'mission-control', name: 'Mission Control', Icon: FolderKanban, color: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.4)' },
  { id: 'agent-council', name: 'Agent Council', Icon: Users, color: '#c084fc', glowColor: 'rgba(192, 132, 252, 0.4)' },
  { id: 'tool-forge', name: 'Tool Forge', Icon: Wrench, color: '#fbbf24', glowColor: 'rgba(251, 191, 36, 0.4)' },
  { id: 'agent-hive', name: 'Agent Hive', Icon: Bot, color: '#2dd4bf', glowColor: 'rgba(45, 212, 191, 0.4)' },
  { id: 'crm', name: 'CRM', Icon: Briefcase, color: '#60a5fa', glowColor: 'rgba(96, 165, 250, 0.4)' },
  { id: 'c-u-later', name: 'C-U-Later', Icon: Video, color: '#fb7185', glowColor: 'rgba(251, 113, 133, 0.4)' },
  { id: 'collect-a-sign', name: 'Collect-A-Sign', Icon: PenTool, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' },
  { id: 'browser', name: 'Browser', Icon: Globe, color: '#a78bfa', glowColor: 'rgba(167, 139, 250, 0.4)' },
];

export function Dock() {
  const openApp = useOSStore(state => state.openApp);
  const windows = useOSStore(state => state.windows);
  const platform = usePlatform();
  const isAppOpen = (appId: AppId) => windows.some(window => window.appId === appId && !window.isMinimized);

  if (platform === 'mobile') {
    return <MobileDock openApp={openApp} isAppOpen={isAppOpen} />;
  }

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.25 }}
      className="fixed bottom-3 left-1/2 z-[9998] max-w-[calc(100vw-24px)] -translate-x-1/2"
    >
      <div className="glass-panel-elevated flex items-end gap-1 overflow-x-auto rounded-2xl border border-emerald-400/10 bg-slate-950/75 px-2.5 py-2">
        {DOCK_APPS.map(app => (
          <DockItem key={app.id} app={app} isOpen={isAppOpen(app.id)} onClick={() => openApp(app.id)} />
        ))}
      </div>
    </motion.div>
  );
}

function DockItem({ app, isOpen, onClick }: { app: DockApp; isOpen: boolean; onClick: () => void }) {
  const { Icon, name, color, glowColor } = app;
  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      onClick={onClick}
      className="group relative flex shrink-0 flex-col items-center gap-0.5 rounded-xl p-1.5"
      title={name}
      aria-label={`Open ${name}`}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl border transition-shadow duration-200 xl:h-11 xl:w-11"
        style={{
          background: `linear-gradient(135deg, ${color}22, ${color}0d)`,
          borderColor: `${color}2f`,
          boxShadow: isOpen ? `0 0 16px ${glowColor}` : 'none',
        }}
      >
        <Icon width={20} height={20} style={{ color }} />
      </div>
      {isOpen ? <motion.div layoutId={`dock-indicator-${app.id}`} className="h-1 w-1 rounded-full" style={{ background: color }} /> : <div className="h-1" />}
      <div className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] text-slate-200 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">{name}</div>
    </motion.button>
  );
}

function MobileDock({ openApp, isAppOpen }: { openApp: (id: AppId) => void; isAppOpen: (id: AppId) => boolean }) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.2 }}
      className="safe-area-bottom fixed bottom-0 left-0 right-0 z-[9998] border-t border-white/[0.07] bg-slate-950/90 backdrop-blur-2xl"
    >
      <div className="flex gap-1 overflow-x-auto px-2 py-2.5">
        {DOCK_APPS.map(app => {
          const { Icon, name, color } = app;
          const open = isAppOpen(app.id);
          return (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => openApp(app.id)}
              className="flex w-[72px] shrink-0 flex-col items-center gap-1 rounded-xl py-1"
              aria-label={`Open ${name}`}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl border"
                style={{
                  background: `linear-gradient(135deg, ${color}22, ${color}0d)`,
                  borderColor: `${color}2f`,
                  boxShadow: open ? `0 0 12px ${color}44` : 'none',
                }}
              >
                <Icon width={18} height={18} style={{ color }} />
              </div>
              <span className="w-full truncate px-1 text-center text-[9px] text-slate-500">{name}</span>
              {open ? <div className="h-1 w-1 rounded-full" style={{ background: color }} /> : <div className="h-1" />}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
