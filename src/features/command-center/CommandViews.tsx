import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  Boxes,
  BriefcaseBusiness,
  CircleDollarSign,
  Clock3,
  CloudCog,
  Command,
  Filter,
  FolderKanban,
  Gauge,
  Layers3,
  Network,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import type { AppId } from '../../types';
import { CouncilComposer } from '../agent-council/CouncilComposer';
import { getToolManifest } from '../tool-runtime/manifests';
import { useToolRuntimeStore } from '../tool-runtime/useToolRuntimeStore';
import { agentCouncil, collectiveProjects, commandMetrics, searchCommandCenter, toolRegistry, ventureStreams } from './data';
import type { CommandSection, ProjectDefinition, SearchResult, ToolCategory } from './types';

interface CommonViewProps {
  onNavigate: (section: CommandSection) => void;
  onOpenApp: (appId: AppId) => void;
  onProject: (project: ProjectDefinition) => void;
  onTool: (toolId: string) => void;
}

export function CockpitView({ onNavigate, onOpenApp, onProject, onTool }: CommonViewProps) {
  const activeProjects = collectiveProjects.filter(project => project.health === 'attention' || project.health === 'building');
  const totalTarget = ventureStreams.reduce((sum, stream) => sum + stream.monthlyTarget, 0);
  const totalCollected = ventureStreams.reduce((sum, stream) => sum + stream.collected, 0);

  return (
    <div className="command-analysis p-4 sm:p-6 xl:p-7">
      <div className="flex flex-col gap-5 border-b border-white/[0.065] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#d4a843]"><Target className="h-4 w-4" /> Founder operational picture</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl">Founder Cockpit</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">The live operating picture for revenue, official Collective AI responsibilities, agent execution, and embedded production infrastructure.</p>
        </div>
        <button type="button" onClick={() => onOpenApp('agent-council')} aria-label="Orchestrate with Council" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#d4a843] px-4 text-sm font-semibold text-[#171105] shadow-[0_10px_30px_rgba(212,168,67,0.12)] hover:bg-[#e1b956]"><Sparkles className="h-4 w-4" /> Orchestrate with Council</button>
      </div>

      <div className="mt-5 grid divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.065] bg-[#080d15]/76 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
        {commandMetrics.map((metric, index) => (
          <div key={metric.id} className="relative px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-600">0{index + 1}</span><Activity className={`h-3.5 w-3.5 ${metric.trend === 'attention' ? 'text-amber-300' : 'text-[#00d9b5]'}`} /></div>
            <div className="mt-4 text-3xl font-semibold tracking-tight text-white">{metric.value}</div>
            <div className="mt-1 text-xs font-medium text-slate-300">{metric.label}</div>
            <div className="mt-1 text-[11px] text-slate-600">{metric.detail}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 2xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]">
        <section className="overflow-hidden rounded-xl border border-white/[0.065] bg-[#070c13]/78">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5 sm:px-5"><div><h2 className="text-sm font-semibold text-white">Mission queue</h2><p className="mt-0.5 text-[11px] text-slate-600">Highest-leverage Collective AI and client responsibilities.</p></div><button type="button" onClick={() => onNavigate('portfolio')} className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#d4a843] hover:text-[#e6c66d]">Full portfolio <ArrowRight className="h-3 w-3" /></button></div>
          <div className="hidden grid-cols-[minmax(180px,1fr)_110px_100px_minmax(220px,1.35fr)_32px] gap-4 border-b border-white/[0.05] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-700 md:grid"><span>Mission</span><span>Division</span><span>Progress</span><span>Next move</span><span /></div>
          {activeProjects.slice(0, 8).map(project => <MissionRow key={project.id} project={project} onClick={() => onProject(project)} />)}
        </section>

        <div className="grid gap-5">
          <section className="rounded-xl border border-[#d4a843]/14 bg-[linear-gradient(145deg,rgba(212,168,67,0.065),rgba(7,12,19,0.85)_52%)] p-5">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#d4a843]"><TrendingUp className="h-4 w-4" /> Revenue posture</div><span className="font-mono text-[9px] text-slate-600">MTD</span></div>
            <div className="mt-5 flex items-end justify-between gap-4"><div><div className="text-3xl font-semibold text-white">{formatCurrency(totalCollected)}</div><div className="mt-1 text-xs text-slate-500">of {formatCurrency(totalTarget)} monthly target</div></div><div className="text-right"><div className="font-mono text-xl text-[#00d9b5]">{Math.round((totalCollected / totalTarget) * 100)}%</div><div className="text-[10px] text-slate-600">attained</div></div></div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-gradient-to-r from-[#d4a843] to-[#00d9b5]" style={{ width: `${Math.max(4, (totalCollected / totalTarget) * 100)}%` }} /></div>
            <div className="mt-5 grid grid-cols-2 gap-2">{ventureStreams.slice(0, 4).map(stream => <button key={stream.id} type="button" onClick={() => onNavigate('revenue')} className="rounded-lg border border-white/[0.055] bg-white/[0.018] p-2.5 text-left hover:border-[#d4a843]/16"><div className="truncate text-xs text-slate-300">{stream.name}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-slate-700">{stream.stage}</div></button>)}</div>
          </section>

          <section className="rounded-xl border border-white/[0.065] bg-[#070c13]/78 p-4">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold text-white"><CloudCog className="h-4 w-4 text-[#00d9b5]" /> Production stack</div><button type="button" onClick={() => onNavigate('tools')} className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#d4a843]">Tool Forge</button></div>
            <div className="mt-3 grid grid-cols-2 gap-2">{['comfyui', 'ollama', 'mirofish', 'plane'].map(id => { const tool = toolRegistry.find(item => item.id === id); return tool ? <button key={id} type="button" onClick={() => onTool(id)} className="flex items-center gap-2 rounded-lg border border-white/[0.055] bg-white/[0.018] p-2.5 text-left hover:border-[#00d9b5]/18"><span className="h-1.5 w-1.5 rounded-full bg-slate-700" /><span className="truncate text-xs text-slate-400">{tool.name}</span></button> : null; })}</div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MissionRow({ project, onClick }: { project: ProjectDefinition; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group grid w-full gap-2 border-b border-white/[0.045] px-4 py-3.5 text-left last:border-0 hover:bg-white/[0.025] md:grid-cols-[minmax(180px,1fr)_110px_100px_minmax(220px,1.35fr)_32px] md:items-center md:gap-4 md:px-5">
      <div className="min-w-0"><div className="truncate text-sm font-medium text-slate-100">{project.name}</div><div className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-slate-700"><span className={`h-1.5 w-1.5 rounded-full ${project.health === 'attention' ? 'bg-amber-300' : 'bg-[#00d9b5]'}`} />{project.valueLabel}</div></div>
      <div className="truncate text-[11px] text-slate-600">{project.division}</div>
      <div><div className="flex justify-between font-mono text-[9px] text-slate-600"><span>{project.progress}%</span></div><div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.055]"><div className="h-full bg-[#00d9b5]" style={{ width: `${project.progress}%` }} /></div></div>
      <div className="line-clamp-2 text-xs leading-5 text-slate-500">{project.nextMilestone}</div>
      <ArrowRight className="h-4 w-4 text-slate-800 transition group-hover:translate-x-0.5 group-hover:text-[#d4a843]" />
    </button>
  );
}

export function PortfolioView({ onProject }: Pick<CommonViewProps, 'onProject'>) {
  const [filter, setFilter] = useState<'all' | ProjectDefinition['kind']>('all');
  const projects = filter === 'all' ? collectiveProjects : collectiveProjects.filter(project => project.kind === filter);
  return (
    <div className="command-analysis p-4 sm:p-6 xl:p-7">
      <AnalysisHeader eyebrow="Official project portfolio" title="Collective AI Mission Control" description="JR Moyler’s official Collective AI responsibilities, client commitments, internal platforms, and strategic products organized by execution state." icon={FolderKanban} />
      <div className="mt-5 flex flex-wrap items-center gap-2">{(['all', 'collective-ai', 'client', 'platform', 'venture'] as const).map(value => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-lg border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] ${filter === value ? 'border-[#d4a843]/25 bg-[#d4a843]/[0.07] text-[#e6c66d]' : 'border-white/[0.06] bg-white/[0.018] text-slate-600 hover:text-slate-300'}`}>{value.replace('-', ' ')}</button>)}</div>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.065] bg-[#070c13]/78">
        <div className="hidden grid-cols-[minmax(190px,1fr)_110px_130px_110px_minmax(240px,1.3fr)_32px] gap-4 border-b border-white/[0.06] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-700 lg:grid"><span>Project</span><span>Type</span><span>Division</span><span>Status</span><span>Next milestone</span><span /></div>
        {projects.map(project => <button key={project.id} type="button" onClick={() => onProject(project)} className="group grid w-full gap-2 border-b border-white/[0.045] px-4 py-4 text-left last:border-0 hover:bg-white/[0.025] lg:grid-cols-[minmax(190px,1fr)_110px_130px_110px_minmax(240px,1.3fr)_32px] lg:items-center lg:gap-4 lg:px-5"><div><div className="text-sm font-medium text-white">{project.name}</div><div className="mt-1 line-clamp-1 text-[11px] text-slate-600">{project.description}</div></div><div className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#86a7b9]">{project.kind.replace('-', ' ')}</div><div className="truncate text-[11px] text-slate-600">{project.division}</div><div><div className="flex items-center justify-between font-mono text-[9px]"><span className={project.health === 'attention' ? 'text-amber-300' : 'text-[#00d9b5]'}>{project.health}</span><span className="text-slate-700">{project.progress}%</span></div><div className="mt-1.5 h-1 overflow-hidden bg-white/[0.05]"><div className="h-full bg-[#00d9b5]" style={{ width: `${project.progress}%` }} /></div></div><div className="line-clamp-2 text-xs leading-5 text-slate-500">{project.nextMilestone}</div><ArrowRight className="h-4 w-4 text-slate-800 group-hover:text-[#d4a843]" /></button>)}
      </div>
    </div>
  );
}

export function RevenueView() {
  const totalTarget = ventureStreams.reduce((sum, stream) => sum + stream.monthlyTarget, 0);
  const totalCollected = ventureStreams.reduce((sum, stream) => sum + stream.collected, 0);
  return (
    <div className="command-analysis p-4 sm:p-6 xl:p-7">
      <AnalysisHeader eyebrow="Personal funding engines" title="Revenue Command" description="Every venture, client service, commission lane, and product is measured by cash collected, next action, and contribution to Collective AI Inc." icon={CircleDollarSign} />
      <div className="mt-5 grid overflow-hidden rounded-xl border border-white/[0.065] bg-[#080d15]/76 sm:grid-cols-3 sm:divide-x sm:divide-white/[0.06]">{[
        ['Monthly target', formatCurrency(totalTarget), 'Across all active lanes'],
        ['Collected', formatCurrency(totalCollected), `${Math.round((totalCollected / totalTarget) * 100)}% of monthly target`],
        ['Collective allocation', '10–25%', 'After delivery and operating costs'],
      ].map(([label, value, detail]) => <div key={label} className="border-b border-white/[0.06] p-5 last:border-0 sm:border-b-0"><div className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">{label}</div><div className="mt-3 text-3xl font-semibold text-white">{value}</div><div className="mt-1 text-xs text-slate-600">{detail}</div></div>)}</div>
      <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.065] bg-[#070c13]/78"><div className="hidden grid-cols-[minmax(180px,1fr)_90px_110px_110px_minmax(240px,1.4fr)_70px] gap-4 border-b border-white/[0.06] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-700 lg:grid"><span>Income engine</span><span>Stage</span><span>Collected</span><span>Target</span><span>Next action</span><span>CAI</span></div>{ventureStreams.map(stream => <div key={stream.id} className="grid gap-2 border-b border-white/[0.045] px-4 py-4 last:border-0 lg:grid-cols-[minmax(180px,1fr)_90px_110px_110px_minmax(240px,1.4fr)_70px] lg:items-center lg:gap-4 lg:px-5"><div><div className="text-sm font-medium text-white">{stream.name}</div><div className="mt-1 line-clamp-1 text-[11px] text-slate-600">{stream.description}</div></div><div className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#86a7b9]">{stream.stage}</div><div className="text-sm text-slate-300">{formatCurrency(stream.collected)}</div><div className="text-sm text-slate-400">{formatCurrency(stream.monthlyTarget)}</div><div className="text-xs leading-5 text-slate-500">{stream.nextAction}</div><div className="font-mono text-xs text-[#00d9b5]">{stream.collectiveAllocation}%</div></div>)}</div>
    </div>
  );
}

export function ToolForgeView({ onTool }: Pick<CommonViewProps, 'onTool'>) {
  const [category, setCategory] = useState<'All' | ToolCategory>('All');
  const statuses = useToolRuntimeStore(state => state.toolStatuses);
  const nodeConnected = useToolRuntimeStore(state => state.nodeConnected);
  const filtered = category === 'All' ? toolRegistry : toolRegistry.filter(tool => tool.category === category);
  const categories = ['All', ...new Set(toolRegistry.map(tool => tool.category))] as Array<'All' | ToolCategory>;

  return (
    <div className="command-analysis p-4 sm:p-6 xl:p-7">
      <AnalysisHeader eyebrow="Embedded production environment" title="Open-source Tool Forge" description="Every tool opens inside HATAALII OS through an embedded UI, native bridge, API console, or tracked job workspace. Repository pages are no longer part of the operating flow." icon={Wrench} />
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{categories.map(value => <button key={value} type="button" onClick={() => setCategory(value)} className={`whitespace-nowrap rounded-lg border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.11em] ${category === value ? 'border-[#d4a843]/25 bg-[#d4a843]/[0.07] text-[#e6c66d]' : 'border-white/[0.06] bg-white/[0.018] text-slate-600 hover:text-slate-300'}`}>{value}</button>)}</div>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.065] bg-[#070c13]/78">
        <div className="hidden grid-cols-[minmax(170px,1fr)_135px_105px_110px_minmax(200px,1.25fr)_120px] gap-4 border-b border-white/[0.06] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-700 lg:grid"><span>Tool</span><span>Category</span><span>Adapter</span><span>Runtime</span><span>Capability</span><span>Action</span></div>
        {filtered.map(tool => {
          const manifest = getToolManifest(tool.id);
          const status = statuses[tool.id]?.state ?? (manifest?.recipe ? 'installable' : 'discovered');
          return <button key={tool.id} type="button" onClick={() => onTool(tool.id)} className="group grid w-full gap-2 border-b border-white/[0.045] px-4 py-4 text-left last:border-0 hover:bg-white/[0.025] lg:grid-cols-[minmax(170px,1fr)_135px_105px_110px_minmax(200px,1.25fr)_120px] lg:items-center lg:gap-4 lg:px-5" aria-label={`Open ${tool.name} workspace`}><div><div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${status === 'running' ? 'bg-[#00d9b5] shadow-[0_0_8px_rgba(0,217,181,0.8)]' : status === 'failed' ? 'bg-rose-300' : 'bg-slate-700'}`} /><span className="text-sm font-medium text-white">{tool.name}</span></div><div className="mt-1 line-clamp-1 text-[11px] text-slate-600">{tool.description}</div></div><div className="text-[11px] text-[#86a7b9]">{tool.category}</div><div className="font-mono text-[9px] uppercase tracking-[0.1em] text-slate-600">{manifest?.adapter ?? tool.runtime}</div><div className="font-mono text-[9px] uppercase tracking-[0.1em] text-slate-500">{nodeConnected ? status : 'node offline'}</div><div className="line-clamp-1 text-[11px] text-slate-600">{manifest?.capabilities.join(' · ') ?? 'workspace'}</div><div className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#d4a843]">Open inside OS <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" /></div></button>;
        })}
      </div>
    </div>
  );
}

export function ContextPanel({ section, query, onQuery, onResult, onNavigate }: { section: CommandSection; query: string; onQuery: (query: string) => void; onResult: (result: SearchResult) => void; onNavigate: (section: CommandSection) => void }) {
  const results = useMemo(() => searchCommandCenter(query), [query]);
  const sectionCopy: Record<CommandSection, { label: string; items: string[] }> = {
    cockpit: { label: 'Cockpit views', items: ['Today’s command queue', 'Revenue momentum', 'Mission dependencies', 'Recent agent activity'] },
    portfolio: { label: 'Portfolio views', items: ['All active projects', 'Collective AI products', 'Client commitments', 'Attention required'] },
    revenue: { label: 'Revenue views', items: ['Cash collected', 'Pipeline actions', 'Commission lanes', 'Collective allocation'] },
    council: { label: 'Council modes', items: ['Scenario simulation', 'Structured debate', 'Build swarm', 'Research swarm'] },
    tools: { label: 'Tool operations', items: ['Running services', 'Installable tools', 'Native applications', 'Tracked jobs'] },
  };
  return (
    <div>
      <div className="flex items-center justify-between"><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Operations</div><Command className="h-3.5 w-3.5 text-slate-700" /></div>
      <div className="relative mt-4"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-700" /><input type="search" aria-label="Search everything" value={query} onChange={event => onQuery(event.target.value)} placeholder="Search everything" className="h-9 w-full rounded-lg border border-white/[0.065] bg-white/[0.02] pl-9 pr-3 text-xs text-slate-300 outline-none placeholder:text-slate-700 focus:border-[#d4a843]/25" /></div>
      {query.trim() ? <div className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-white/[0.06] bg-[#060a10] p-1">{results.length ? results.map(result => <button key={`${result.type}-${result.id}`} type="button" onClick={() => onResult(result)} aria-label={`${result.title} ${result.subtitle}`} className="w-full rounded-md px-2.5 py-2 text-left hover:bg-white/[0.035]"><div className="truncate text-xs font-medium text-slate-300">{result.title}</div><div className="mt-0.5 truncate text-[10px] text-slate-700">{result.subtitle}</div></button>) : <div className="px-3 py-6 text-center text-xs text-slate-700">No matches.</div>}</div> : null}
      <div className="mt-6 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-700">{sectionCopy[section].label}</div>
      <div className="mt-2 space-y-1">{sectionCopy[section].items.map((item, index) => <button key={item} type="button" onClick={() => onNavigate(section)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/[0.025]"><span className="font-mono text-[9px] text-slate-800">0{index + 1}</span><span className="text-xs text-slate-500">{item}</span></button>)}</div>
      <div className="mt-7 rounded-xl border border-[#00d9b5]/12 bg-[#00d9b5]/[0.035] p-3"><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#6edbc8]"><Network className="h-3.5 w-3.5" /> Collective lattice</div><div className="mt-3 grid grid-cols-2 gap-2 text-center"><div className="rounded-lg bg-black/15 p-2"><div className="text-lg font-semibold text-white">10</div><div className="font-mono text-[8px] uppercase text-slate-700">Agents</div></div><div className="rounded-lg bg-black/15 p-2"><div className="text-lg font-semibold text-white">{collectiveProjects.length}</div><div className="font-mono text-[8px] uppercase text-slate-700">Projects</div></div></div></div>
    </div>
  );
}

export function IntelligencePanel({ section, selectedProject, activeToolId }: { section: CommandSection; selectedProject?: ProjectDefinition | null; activeToolId?: string | null }) {
  const nodeConnected = useToolRuntimeStore(state => state.nodeConnected);
  const health = useToolRuntimeStore(state => state.health);
  const tool = activeToolId ? toolRegistry.find(item => item.id === activeToolId) : null;
  return (
    <div className="p-4">
      <div className="flex items-center justify-between"><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Intelligence</div><Gauge className="h-4 w-4 text-[#d4a843]" /></div>
      <section className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.018] p-3"><div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600">Execution node</span><span className={`h-2 w-2 rounded-full ${nodeConnected ? 'bg-[#00d9b5]' : 'bg-slate-700'}`} /></div><div className="mt-3 text-sm font-medium text-slate-200">{nodeConnected ? health?.nodeId ?? 'Connected node' : 'Node offline'}</div><div className="mt-1 text-[11px] text-slate-600">{nodeConnected ? health?.platform : 'Local tools remain available as internal workspaces and activate when a node connects.'}</div></section>
      {selectedProject ? <section className="mt-3 rounded-xl border border-[#d4a843]/14 bg-[#d4a843]/[0.035] p-3"><div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#d4a843]">Selected mission</div><div className="mt-3 text-sm font-medium text-white">{selectedProject.name}</div><div className="mt-2 text-xs leading-5 text-slate-500">{selectedProject.nextMilestone}</div><div className="mt-3 h-1 overflow-hidden bg-white/[0.05]"><div className="h-full bg-[#d4a843]" style={{ width: `${selectedProject.progress}%` }} /></div></section> : null}
      {tool ? <section className="mt-3 rounded-xl border border-[#00d9b5]/12 bg-[#00d9b5]/[0.03] p-3"><div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#62d8c4]">Active tool</div><div className="mt-3 text-sm font-medium text-white">{tool.name}</div><div className="mt-2 text-xs leading-5 text-slate-600">{tool.description}</div></section> : null}
      <section className="mt-3"><div className="font-mono text-[9px] uppercase tracking-[0.13em] text-slate-700">Signals</div><div className="mt-2 space-y-2">{[
        ['Portfolio attention', `${collectiveProjects.filter(project => project.health === 'attention').length} projects need a decision`, BriefcaseBusiness],
        ['Council capacity', `${agentCouncil.filter(agent => agent.status !== 'ready').length} agents currently active`, Bot],
        ['Revenue action', `${ventureStreams.filter(stream => stream.collected < stream.monthlyTarget).length} lanes below target`, TrendingUp],
        ['Current section', section, Layers3],
      ].map(([label, value, Icon]) => { const SignalIcon = Icon as typeof Activity; return <div key={String(label)} className="flex gap-3 rounded-lg border border-white/[0.045] bg-white/[0.012] p-2.5"><SignalIcon className="mt-0.5 h-3.5 w-3.5 text-slate-700" /><div><div className="text-[11px] text-slate-400">{String(label)}</div><div className="mt-0.5 text-[10px] text-slate-700">{String(value)}</div></div></div>; })}</div></section>
      <section className="mt-4 border-t border-white/[0.06] pt-4"><div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-slate-700"><span>Last synthesis</span><span className="flex items-center gap-1"><Clock3 className="h-3 w-3" /> now</span></div></section>
    </div>
  );
}

export function CouncilView() {
  return <CouncilComposer />;
}

function AnalysisHeader({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: typeof Activity }) {
  return <div className="flex flex-col gap-4 border-b border-white/[0.065] pb-6 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#d4a843]"><Icon className="h-4 w-4" />{eyebrow}</div><h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl">{title}</h1><p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">{description}</p></div><div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.018] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600"><Filter className="h-3.5 w-3.5" /> live indexed view</div></div>;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
