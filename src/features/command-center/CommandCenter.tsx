import { useDeferredValue, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Bot,
  ChevronRight,
  CircleDollarSign,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Search,
  Sparkles,
  Terminal,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import type { AppId } from '../../types';
import { useOSStore } from '../../store/useOSStore';
import { detectRuntimeCapabilities, getToolLocalUrl, getToolPrimaryAction } from './capabilities';
import {
  agentCouncil,
  collectiveProjects,
  commandMetrics,
  searchCommandCenter,
  toolRegistry,
  ventureStreams,
} from './data';
import type { CommandSection, ProjectDefinition, SearchResult, ToolCategory, ToolDefinition } from './types';

interface CommandCenterProps {
  onOpenApp?: (appId: AppId) => void;
}

type DetailSelection =
  | { kind: 'project'; value: ProjectDefinition }
  | { kind: 'tool'; value: ToolDefinition }
  | null;

const NAVIGATION: Array<{ id: CommandSection; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'cockpit', label: 'Founder Cockpit', icon: LayoutDashboard },
  { id: 'portfolio', label: 'Collective Portfolio', icon: FolderKanban },
  { id: 'revenue', label: 'Revenue Command', icon: CircleDollarSign },
  { id: 'council', label: 'Agent Council', icon: Users },
  { id: 'tools', label: 'Tool Forge', icon: Wrench },
];

const TOOL_CATEGORIES: Array<'All' | ToolCategory> = [
  'All',
  'Agent Council',
  'Voice & Audio',
  '3D & Visual',
  'Studios',
  'Productivity',
  'Trading & Markets',
  'Infrastructure',
  'Developer Tools',
];

const healthStyles: Record<ProjectDefinition['health'], string> = {
  'on-track': 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  attention: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  building: 'bg-sky-400/10 text-sky-300 border-sky-400/20',
  planning: 'bg-slate-400/10 text-slate-300 border-slate-400/20',
};

export function CommandCenter({ onOpenApp }: CommandCenterProps) {
  const storeOpenApp = useOSStore(state => state.openApp);
  const openApp = onOpenApp ?? storeOpenApp;
  const [section, setSection] = useState<CommandSection>('cockpit');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [detail, setDetail] = useState<DetailSelection>(null);
  const [toolCategory, setToolCategory] = useState<(typeof TOOL_CATEGORIES)[number]>('All');
  const capabilities = useMemo(() => detectRuntimeCapabilities(), []);
  const searchResults = useMemo(() => searchCommandCenter(deferredQuery), [deferredQuery]);

  const filteredTools = useMemo(
    () => toolCategory === 'All' ? toolRegistry : toolRegistry.filter(tool => tool.category === toolCategory),
    [toolCategory],
  );

  const selectSearchResult = (result: SearchResult) => {
    setSection(result.section);
    setQuery('');
    if (result.type === 'project') {
      const project = collectiveProjects.find(item => item.id === result.id);
      if (project) setDetail({ kind: 'project', value: project });
    }
    if (result.type === 'tool') {
      const tool = toolRegistry.find(item => item.id === result.id);
      if (tool) setDetail({ kind: 'tool', value: tool });
    }
  };

  const navigate = (next: CommandSection) => {
    setSection(next);
    setMobileNavOpen(false);
  };

  return (
    <div className="absolute inset-0 top-8 bottom-0 overflow-hidden bg-[#050a18] text-slate-100">
      <AmbientBackground />

      <aside className="absolute inset-y-0 left-0 z-30 hidden w-64 border-r border-white/[0.06] bg-[#071020]/90 px-4 py-5 backdrop-blur-2xl lg:flex lg:flex-col">
        <BrandBlock />
        <nav className="mt-8 space-y-1" aria-label="Command center sections">
          {NAVIGATION.map(item => (
            <NavButton key={item.id} item={item} active={section === item.id} onClick={() => navigate(item.id)} />
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <Activity className="h-4 w-4" /> Collective AI mission
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-300">Build consistent income engines while advancing the official Collective AI portfolio.</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[46%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.16em] text-slate-500">
            <span>Foundation</span><span>46%</span>
          </div>
        </div>
      </aside>

      {mobileNavOpen ? (
        <div className="absolute inset-0 z-50 bg-[#030711]/80 backdrop-blur-xl lg:hidden">
          <aside className="h-full w-[86%] max-w-sm border-r border-white/10 bg-[#071020] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <BrandBlock />
              <button type="button" onClick={() => setMobileNavOpen(false)} className="rounded-xl border border-white/10 p-2 text-slate-300" aria-label="Close navigation">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-8 space-y-2" aria-label="Mobile command center sections">
              {NAVIGATION.map(item => (
                <NavButton key={item.id} item={item} active={section === item.id} onClick={() => navigate(item.id)} />
              ))}
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="relative z-10 flex h-full flex-col lg:pl-64">
        <header className="border-b border-white/[0.06] bg-[#050a18]/78 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileNavOpen(true)} className="rounded-xl border border-white/10 p-2 text-slate-300 lg:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                aria-label="Search everything"
                placeholder="Search projects, ventures, agents, tools…"
                className="h-11 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-emerald-400/10"
              />
              {query.trim() ? (
                <SearchResults results={searchResults} onSelect={selectSearchResult} />
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => openApp('agent-council')}
              className="hidden h-11 items-center gap-2 rounded-2xl bg-emerald-400 px-4 text-sm font-semibold text-[#04110d] shadow-[0_0_30px_rgba(52,211,153,0.18)] transition hover:bg-emerald-300 sm:flex"
            >
              <Sparkles className="h-4 w-4" /> Orchestrate with Council
            </button>
            <button
              type="button"
              onClick={() => openApp('agent-council')}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-[#04110d] sm:hidden"
              aria-label="Orchestrate with Council"
            >
              <Sparkles className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3 overflow-x-auto pb-1 text-xs text-slate-500 lg:hidden">
            {NAVIGATION.map(item => (
              <button key={item.id} type="button" onClick={() => navigate(item.id)} className={`whitespace-nowrap rounded-full px-3 py-1.5 ${section === item.id ? 'bg-white/10 text-white' : 'bg-white/[0.03]'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-24">
          {section === 'cockpit' ? <Cockpit onSection={navigate} onProject={project => setDetail({ kind: 'project', value: project })} onOpenApp={openApp} /> : null}
          {section === 'portfolio' ? <Portfolio onProject={project => setDetail({ kind: 'project', value: project })} /> : null}
          {section === 'revenue' ? <RevenueCommand /> : null}
          {section === 'council' ? <Council onOpenApp={openApp} /> : null}
          {section === 'tools' ? (
            <ToolForge
              category={toolCategory}
              onCategory={setToolCategory}
              tools={filteredTools}
              capabilities={capabilities}
              onTool={tool => setDetail({ kind: 'tool', value: tool })}
            />
          ) : null}
        </main>
      </div>

      {detail ? <DetailDrawer selection={detail} capabilities={capabilities} onClose={() => setDetail(null)} /> : null}
    </div>
  );
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-emerald-500/[0.055] blur-[120px]" />
      <div className="absolute right-[-180px] top-[-40px] h-[560px] w-[560px] rounded-full bg-sky-500/[0.04] blur-[130px]" />
      <div className="absolute bottom-[-200px] left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-500/[0.035] blur-[140px]" />
      <div className="command-grid absolute inset-0 opacity-40" />
    </div>
  );
}

function BrandBlock() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 shadow-[0_0_24px_rgba(52,211,153,0.12)]">
        <Bot className="h-5 w-5 text-emerald-300" />
      </div>
      <div>
        <div className="text-sm font-bold tracking-[0.16em] text-white">HATAALII OS</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">CollectiveOS core</div>
      </div>
    </div>
  );
}

function NavButton({ item, active, onClick }: { item: (typeof NAVIGATION)[number]; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${active ? 'bg-emerald-400/10 text-emerald-200 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.14)]' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1">{item.label}</span>
      {active ? <ChevronRight className="h-3.5 w-3.5" /> : null}
    </button>
  );
}

function SearchResults({ results, onSelect }: { results: SearchResult[]; onSelect: (result: SearchResult) => void }) {
  return (
    <div className="absolute left-0 right-0 top-13 z-50 max-h-[420px] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1324]/98 p-2 shadow-2xl backdrop-blur-2xl">
      {results.length ? results.map(result => (
        <button
          key={`${result.type}-${result.id}`}
          type="button"
          onClick={() => onSelect(result)}
          aria-label={`${result.title} ${result.subtitle}`}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-white/[0.05]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-xs uppercase text-emerald-300">{result.type.slice(0, 1)}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-white">{result.title}</div>
            <div className="truncate text-xs text-slate-500">{result.subtitle}</div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-600" />
        </button>
      )) : <div className="px-4 py-8 text-center text-sm text-slate-500">No command-center matches.</div>}
    </div>
  );
}

function SectionHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Cockpit({ onSection, onProject, onOpenApp }: { onSection: (section: CommandSection) => void; onProject: (project: ProjectDefinition) => void; onOpenApp: (appId: AppId) => void }) {
  return (
    <div>
      <SectionHeader
        title="Founder Cockpit"
        description="One operating picture for the income engines, official Collective AI responsibilities, agent execution, and open-source production stack that JR Moyler is personally driving."
        action={<div className="flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" /> Live operating view</div>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {commandMetrics.map(metric => (
          <div key={metric.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{metric.label}</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{metric.value}</div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400"><Activity className={`h-3.5 w-3.5 ${metric.trend === 'attention' ? 'text-amber-300' : 'text-emerald-300'}`} />{metric.detail}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <section className="rounded-3xl border border-white/[0.07] bg-[#091225]/76 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="font-semibold text-white">Collective AI mission queue</h2><p className="mt-1 text-xs text-slate-500">Highest-leverage responsibilities across the active portfolio.</p></div>
            <button type="button" onClick={() => onSection('portfolio')} className="text-xs font-medium text-emerald-300 hover:text-emerald-200">View portfolio</button>
          </div>
          <div className="space-y-2">
            {collectiveProjects.slice(0, 6).map(project => <ProjectRow key={project.id} project={project} onClick={() => onProject(project)} />)}
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/[0.08] to-sky-400/[0.025] p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300"><Sparkles className="h-4 w-4" /> Agent Council</div>
            <h2 className="mt-4 text-xl font-semibold text-white">Turn one founder command into coordinated execution.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Spawn research, build, revenue, portfolio, or creative crews under HATAALII and ZENITH.</p>
            <div className="mt-4 flex -space-x-2">
              {agentCouncil.slice(0, 6).map(agent => <div key={agent.id} title={agent.name} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0a1425] bg-slate-800 text-[10px] font-semibold text-emerald-300">{agent.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</div>)}
            </div>
            <button type="button" onClick={() => onOpenApp('agent-council')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-[#04110d]">Open Agent Council <ArrowUpRight className="h-4 w-4" /></button>
          </section>

          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-5">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-white">Revenue momentum</h2><button type="button" onClick={() => onSection('revenue')} className="text-xs text-emerald-300">Open command</button></div>
            <div className="mt-4 space-y-4">
              {ventureStreams.slice(0, 4).map(stream => {
                const percent = Math.min(100, Math.round((stream.collected / stream.monthlyTarget) * 100));
                return <div key={stream.id}><div className="flex justify-between gap-3 text-xs"><span className="truncate text-slate-300">{stream.name}</span><span className="text-slate-500">{percent}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400" style={{ width: `${Math.max(percent, 3)}%` }} /></div></div>;
              })}
            </div>
          </section>
        </div>
      </div>

      <section className="mt-5 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-white">Quick Launch</h2><p className="mt-1 text-xs text-slate-500">Open the highest-use operating surfaces.</p></div><button type="button" onClick={() => onSection('tools')} className="text-xs text-emerald-300">All tools</button></div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Mission Control', detail: 'Official portfolio', app: 'mission-control' as AppId, icon: FolderKanban },
            { label: 'Agent Council', detail: 'Orchestrate agents', app: 'agent-council' as AppId, icon: Users },
            { label: 'Tool Forge', detail: 'Open-source stack', app: 'tool-forge' as AppId, icon: Wrench },
            { label: 'Collective CRM', detail: 'Leads and deals', app: 'crm' as AppId, icon: CircleDollarSign },
          ].map(item => {
            const Icon = item.icon;
            return <button key={item.label} type="button" onClick={() => onOpenApp(item.app)} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition hover:border-emerald-400/20 hover:bg-emerald-400/[0.04]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="text-sm font-medium text-white">{item.label}</div><div className="text-xs text-slate-500">{item.detail}</div></div><ChevronRight className="h-4 w-4 text-slate-600" /></button>;
          })}
        </div>
      </section>
    </div>
  );
}

function ProjectRow({ project, onClick }: { project: ProjectDefinition; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-transparent bg-white/[0.025] px-3 py-3 text-left transition hover:border-white/[0.08] hover:bg-white/[0.045] sm:grid-cols-[minmax(0,1fr)_110px_90px_auto]">
      <div className="min-w-0"><div className="truncate text-sm font-medium text-white">{project.name}</div><div className="mt-1 truncate text-xs text-slate-500">{project.nextMilestone}</div></div>
      <div className="hidden sm:block"><div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${project.progress}%` }} /></div><div className="mt-1 text-[10px] text-slate-500">{project.progress}% complete</div></div>
      <span className={`hidden rounded-full border px-2 py-1 text-center text-[10px] capitalize sm:inline-block ${healthStyles[project.health]}`}>{project.health.replace('-', ' ')}</span>
      <ChevronRight className="h-4 w-4 text-slate-600" />
    </button>
  );
}

function Portfolio({ onProject }: { onProject: (project: ProjectDefinition) => void }) {
  return (
    <div>
      <SectionHeader title="Collective AI Mission Control" description="JR Moyler's official Collective AI responsibilities, client work, internal platforms, and strategic ventures in one portfolio operating view." />
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {collectiveProjects.map(project => (
          <motion.button key={project.id} whileHover={{ y: -2 }} type="button" onClick={() => onProject(project)} className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-5 text-left transition hover:border-emerald-400/20 hover:bg-white/[0.045]">
            <div className="flex items-start justify-between gap-4"><span className={`rounded-full border px-2.5 py-1 text-[10px] capitalize ${healthStyles[project.health]}`}>{project.health.replace('-', ' ')}</span><span className="text-xs text-slate-500">{project.valueLabel}</span></div>
            <h2 className="mt-5 text-lg font-semibold text-white">{project.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{project.description}</p>
            <div className="mt-5"><div className="flex justify-between text-[10px] uppercase tracking-[0.14em] text-slate-500"><span>{project.division}</span><span>{project.progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400" style={{ width: `${project.progress}%` }} /></div></div>
            <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs"><span className="truncate text-slate-400">{project.nextMilestone}</span><ArrowUpRight className="ml-3 h-4 w-4 shrink-0 text-emerald-300" /></div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function RevenueCommand() {
  const totalTarget = ventureStreams.reduce((sum, stream) => sum + stream.monthlyTarget, 0);
  const totalCollected = ventureStreams.reduce((sum, stream) => sum + stream.collected, 0);
  return (
    <div>
      <SectionHeader title="Revenue Command" description="Personal income engines organized around one goal: consistently finance Collective AI Inc while building reusable systems and client relationships." />
      <div className="grid gap-3 sm:grid-cols-3">
        <RevenueMetric label="Monthly target" value={formatCurrency(totalTarget)} detail="Across active lanes" />
        <RevenueMetric label="Collected" value={formatCurrency(totalCollected)} detail={`${Math.round((totalCollected / totalTarget) * 100)}% of target`} />
        <RevenueMetric label="Collective allocation" value="10–25%" detail="Per venture after delivery" />
      </div>
      <div className="mt-5 overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025]">
        <div className="hidden grid-cols-[1.2fr_0.7fr_0.7fr_1.4fr_80px] gap-4 border-b border-white/[0.06] px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-slate-500 md:grid"><span>Income engine</span><span>Stage</span><span>Monthly target</span><span>Next action</span><span>CAI</span></div>
        {ventureStreams.map(stream => (
          <div key={stream.id} className="grid gap-3 border-b border-white/[0.05] px-4 py-4 last:border-0 md:grid-cols-[1.2fr_0.7fr_0.7fr_1.4fr_80px] md:items-center md:px-5">
            <div><div className="text-sm font-medium text-white">{stream.name}</div><div className="mt-1 text-xs text-slate-500">{stream.description}</div></div>
            <div className="text-xs capitalize text-sky-300">{stream.stage}</div>
            <div className="text-sm font-medium text-white">{formatCurrency(stream.monthlyTarget)}</div>
            <div className="text-xs leading-5 text-slate-400">{stream.nextAction}</div>
            <div className="text-xs font-semibold text-emerald-300">{stream.collectiveAllocation}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5"><div className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div><div className="mt-3 text-2xl font-semibold text-white">{value}</div><div className="mt-2 text-xs text-slate-400">{detail}</div></div>;
}

function Council({ onOpenApp }: { onOpenApp: (appId: AppId) => void }) {
  return (
    <div>
      <SectionHeader title="Agent Council & Orchestrator" description="HATAALII and ZENITH coordinate role-based crews, stateful workflows, debates, scenarios, software teams, research swarms, and production pipelines." action={<button type="button" onClick={() => onOpenApp('agent-hive')} className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-sm text-emerald-200">Open full Agent Hive</button>} />
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {agentCouncil.map(agent => (
          <div key={agent.id} className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><Bot className="h-5 w-5" /></div><span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{agent.status}</span></div>
            <h2 className="mt-5 font-semibold text-white">{agent.name}</h2><div className="mt-1 text-xs text-emerald-300">{agent.role}</div><p className="mt-3 text-sm leading-6 text-slate-400">{agent.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">{agent.specialties.map(item => <span key={item} className="rounded-full border border-white/[0.07] bg-white/[0.035] px-2 py-1 text-[10px] text-slate-400">{item}</span>)}</div>
            <div className="mt-4 border-t border-white/[0.06] pt-3 text-[10px] uppercase tracking-[0.14em] text-slate-500">Runtime: {agent.framework}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {['Spawn crew', 'Run scenario', 'Begin debate', 'Route build'].map((label, index) => <button key={label} type="button" onClick={() => onOpenApp(index === 3 ? 'agent-hive' : 'agent-council')} className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-4 text-left text-sm font-medium text-emerald-200 transition hover:bg-emerald-400/10">{label}<div className="mt-1 text-xs font-normal text-slate-500">{['Assemble specialized roles', 'Model outcomes and tradeoffs', 'Challenge competing plans', 'Coordinate product delivery'][index]}</div></button>)}
      </div>
    </div>
  );
}

function ToolForge({ category, onCategory, tools, capabilities, onTool }: { category: (typeof TOOL_CATEGORIES)[number]; onCategory: (category: (typeof TOOL_CATEGORIES)[number]) => void; tools: ToolDefinition[]; capabilities: ReturnType<typeof detectRuntimeCapabilities>; onTool: (tool: ToolDefinition) => void }) {
  return (
    <div>
      <SectionHeader title="Open-source Tool Forge" description={`A project-aware registry for agent frameworks, creative studios, productivity systems, market engines, infrastructure, and developer tools. Runtime: ${capabilities.runtime}.`} />
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {TOOL_CATEGORIES.map(item => <button key={item} type="button" onClick={() => onCategory(item)} className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs transition ${category === item ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border-white/[0.07] bg-white/[0.025] text-slate-400 hover:text-white'}`}>{item}</button>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {tools.map(item => {
          const primaryAction = getToolPrimaryAction(item, capabilities);
          return (
            <div key={item.id} className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">{item.runtime === 'cli' ? <Terminal className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}</div><span className="rounded-full border border-white/[0.07] px-2 py-1 text-[10px] capitalize text-slate-500">{item.runtime.replace('-', ' ')}</span></div>
              <h2 className="mt-5 font-semibold text-white">{item.name}</h2><div className="mt-1 text-xs text-sky-300">{item.category}</div><p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{item.tags.slice(0, 3).map(tag => <span key={tag} className="rounded-full bg-white/[0.035] px-2 py-1 text-[10px] text-slate-500">{tag}</span>)}</div>
              <div className="mt-5 flex gap-2 border-t border-white/[0.06] pt-4"><button type="button" onClick={() => onTool(item)} className="flex-1 rounded-xl bg-emerald-400 px-3 py-2 text-xs font-semibold text-[#04110d]">{primaryAction.label}</button><a href={item.repository} target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-xl border border-white/10 px-3 text-slate-300" aria-label={`Open ${item.name} repository`}><ExternalLink className="h-4 w-4" /></a></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailDrawer({ selection, capabilities, onClose }: { selection: Exclude<DetailSelection, null>; capabilities: ReturnType<typeof detectRuntimeCapabilities>; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-[10000] flex justify-end bg-[#02050c]/70 backdrop-blur-sm" onMouseDown={event => { if (event.currentTarget === event.target) onClose(); }}>
      <motion.aside initial={{ x: 460 }} animate={{ x: 0 }} className="h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-[#081122] p-5 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between"><div className="text-xs uppercase tracking-[0.18em] text-emerald-300">{selection.kind === 'project' ? 'Project command' : 'Tool integration'}</div><button type="button" onClick={onClose} className="rounded-xl border border-white/10 p-2 text-slate-400" aria-label="Close details"><X className="h-4 w-4" /></button></div>
        {selection.kind === 'project' ? <ProjectDetail project={selection.value} /> : <ToolDetail tool={selection.value} capabilities={capabilities} />}
      </motion.aside>
    </div>
  );
}

function ProjectDetail({ project }: { project: ProjectDefinition }) {
  return (
    <div>
      <h2 className="mt-8 text-3xl font-semibold text-white">{project.name}</h2><p className="mt-4 text-sm leading-7 text-slate-400">{project.description}</p>
      <div className="mt-6 grid grid-cols-2 gap-3"><DetailStat label="Progress" value={`${project.progress}%`} /><DetailStat label="Health" value={project.health.replace('-', ' ')} /><DetailStat label="Division" value={project.division} /><DetailStat label="Value" value={project.valueLabel} /></div>
      <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4"><div className="text-xs uppercase tracking-[0.14em] text-slate-500">Next milestone</div><p className="mt-2 text-sm leading-6 text-white">{project.nextMilestone}</p></div>
      <div className="mt-6"><div className="text-xs uppercase tracking-[0.14em] text-slate-500">Collaborators</div><div className="mt-3 flex flex-wrap gap-2">{project.collaborators.map(person => <span key={person} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-slate-300">{person}</span>)}</div></div>
      <div className="mt-7 flex gap-3">{project.repository ? <a href={project.repository} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-[#04110d]">Open repository <ExternalLink className="h-4 w-4" /></a> : null}{project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-white">Open live <ExternalLink className="h-4 w-4" /></a> : null}</div>
    </div>
  );
}

function ToolDetail({ tool, capabilities }: { tool: ToolDefinition; capabilities: ReturnType<typeof detectRuntimeCapabilities> }) {
  const action = getToolPrimaryAction(tool, capabilities);
  const localUrl = getToolLocalUrl(tool);
  const execute = async () => {
    if (action.action === 'open-ui' && localUrl) window.open(localUrl, '_blank', 'noopener,noreferrer');
    if (action.action === 'open-repository') window.open(tool.repository, '_blank', 'noopener,noreferrer');
    if (action.action === 'view-setup' && tool.launchCommand && navigator.clipboard) await navigator.clipboard.writeText(tool.launchCommand);
  };
  return (
    <div>
      <h2 className="mt-8 text-3xl font-semibold text-white">{tool.name}</h2><div className="mt-2 text-sm text-sky-300">{tool.category}</div><p className="mt-4 text-sm leading-7 text-slate-400">{tool.description}</p>
      <div className="mt-6 grid grid-cols-2 gap-3"><DetailStat label="Runtime" value={tool.runtime.replace('-', ' ')} /><DetailStat label="Status" value={tool.status.replace('-', ' ')} /><DetailStat label="Port" value={tool.defaultPort ? String(tool.defaultPort) : 'Repository-defined'} /><DetailStat label="Host" value={capabilities.runtime} /></div>
      {tool.launchCommand ? <div className="mt-6"><div className="mb-2 text-xs uppercase tracking-[0.14em] text-slate-500">Launch command</div><pre className="overflow-x-auto rounded-2xl border border-white/[0.07] bg-black/30 p-4 text-xs text-emerald-200"><code>{tool.launchCommand}</code></pre></div> : <div className="mt-6 rounded-2xl border border-sky-400/15 bg-sky-400/[0.05] p-4 text-sm leading-6 text-slate-300">Launch metadata has not been guessed. Open the repository for its current platform-specific setup instructions.</div>}
      <div className="mt-7 flex gap-3"><button type="button" onClick={execute} className="flex-1 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-[#04110d]">{action.action === 'view-setup' && tool.launchCommand ? 'Copy command' : action.label}</button><a href={tool.repository} target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-xl border border-white/10 px-4 text-white" aria-label={`Open ${tool.name} repository`}><ExternalLink className="h-4 w-4" /></a></div>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4"><div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</div><div className="mt-2 text-sm font-medium capitalize text-white">{value}</div></div>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
