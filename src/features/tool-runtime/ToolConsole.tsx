import { useMemo, useState } from 'react';
import { Bot, Play, TerminalSquare } from 'lucide-react';
import { useToolRuntimeStore } from './useToolRuntimeStore';
import type { ToolManifest } from './types';

interface ToolConsoleProps {
  manifest: ToolManifest;
}

const ACTIONS: Record<ToolManifest['adapter'], Array<{ id: string; label: string }>> = {
  'embedded-web': [{ id: 'inspect', label: 'Inspect service' }],
  'managed-service': [{ id: 'inspect', label: 'Inspect API' }, { id: 'workflow', label: 'Run workflow' }],
  'native-app': [{ id: 'launch', label: 'Launch application' }, { id: 'render', label: 'Run project task' }],
  cli: [{ id: 'run', label: 'Run approved task' }],
  'agent-framework': [{ id: 'scenario', label: 'Run scenario' }, { id: 'debate', label: 'Run debate' }, { id: 'crew', label: 'Run crew' }],
  library: [{ id: 'query', label: 'Run library query' }],
};

export function ToolConsole({ manifest }: ToolConsoleProps) {
  const [prompt, setPrompt] = useState('');
  const [actionId, setActionId] = useState(ACTIONS[manifest.adapter][0]?.id ?? 'run');
  const createJob = useToolRuntimeStore(state => state.createJob);
  const jobs = useToolRuntimeStore(state => state.jobs);
  const toolJobs = useMemo(() => jobs.filter(job => job.toolId === manifest.id), [jobs, manifest.id]);

  const submit = async () => {
    const normalized = prompt.trim();
    if (!normalized) return;
    await createJob({
      toolId: manifest.id,
      title: `${manifest.name}: ${ACTIONS[manifest.adapter].find(action => action.id === actionId)?.label ?? 'Task'}`,
      actionId,
      input: { prompt: normalized },
    });
    setPrompt('');
  };

  return (
    <div className="grid min-h-[430px] gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="border-b border-white/[0.06] p-5 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#d4a843]"><TerminalSquare className="h-4 w-4" /> Approved job console</div>
        <h3 className="mt-4 text-lg font-semibold text-white">Direct {manifest.name} without leaving HATAALII.</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Jobs carry structured inputs and an approved action ID. The browser cannot submit raw shell commands to the execution node.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
          <label className="text-xs text-slate-500"><span className="mb-2 block font-mono uppercase tracking-[0.12em]">Operation</span><select value={actionId} onChange={event => setActionId(event.target.value)} className="h-11 w-full rounded-lg border border-white/[0.08] bg-[#0a1018] px-3 text-sm text-slate-200 outline-none focus:border-[#d4a843]/35">{ACTIONS[manifest.adapter].map(action => <option key={action.id} value={action.id}>{action.label}</option>)}</select></label>
          <label className="text-xs text-slate-500"><span className="mb-2 block font-mono uppercase tracking-[0.12em]">Task context</span><textarea value={prompt} onChange={event => setPrompt(event.target.value)} rows={5} placeholder={`Describe the ${manifest.name} task, desired output, project context, and constraints.`} className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0a1018] px-3 py-3 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-700 focus:border-[#d4a843]/35" /></label>
        </div>
        <button type="button" onClick={() => void submit()} disabled={!prompt.trim()} className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#d4a843] px-4 text-sm font-semibold text-[#171105] transition hover:bg-[#e3bb5c] disabled:cursor-not-allowed disabled:opacity-35"><Play className="h-4 w-4" /> Queue tracked job</button>
      </section>
      <aside className="bg-[#060a10]/72 p-4">
        <div className="flex items-center justify-between"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Job history</div><span className="rounded-md bg-white/[0.035] px-2 py-1 font-mono text-[9px] text-slate-600">{toolJobs.length}</span></div>
        <div className="mt-3 space-y-2">
          {toolJobs.length ? toolJobs.map(job => (
            <article key={job.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-start gap-2"><Bot className="mt-0.5 h-3.5 w-3.5 text-[#00d9b5]" /><div className="min-w-0 flex-1"><div className="truncate text-xs font-medium text-slate-200">{job.title}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-slate-600">{job.status} · {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></div></div>
            </article>
          )) : <div className="rounded-xl border border-dashed border-white/[0.07] px-4 py-8 text-center text-xs leading-5 text-slate-600">No jobs have been submitted for this tool.</div>}
        </div>
      </aside>
    </div>
  );
}
