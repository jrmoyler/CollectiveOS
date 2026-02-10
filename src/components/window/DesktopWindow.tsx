import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '../../store/useOSStore';
import type { WindowState } from '../../types';
import { AppContent } from '../apps/AppContent';

interface Props {
  window: WindowState;
}

export function DesktopWindow({ window: win }: Props) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, updateWindowPosition, updateWindowSize } = useOSStore();
  const activeWindowId = useOSStore(s => s.activeWindowId);
  const isActive = activeWindowId === win.id;

  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; winW: number; winH: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.traffic-btn')) return;
    e.preventDefault();
    focusWindow(win.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y };

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      updateWindowPosition(win.id, dragRef.current.winX + dx, dragRef.current.winY + dy);
    };
    const onUp = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [win.id, win.x, win.y, focusWindow, updateWindowPosition]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(win.id);
    resizeRef.current = { startX: e.clientX, startY: e.clientY, winW: win.width, winH: win.height };

    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const dw = ev.clientX - resizeRef.current.startX;
      const dh = ev.clientY - resizeRef.current.startY;
      updateWindowSize(
        win.id,
        Math.max(400, resizeRef.current.winW + dw),
        Math.max(300, resizeRef.current.winH + dh)
      );
    };
    const onUp = () => {
      resizeRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [win.id, win.width, win.height, focusWindow, updateWindowSize]);

  const style = win.isMaximized
    ? { top: 32, left: 0, width: '100vw', height: 'calc(100vh - 32px)', zIndex: win.zIndex }
    : { top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="fixed flex flex-col overflow-hidden"
      style={{
        ...style,
        borderRadius: win.isMaximized ? 0 : 12,
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: `1px solid ${isActive ? 'rgba(52, 211, 153, 0.25)' : 'rgba(52, 211, 153, 0.1)'}`,
        boxShadow: isActive
          ? '0 0 0 1px rgba(52, 211, 153, 0.1), 0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(52, 211, 153, 0.05)'
          : '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title bar with traffic lights */}
      <div
        className="flex items-center h-10 px-3 gap-2 cursor-grab active:cursor-grabbing shrink-0"
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderBottom: '1px solid rgba(52, 211, 153, 0.08)',
        }}
        onMouseDown={handleTitleBarMouseDown}
      >
        {/* Traffic light controls */}
        <div className="flex items-center gap-1.5">
          <button
            className="traffic-btn w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all"
            onClick={() => closeWindow(win.id)}
          />
          <button
            className="traffic-btn w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-all"
            onClick={() => minimizeWindow(win.id)}
          />
          <button
            className="traffic-btn w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all"
            onClick={() => maximizeWindow(win.id)}
          />
        </div>

        {/* Window title */}
        <div className="flex-1 text-center">
          <span className="text-xs text-slate-400 font-medium">{win.title}</span>
        </div>
        <div className="w-14" /> {/* Spacer to center title */}
      </div>

      {/* App content area */}
      <div className="flex-1 overflow-hidden">
        <AppContent appId={win.appId} />
      </div>

      {/* Resize handle */}
      {!win.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, rgba(52, 211, 153, 0.3) 50%)',
            borderRadius: '0 0 12px 0',
          }}
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </motion.div>
  );
}
