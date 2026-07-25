import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Bell, Bot, Command, Grid3X3, PanelRightClose, PanelRightOpen, Search, Shield, Sparkles } from 'lucide-react';
import { CommandPalette, type CommandPaletteItem } from './CommandPalette';
import { ExecutionNodeIndicator } from './ExecutionNodeIndicator';

export interface IntelligenceNavigationItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

interface IntelligenceShellProps {
  activeSection: string;
  navigation: IntelligenceNavigationItem[];
  onNavigate: (id: string) => void;
  context: ReactNode;
  analysis: ReactNode;
  intelligence: ReactNode;
  commandItems?: CommandPaletteItem[];
  statusText?: string;
}

export function IntelligenceShell({
  activeSection,
  navigation,
  onNavigate,
  context,
  analysis,
  intelligence,
  commandItems = [],
  statusText = 'Founder operational picture',
}: IntelligenceShellProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [intelligenceOpen, setIntelligenceOpen] = useState(true);
  const [mobileRailOpen, setMobileRailOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(open => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const defaultCommands = useMemo<CommandPaletteItem[]>(() => navigation.map(item => ({
    id: `nav-${item.id}`,
    label: item.label,
    description: `Open ${item.label} in the operational canvas`,
    group: 'Navigate',
    onSelect: () => onNavigate(item.id),
  })), [navigation, onNavigate]);

  const commands = commandItems.length ? commandItems : defaultCommands;

  return (
    <div className="intelligence-shell absolute inset-0 top-8 overflow-hidden bg-[#04070d] text-[#e9eef2]">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 intelligence-grid" />
        <div className="absolute left-[14%] top-[-28%] h-[620px] w-[620px] rounded-full bg-[#00d9b5]/[0.025] blur-[145px]" />
        <div className="absolute bottom-[-38%] right-[4%] h-[720px] w-[720px] rounded-full bg-[#d4a843]/[0.025] blur-[160px]" />
      </div>

      <header className="relative z-40 flex h-12 items-center border-b border-white/[0.065] bg-[#050910]/94 px-3 backdrop-blur-2xl">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={() => setMobileRailOpen(open => !open)} aria-label="Toggle operational navigation" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-slate-400 lg:hidden"><Grid3X3 className="h-4 w-4" /></button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d4a843]/25 bg-[#d4a843]/[0.08] text-[#d4a843]"><Shield className="h-4 w-4" /></div>
          <div className="hidden min-w-0 sm:block">
            <div className="truncate text-[12px] font-semibold tracking-[0.14em] text-white">HATAALII</div>
            <div className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">Venture Command OS</div>
          </div>
          <div className="hidden h-5 w-px bg-white/[0.07] md:block" />
          <div className="hidden items-center gap-2 font-mono text-[10px] text-slate-500 md:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#00d9b5] shadow-[0_0_10px_rgba(0,217,181,0.8)]" />{statusText}</div>
        </div>

        <button type="button" onClick={() => setPaletteOpen(true)} className="mx-auto flex h-8 min-w-0 max-w-[520px] flex-1 items-center gap-2 rounded-lg border border-white/[0.075] bg-white/[0.025] px-3 text-left text-xs text-slate-600 transition hover:border-[#d4a843]/22 hover:bg-white/[0.04] sm:mx-5">
          <Search className="h-3.5 w-3.5" /><span className="min-w-0 flex-1 truncate">Search missions, projects, agents, tools, commands</span><span className="hidden items-center gap-1 rounded border border-white/[0.07] px-1.5 py-0.5 font-mono text-[9px] text-slate-600 md:flex"><Command className="h-2.5 w-2.5" />K</span>
        </button>

        <div className="flex items-center gap-2">
          <ExecutionNodeIndicator />
          <button type="button" className="hidden h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-slate-500 hover:text-white sm:flex" aria-label="Notifications"><Bell className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => setIntelligenceOpen(open => !open)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-slate-500 hover:text-[#d4a843]" aria-label="Toggle intelligence drawer">{intelligenceOpen ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}</button>
        </div>
      </header>

      <div className="relative z-20 grid h-[calc(100%-3rem)] grid-cols-[72px_minmax(0,1fr)] lg:grid-cols-[72px_224px_minmax(0,1fr)]">
        <nav aria-label="Operational navigation" className={`${mobileRailOpen ? 'flex' : 'hidden'} absolute inset-y-0 left-0 z-50 w-[72px] flex-col items-center border-r border-white/[0.06] bg-[#050910]/98 py-3 shadow-2xl lg:relative lg:flex lg:bg-[#050910]/88 lg:shadow-none`}>
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#00d9b5]/[0.08] text-[#00d9b5]"><Bot className="h-4 w-4" /></div>
          <div className="flex flex-1 flex-col items-center gap-1.5">
            {navigation.map((item, index) => {
              const Icon = item.icon ?? Sparkles;
              const active = item.id === activeSection;
              return (
                <button key={item.id} type="button" onClick={() => { onNavigate(item.id); setMobileRailOpen(false); }} title={item.label} aria-label={item.label} className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border transition ${active ? 'border-[#d4a843]/25 bg-[#d4a843]/[0.09] text-[#e6c66d]' : 'border-transparent text-slate-600 hover:border-white/[0.07] hover:bg-white/[0.035] hover:text-slate-300'}`}>
                  {active ? <span className="absolute -left-[15px] h-5 w-0.5 rounded-r bg-[#d4a843] shadow-[0_0_12px_rgba(212,168,67,0.8)]" /> : null}
                  <Icon className="h-[17px] w-[17px]" />
                  {item.count ? <span className="absolute right-0.5 top-0.5 min-w-3 rounded-full bg-[#1b2736] px-1 font-mono text-[8px] text-[#8fa7b7]">{item.count}</span> : null}
                  <span className="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md border border-white/[0.08] bg-[#0a1019] px-2 py-1.5 text-[10px] text-slate-300 shadow-xl group-hover:block">{index + 1}. {item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="h-8 w-8 rounded-full border border-[#d4a843]/30 bg-gradient-to-br from-[#1c2b3a] to-[#0b1018] shadow-[inset_0_0_0_2px_rgba(212,168,67,0.08)]" title="JR Moyler" />
        </nav>

        <aside className="hidden min-h-0 border-r border-white/[0.06] bg-[#070b12]/72 lg:block">
          <div className="h-full overflow-y-auto p-3">{context}</div>
        </aside>

        <div className={`grid min-h-0 ${intelligenceOpen ? 'xl:grid-cols-[minmax(0,1fr)_320px]' : 'grid-cols-1'}`}>
          <main className="min-h-0 overflow-y-auto bg-[#05080e]/62">{analysis}</main>
          {intelligenceOpen ? <aside className="hidden min-h-0 border-l border-white/[0.06] bg-[#070b12]/82 xl:block"><div className="h-full overflow-y-auto">{intelligence}</div></aside> : null}
        </div>
      </div>

      <CommandPalette open={paletteOpen} items={commands} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
