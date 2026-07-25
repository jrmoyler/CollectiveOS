import { useState } from 'react';
import { ArrowRight, Bot, CircleDollarSign, CloudCog, FolderKanban, Search, Wrench } from 'lucide-react';
import { CouncilComposer } from '../agent-council/CouncilComposer';
import { getToolManifest } from '../tool-runtime/manifests';
import { ToolWorkspace } from '../tool-runtime/ToolWorkspace';
import { useToolRuntimeStore } from '../tool-runtime/useToolRuntimeStore';
import { agentCouncil, collectiveProjects, commandMetrics, toolRegistry, ventureStreams } from './data';

export type CommandCenterAppMode = 'cockpit' | 'portfolio' | 'council' | 'tools';

interface CommandCenterAppProps {
  mode: CommandCenterAppMode;
}

const MODE_COPY: Record<CommandCenterAppMode, { title: string; description: string }> = {
  cockpit: {
    title: 'Founder Cockpit',
    description: 'Focused revenue, project, infrastructure, and execution signals.',
  },
  portfolio: {
    title: 'Collective AI Mission Control',
    description: 'Official Collective AI projects and client responsibilities in one operating queue.',
  },
  council: {
    title: 'Agent Council',
    description: 'Compose and route scenario, debate, research, and build-swarm operations.',
  },
  tools: {
    title: 'Tool Forge',
    description: 'Open-source production tools operating inside HATAALII OS.',
  },
};

export function CommandCenterApp({ mode }: CommandCenterAppProps) {
  const copy = MODE_COPY[mode];
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#05080e] text-slate-100">
      <header className="flex min-h-14 shrink-0 items-center justify-between gap-4 border-b border-white/[0.065] bg-[#070b12]/92 px-4 py-3">
        <div className="min-w-0"><h1 className="truncate text-lg font-semibold tracking-tight text-white">{copy.title}</h1><p className="mt-0.5 truncate text-[11px] text-slate-600">{copy.description}</p></div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d4a843]/20 bg-[#d4a843]/[0.07] text-[#d4a843]">
          {mode === 'cockpit' ? <CircleDollarSign className="h-4 w-4" /> : null}
          {mode === 'portfolio' ? <FolderKanban className="h-4 w-4" /> : null}
          {mode === 'council' ? <Bot className="h-4 w-4" /> : null}
          {mode === 'tools' ? <Wrench className="h-4 w-4" /> : null}
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {mode === 'cockpit' ? <CockpitWindow /> : null}
        {mode === 'portfolio' ? <PortfolioWindow /> : null}
        {mode === 'council' ? <CouncilComposer /> : null}
        {mode === 'tools' ? activeToolId ? <ToolWorkspace toolId={activeToolId} compact /> : <ToolsWindow onTool={setActiveToolId} /> : null}
      </div>
    </div>
  );
}

function CockpitWindow() {
  const nodeConnected = useToolRuntimeStore(state => state.nodeConnected);
  return (
    <div className="p-4">
      <div className="grid overflow-hidden rounded-xl border border-white/[0.065] bg-[#080d15]/76 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/[0.06]">
        {commandMetrics.map(metric => <div key={metric.id} className="border-b border-white/[0.06] p-4 last:border-0 lg:border-b-0"><div className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">{metric.label}</div><div className="mt-3 text-2xl font-semibold text-white">{metric.value}</div><div className="mt-1 text-[11px] text-slate-600">{metric.detail}</div></div>)}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="overflow-hidden rounded-xl border border-white/[0.065] bg-[#070c13]/78"><div className="border-b border-white/[0.06] px-4 py-3 text-xs font-semibold text-white">Priority mission queue</div>{collectiveProjects.slice(0, 6).map(project => <div key={project.id} className="grid grid-cols-[minmax(0,1fr)_70px] gap-3 border-b border-white/[0.045] px-4 py-3 last:border-0"><div><div className="text-xs font-medium text-slate-200">{project.name}</div><div className="mt-1 line-clamp-1 text-[10px] text-slate-600">{project.nextMilestone}</div></div><div className="font-mono text-[10px] text-[#00d9b5]">{project.progress}%</div></div>)}</section>
        <div className="space-y-4"><section className="rounded-xl border border-[#00d9b5]/12 bg-[#00d9b5]/[0.035] p-4"><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#65dac6]"><CloudCog className="h-3.5 w-3.5" /> Execution node</div><div className="mt-3 text-sm font-medium text-white">{nodeConnected ? 'Online' : 'Offline'}</div><div className="mt-1 text-[11px] text-slate-600">Embedded services and native tools</div></section><section className="rounded-xl border border-[#d4a843]/14 bg-[#d4a843]/[0.035] p-4"><div className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#d4a843]">Revenue lanes</div><div className="mt-3 space-y-2">{ventureStreams.slice(0, 4).map(stream => <div key={stream.id} className="flex justify-between gap-3 text-[11px]"><span className="truncate text-slate-500">{stream.name}</span><span className="text-slate-300">{formatCurrency(stream.monthlyTarget)}</span></div>)}</div></section></div>
      </div>
    </div>
  );
}

function PortfolioWindow() {
  return <div className="p-4"><div className="overflow-hidden rounded-xl border border-white/[0.065] bg-[#070c13]/78">{collectiveProjects.map(project => <article key={project.id} className="grid gap-2 border-b border-white/[0.045] px-4 py-3 last:border-0 md:grid-cols-[minmax(150px,1fr)_100px_90px_minmax(190px,1.3fr)] md:items-center"><div><div className="text-xs font-medium text-white">{project.name}</div><div className="mt-1 line-clamp-1 text-[10px] text-slate-600">{project.description}</div></div><div className="font-mono text-[9px] uppercase text-[#86a7b9]">{project.kind}</div><div><div className="font-mono text-[9px] text-[#00d9b5]">{project.progress}%</div><div className="mt-1 h-1 bg-white/[0.05]"><div className="h-full bg-[#00d9b5]" style={{ width: `${project.progress}%` }} /></div></div><div className="text-[10px] leading-4 text-slate-600">{project.nextMilestone}</div></article>)}</div></div>;
}

function ToolsWindow({ onTool }: { onTool: (toolId: string) => void }) {
  const [query, setQuery] = useState('');
  const statuses = useToolRuntimeStore(state => state.toolStatuses);
  const normalized = query.trim().toLocaleLowerCase();
  const tools = normalized ? toolRegistry.filter(tool => [tool.name, tool.category, tool.description, ...tool.tags].some(value => value.toLocaleLowerCase().includes(normalized))) : toolRegistry;
  return (
    <div className="p-4">
      <div className="relative mb-3"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-700" /><input value={query} onChange={event => setQuery(event.target.value)} aria-label="Search Tool Forge" placeholder="Search embedded tools" className="h-10 w-full rounded-lg border border-white/[0.07] bg-white/[0.02] pl-9 pr-3 text-xs text-slate-300 outline-none focus:border-[#d4a843]/25" /></div>
      <div className="overflow-hidden rounded-xl border border-white/[0.065] bg-[#070c13]/78">{tools.map(tool => { const manifest = getToolManifest(tool.id); const state = statuses[tool.id]?.state ?? (manifest?.recipe ? 'installable' : 'discovered'); return <button key={tool.id} type="button" onClick={() => onTool(tool.id)} aria-label={`Open ${tool.name} workspace`} className="group grid w-full gap-2 border-b border-white/[0.045] px-4 py-3 text-left last:border-0 hover:bg-white/[0.025] md:grid-cols-[minmax(160px,1fr)_120px_100px_110px] md:items-center"><div><div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${state === 'running' ? 'bg-[#00d9b5]' : 'bg-slate-700'}`} /><span className="text-xs font-medium text-white">{tool.name}</span></div><div className="mt-1 line-clamp-1 text-[10px] text-slate-600">{tool.description}</div></div><div className="text-[10px] text-[#86a7b9]">{tool.category}</div><div className="font-mono text-[9px] uppercase text-slate-600">{manifest?.adapter}</div><div className="flex items-center justify-between font-mono text-[9px] uppercase text-[#d4a843]">Open inside OS <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5" /></div></button>; })}</div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
