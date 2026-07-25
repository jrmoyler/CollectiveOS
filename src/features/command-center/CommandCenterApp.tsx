import { Bot, CircleDollarSign, ExternalLink, FolderKanban, Search, Wrench } from 'lucide-react';
import { agentCouncil, collectiveProjects, commandMetrics, toolRegistry, ventureStreams } from './data';
import { detectRuntimeCapabilities, getToolPrimaryAction } from './capabilities';

export type CommandCenterAppMode = 'cockpit' | 'portfolio' | 'council' | 'tools';

interface CommandCenterAppProps {
  mode: CommandCenterAppMode;
}

const MODE_COPY: Record<CommandCenterAppMode, { title: string; description: string }> = {
  cockpit: {
    title: 'Founder Cockpit',
    description: 'The focused window view of JR Moyler’s active revenue, project, and execution signals.',
  },
  portfolio: {
    title: 'Collective AI Mission Control',
    description: 'Official Collective AI projects and client responsibilities in one operating queue.',
  },
  council: {
    title: 'Agent Council',
    description: 'HATAALII, ZENITH, and specialized operators ready to coordinate execution.',
  },
  tools: {
    title: 'Tool Forge',
    description: 'Open-source frameworks and production tools registered inside CollectiveOS.',
  },
};

export function CommandCenterApp({ mode }: CommandCenterAppProps) {
  const copy = MODE_COPY[mode];

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#071020] text-slate-100">
      <header className="border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">{copy.title}</h1>
            <p className="mt-1 text-xs leading-5 text-slate-500">{copy.description}</p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            {mode === 'cockpit' ? <CircleDollarSign className="h-4 w-4" /> : null}
            {mode === 'portfolio' ? <FolderKanban className="h-4 w-4" /> : null}
            {mode === 'council' ? <Bot className="h-4 w-4" /> : null}
            {mode === 'tools' ? <Wrench className="h-4 w-4" /> : null}
          </div>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {mode === 'cockpit' ? <CockpitWindow /> : null}
        {mode === 'portfolio' ? <PortfolioWindow /> : null}
        {mode === 'council' ? <CouncilWindow /> : null}
        {mode === 'tools' ? <ToolsWindow /> : null}
      </div>
    </div>
  );
}

function CockpitWindow() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {commandMetrics.map(metric => (
          <div key={metric.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
            <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{metric.label}</div>
            <div className="mt-3 text-2xl font-semibold text-white">{metric.value}</div>
            <div className="mt-1 text-xs text-slate-400">{metric.detail}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
          <h2 className="text-sm font-semibold text-white">Priority project queue</h2>
          <div className="mt-3 space-y-2">
            {collectiveProjects.slice(0, 5).map(project => (
              <div key={project.id} className="rounded-xl bg-white/[0.03] p-3">
                <div className="flex justify-between gap-3"><span className="text-sm text-white">{project.name}</span><span className="text-xs text-emerald-300">{project.progress}%</span></div>
                <div className="mt-1 text-xs text-slate-500">{project.nextMilestone}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
          <h2 className="text-sm font-semibold text-emerald-200">Revenue lanes</h2>
          <div className="mt-3 space-y-3">
            {ventureStreams.slice(0, 5).map(stream => (
              <div key={stream.id} className="flex items-center justify-between gap-3 text-xs"><span className="text-slate-300">{stream.name}</span><span className="text-white">{formatCurrency(stream.monthlyTarget)}</span></div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function PortfolioWindow() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {collectiveProjects.map(project => (
        <article key={project.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-4"><h2 className="font-medium text-white">{project.name}</h2><span className="text-xs text-emerald-300">{project.progress}%</span></div>
          <p className="mt-2 text-xs leading-5 text-slate-500">{project.description}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${project.progress}%` }} /></div>
          <div className="mt-3 text-xs text-slate-400">{project.nextMilestone}</div>
        </article>
      ))}
    </div>
  );
}

function CouncilWindow() {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {agentCouncil.map(agent => (
        <article key={agent.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
          <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><Bot className="h-4 w-4" /></div><div><h2 className="text-sm font-medium text-white">{agent.name}</h2><div className="text-xs text-emerald-300">{agent.role}</div></div></div>
          <p className="mt-3 text-xs leading-5 text-slate-500">{agent.description}</p>
          <div className="mt-3 text-[10px] uppercase tracking-[0.14em] text-slate-600">{agent.framework}</div>
        </article>
      ))}
    </div>
  );
}

function ToolsWindow() {
  const capabilities = detectRuntimeCapabilities();
  return (
    <div>
      <div className="relative mb-4"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" /><input readOnly value="" aria-label="Tool search is available in the full command center" placeholder="Use full Tool Forge for search and filters" className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.03] pl-10 pr-3 text-xs text-slate-400 outline-none" /></div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {toolRegistry.slice(0, 24).map(tool => {
          const action = getToolPrimaryAction(tool, capabilities);
          return (
            <article key={tool.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-medium text-white">{tool.name}</h2><div className="mt-1 text-xs text-sky-300">{tool.category}</div></div><a href={tool.repository} target="_blank" rel="noreferrer" aria-label={`Open ${tool.name} repository`} className="text-slate-500 hover:text-white"><ExternalLink className="h-4 w-4" /></a></div>
              <p className="mt-3 text-xs leading-5 text-slate-500">{tool.description}</p>
              <div className="mt-4 rounded-lg bg-white/[0.035] px-3 py-2 text-center text-xs text-emerald-300">{action.label}</div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
