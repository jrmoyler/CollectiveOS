import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import type { WindowState } from '../../types';
import { AppContent } from '../apps/AppContent';

interface Props {
  window: WindowState;
}

export function MobileWindow({ window: win }: Props) {
  const { closeWindow, focusWindow } = useOSStore();

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 top-8 bottom-[76px] z-50 flex flex-col overflow-hidden"
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
      }}
      onTouchStart={() => focusWindow(win.id)}
    >
      {/* Mobile header */}
      <div
        className="flex items-center justify-between h-11 px-4 shrink-0"
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          borderBottom: '1px solid rgba(52, 211, 153, 0.1)',
        }}
      >
        <span className="text-sm font-medium text-emerald-400">{win.title}</span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => closeWindow(win.id)}
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(225, 29, 72, 0.2)' }}
        >
          <X className="w-4 h-4 text-ruby-500" />
        </motion.button>
      </div>

      {/* App content */}
      <div className="flex-1 overflow-hidden">
        <AppContent appId={win.appId} />
      </div>
    </motion.div>
  );
}
