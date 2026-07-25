import { useMemo, useState } from 'react';
import { Blocks, Bot, BrainCircuit, FlaskConical, GitBranch, Play, Search, Swords, Users } from 'lucide-react';
import { agentCouncil, collectiveProjects } from '../command-center/data';
import { useToolRuntimeStore } from '../tool-runtime/useToolRuntimeStore';

const MODES = [
  { id: 'scenario', label: 'Scenario', icon: FlaskConical, framework: 'MiroFish', toolId: 'mirofish', description: 'Build a parallel-world simulation and inspect possible trajectories.' },
  { id: 'debate', label: 'Debate', icon: Swords, framework: 'AutoGen', toolId: 'autogen', description: 'Assign competing positions, challenge assumptions, and reconcile a recommendation.' },
  { id: 'build', label: 'Build swarm', icon: Blocks, framework: 'MetaGPT + LangGraph', toolId: 'metagpt', description: 'Coordinate product, design, engineering, QA, and release roles.' },
  { id: 'research', label: 'Research swarm', icon: Search, framework: 'CrewAI + CAMEL', toolId: 'crewai', description: 'Parallelize evidence collection, synthesis, critique, and final reporting.' },
] as const;

type CouncilMode = typeof MODES[number]['id'];

export function CouncilComposer() {
  const [mode, setMode] = useState<CouncilMode>('scenario');
  const [prompt, setPrompt] = useState('');
  const [projectId, setProjectId] = useState(collectiveProjects[0]?.id ?? '');
  const [selectedAgents, setSelectedAgents] = useState(() => agentCouncil.slice(0, 4).map(agent => agent.id));
  const createJob = useToolRuntimeStore(state => state.createJob);
  const openWorkspace = useToolRuntimeStore(state => state.openWorkspace);
  const jobs = useToolRuntimeStore(state => state.jobs);
  const activeMode = MODES.find(item => item.id === mode) ?? MODES[0];
  const recentJobs = useMemo(() => jobs.filter(job => MODES.some(item => item.toolId === job.toolId)).slice(0, 6), [jobs]);

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(current => current.includes(agentId) ? current.filter(id => id !== agentId) : [...current, agentId]);
  };

  const launch = async () => {
    const normalized = prompt.trim();
    if (!normalized) return;
    const project = collectiveProjects.find(item => item.id === projectId);
    await createJob({
      toolId: activeMode.toolId,
      title: `${activeMode.label}: ${project?.name ?? 'Founder mission'}`,
      actionId: activeMode.id,
      input: {
        prompt: normalized,
        projectId,
        projectName: project?.name,
        agents: selectedAgents,
        framework: activeMode.framework,
      },
    });
    openWorkspace(activeMode.toolId);
    setPrompt('');
  };

  return (
    <div className="grid min-h-full gap-0 xl:grid-cols-[minmax(0,1fr)_310px]">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-white/[0.06] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4a843]"><BrainCircuit className="h-4 w-4" /> Agent Council composer</div><h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Coordinate intelligence, not chat windows.</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Choose an operating pattern, attach project context, select the Council, and dispatch one tracked execution through ZENITH.</p></div>
          <div className="flex items-center gap-2 rounded-lg border border-[#00d9b5]/16 bg-[#00d9b5]/[0.045] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#72dec9]"><GitBranch className="h-3.5 w-3.5" /> ZENITH routing active</div>
        </div>

        <section className="mt-5">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">Operating pattern</div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {MODES.map(item => {
              const Icon = item.icon;
              const active = item.id === mode;
              return <button key={item.id} type="button" onClick={() => setMode(item.id)} aria-label={item.label} className={`min-h-[126px] rounded-xl border p-3 text-left transition ${active ? 'border-[#d4a843]/30 bg-[#d4a843]/[0.075] shadow-[inset_0_0_0_1px_rgba(212,168,67,0.06)]' : 'border-white/[0.07] bg-white/[0.018] hover:border-white/[0.12] hover:bg-white/[0.03]'}`}><div className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-[#d4a843]/12 text-[#e6c66d]' : 'bg-white/[0.035] text-slate-500'}`}><Icon className="h-4 w-4" /></div><div className="mt-3 text-sm font-medium text-white">{item.label}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#86a7b9]">{item.framework}</div><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{item.description}</p></button>;
            })}
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <section>
            <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">Project context</span><select value={projectId} onChange={event => setProjectId(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-white/[0.08] bg-[#090e16] px-3 text-sm text-slate-200 outline-none focus:border-[#d4a843]/30">{collectiveProjects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
            <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">Participating agents</div>
            <div className="mt-2 space-y-1.5">
              {agentCouncil.slice(0, 7).map(agent => {
                const selected = selectedAgents.includes(agent.id);
                return <button key={agent.id} type="button" onClick={() => toggleAgent(agent.id)} className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${selected ? 'border-[#00d9b5]/16 bg-[#00d9b5]/[0.045]' : 'border-white/[0.05] bg-white/[0.015] opacity-55 hover:opacity-100'}`}><span className={`h-1.5 w-1.5 rounded-full ${selected ? 'bg-[#00d9b5]' : 'bg-slate-700'}`} /><span className="min-w-0 flex-1 truncate text-xs text-slate-300">{agent.name}</span></button>;
              })}
            </div>
          </section>

          <section>
            <div className="rounded-xl border border-white/[0.075] bg-[#080d15] p-4">
              <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#d4a843]"><Bot className="h-4 w-4" /> Founder command</div><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-700">{activeMode.framework}</span></div>
              <textarea value={prompt} onChange={event => setPrompt(event.target.value)} rows={10} placeholder={`Describe the ${activeMode.label.toLocaleLowerCase()} objective, decision, constraints, required evidence, and final output.`} className="mt-4 w-full resize-none bg-transparent text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-700" />
              <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-xs text-slate-600"><Users className="h-3.5 w-3.5" /> {selectedAgents.length} agents · {activeMode.framework}</div><button type="button" onClick={() => void launch()} disabled={!prompt.trim()} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#d4a843] px-4 text-sm font-semibold text-[#171105] hover:bg-[#e3bb5c] disabled:opacity-35"><Play className="h-4 w-4" /> Dispatch through ZENITH</button></div>
            </div>
          </section>
        </div>
      </div>

      <aside className="border-t border-white/[0.06] bg-[#060a10]/76 p-4 xl:border-l xl:border-t-0">
        <div className="flex items-center justify-between"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Council runs</div><span className="rounded bg-white/[0.03] px-2 py-1 font-mono text-[9px] text-slate-600">{recentJobs.length}</span></div>
        <div className="mt-3 space-y-2">
          {recentJobs.length ? recentJobs.map(job => <article key={job.id} className="rounded-xl border border-white/[0.06] bg-white/[0.018] p-3"><div className="flex items-start gap-2"><BrainCircuit className="mt-0.5 h-4 w-4 text-[#00d9b5]" /><div className="min-w-0"><div className="text-xs font-medium leading-5 text-slate-200">{job.title}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.11em] text-slate-600">{job.status} · {job.toolId}</div></div></div></article>) : <div className="rounded-xl border border-dashed border-white/[0.07] px-4 py-10 text-center text-xs leading-5 text-slate-600">Council runs will appear here with their framework, status, and output.</div>}
        </div>
      </aside>
    </div>
  );
}
