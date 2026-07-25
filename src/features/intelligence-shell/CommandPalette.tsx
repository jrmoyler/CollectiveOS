import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Command, Search, X } from 'lucide-react';

export interface CommandPaletteItem {
  id: string;
  label: string;
  description: string;
  group: string;
  keywords?: string[];
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  items: CommandPaletteItem[];
  onClose: () => void;
}

export function CommandPalette({ open, items, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return items.slice(0, 14);
    return items.filter(item => [item.label, item.description, item.group, ...(item.keywords ?? [])]
      .some(value => value.toLocaleLowerCase().includes(normalized))).slice(0, 20);
  }, [items, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10020] flex items-start justify-center bg-[#02040a]/76 px-4 pt-[12vh] backdrop-blur-xl" role="dialog" aria-label="Command palette" aria-modal="true" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="w-full max-w-2xl overflow-hidden rounded-[18px] border border-white/[0.11] bg-[#080d16]/98 shadow-[0_40px_120px_rgba(0,0,0,0.72)]">
        <div className="flex h-14 items-center gap-3 border-b border-white/[0.07] px-4">
          <Search className="h-4 w-4 text-[#86a7b9]" />
          <input
            ref={inputRef}
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search missions, projects, agents, tools, or commands"
            aria-label="Command search"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          />
          <div className="hidden items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.035] px-2 py-1 font-mono text-[10px] text-slate-500 sm:flex"><Command className="h-3 w-3" /> K</div>
          <button type="button" onClick={onClose} aria-label="Close command palette" className="rounded-lg p-1.5 text-slate-500 hover:bg-white/[0.05] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="max-h-[58vh] overflow-y-auto p-2">
          {results.length ? results.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => { item.onSelect(); onClose(); }}
              className="group grid w-full grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.055]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] font-mono text-[10px] text-[#d4a843]">{item.group.slice(0, 2).toUpperCase()}</div>
              <div className="min-w-0"><div className="truncate text-sm font-medium text-slate-100">{item.label}</div><div className="mt-0.5 truncate text-xs text-slate-500">{item.description}</div></div>
              <ArrowRight className="h-4 w-4 text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-[#d4a843]" />
            </button>
          )) : <div className="px-5 py-12 text-center text-sm text-slate-500">No command matches this query.</div>}
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-600">
          <span>HATAALII command index</span><span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
