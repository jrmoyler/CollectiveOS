import { motion } from 'framer-motion';
import { Bot, Briefcase, Video, PenTool, Globe } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { usePlatform } from '../../hooks/usePlatform';
import type { AppId } from '../../types';

const DOCK_APPS: { id: AppId; name: string; Icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string; glowColor: string }[] = [
  { id: 'agent-hive', name: 'Agent Hive', Icon: Bot, color: '#34d399', glowColor: 'rgba(52, 211, 153, 0.4)' },
  { id: 'crm', name: 'CRM', Icon: Briefcase, color: '#60a5fa', glowColor: 'rgba(96, 165, 250, 0.4)' },
  { id: 'c-u-later', name: 'C-U-Later', Icon: Video, color: '#e11d48', glowColor: 'rgba(225, 29, 72, 0.4)' },
  { id: 'collect-a-sign', name: 'Collect-A-Sign', Icon: PenTool, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' },
  { id: 'browser', name: 'Chrome', Icon: Globe, color: '#a78bfa', glowColor: 'rgba(167, 139, 250, 0.4)' },
];

export function Dock() {
  const openApp = useOSStore(s => s.openApp);
  const windows = useOSStore(s => s.windows);
  const platform = usePlatform();

  const isAppOpen = (appId: AppId) => windows.some(w => w.appId === appId && !w.isMinimized);

  if (platform === 'mobile') {
    return <MobileDock openApp={openApp} isAppOpen={isAppOpen} />;
  }

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.3 }}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9998]"
    >
      <div
        className="flex items-end gap-1.5 px-3 py-2 rounded-2xl glass-panel-elevated"
        style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(52, 211, 153, 0.12)',
        }}
      >
        {DOCK_APPS.map((app) => (
          <DockItem
            key={app.id}
            app={app}
            isOpen={isAppOpen(app.id)}
            onClick={() => openApp(app.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function DockItem({
  app,
  isOpen,
  onClick,
}: {
  app: (typeof DOCK_APPS)[number];
  isOpen: boolean;
  onClick: () => void;
}) {
  const { Icon, name, color, glowColor } = app;

  return (
    <motion.button
      whileHover={{ y: -10, scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-0.5 p-1.5 rounded-xl cursor-pointer group"
      title={name}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-shadow duration-200"
        style={{
          background: `linear-gradient(135deg, ${color}22, ${color}11)`,
          border: `1px solid ${color}33`,
          boxShadow: isOpen ? `0 0 16px ${glowColor}` : 'none',
        }}
      >
        <Icon
          width={24}
          height={24}
          style={{ color }}
        />
      </div>
      {/* Open indicator dot */}
      {isOpen && (
        <motion.div
          layoutId={`dock-indicator-${app.id}`}
          className="w-1 h-1 rounded-full"
          style={{ background: color }}
        />
      )}
      {/* Tooltip */}
      <div className="absolute -top-8 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {name}
      </div>
    </motion.button>
  );
}

function MobileDock({
  openApp,
  isAppOpen,
}: {
  openApp: (id: AppId) => void;
  isAppOpen: (id: AppId) => boolean;
}) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-[9998] safe-area-bottom"
    >
      <div
        className="grid grid-cols-5 gap-0 px-2 py-3 glass-panel"
        style={{
          background: 'rgba(15, 23, 42, 0.88)',
          borderRadius: 0,
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
        }}
      >
        {DOCK_APPS.map((app) => {
          const { Icon, name, color } = app;
          const open = isAppOpen(app.id);
          return (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.85 }}
              onClick={() => openApp(app.id)}
              className="flex flex-col items-center gap-1 py-1"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                  border: `1px solid ${color}33`,
                  boxShadow: open ? `0 0 12px ${color}44` : 'none',
                }}
              >
                <Icon width={20} height={20} style={{ color }} />
              </div>
              <span className="text-[9px] text-slate-500">{name}</span>
              {open && (
                <div className="w-1 h-1 rounded-full" style={{ background: color }} />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
