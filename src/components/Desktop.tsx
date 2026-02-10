import { motion } from 'framer-motion';
import { usePlatform } from '../hooks/usePlatform';
import { useOSStore } from '../store/useOSStore';
import type { AppId } from '../types';
import { Bot, Briefcase, Video, PenTool, Globe } from 'lucide-react';

const GRID_APPS: { id: AppId; name: string; Icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }[] = [
  { id: 'agent-hive', name: 'Agent Hive', Icon: Bot, color: '#34d399' },
  { id: 'crm', name: 'CRM', Icon: Briefcase, color: '#60a5fa' },
  { id: 'c-u-later', name: 'C-U-Later', Icon: Video, color: '#e11d48' },
  { id: 'collect-a-sign', name: 'Collect-A-Sign', Icon: PenTool, color: '#f59e0b' },
  { id: 'browser', name: 'Chrome', Icon: Globe, color: '#a78bfa' },
];

export function Desktop() {
  const platform = usePlatform();
  const openApp = useOSStore(s => s.openApp);

  return (
    <div className="absolute inset-0 top-8 overflow-hidden">
      {/* Animated background mesh */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(52, 211, 153, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(225, 29, 72, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(96, 165, 250, 0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(52, 211, 153, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 211, 153, 1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Mobile grid launcher */}
      {platform === 'mobile' && (
        <div className="absolute inset-0 top-8 bottom-20 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-6 px-8">
            {GRID_APPS.map((app, i) => (
              <motion.button
                key={app.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => openApp(app.id)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${app.color}22, ${app.color}11)`,
                    border: `1px solid ${app.color}33`,
                    boxShadow: `0 0 20px ${app.color}15`,
                  }}
                >
                  <app.Icon width={28} height={28} style={{ color: app.color }} />
                </div>
                <span className="text-[10px] text-slate-400">{app.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop: Branding watermark */}
      {platform === 'desktop' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-emerald-400/10 text-glow-emerald tracking-wider">
              CollectiveOS
            </h1>
            <p className="text-sm text-slate-600/40 mt-2 tracking-widest uppercase">
              Operating System for Business
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
