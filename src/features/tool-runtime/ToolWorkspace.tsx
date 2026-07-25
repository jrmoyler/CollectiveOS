import { useEffect, useMemo } from 'react';
import {
  Activity,
  Bot,
  Box,
  CircleStop,
  CloudCog,
  Download,
  FileCode2,
  LoaderCircle,
  Play,
  RefreshCw,
  Settings2,
  SquareTerminal,
} from 'lucide-react';
import { toolRegistry } from '../command-center/data';
import { EmbeddedToolFrame } from './EmbeddedToolFrame';
import { getToolManifest } from './manifests';
import { ToolConsole } from './ToolConsole';
import { useToolRuntimeStore } from './useToolRuntimeStore';
import type { ToolLifecycleState } from './types';

interface ToolWorkspaceProps {
  toolId: string;
  compact?: boolean;
}

const STATE_TONE: Record<ToolLifecycleState, string> = {
  discovered: 'text-slate-400 border-white/[0.08] bg-white/[0.025]',
  installable: 'text-[#d4a843] border-[#d4a843]/20 bg-[#d4a843]/[0.06]',
  installing: 'text-[#d4a843] border-[#d4a843]/20 bg-[#d4a843]/[0.06]',
  installed: 'text-[#86a7b9] border-[#86a7b9]/20 bg-[#86a7b9]/[0.06]',
  starting: 'text-[#00d9b5] border-[#00d9b5]/20 bg-[#00d9b5]/[0.06]',
  running: 'text-[#00d9b5] border-[#00d9b5]/20 bg-[#00d9b5]/[0.06]',
  stopping: 'text-amber-300 border-amber-300/20 bg-amber-300/[0.06]',
  stopped: 'text-slate-400 border-white/[0.08] bg-white/[0.025]',
  failed: 'text-rose-300 border-rose-300/20 bg-rose-300/[0.06]',
  unavailable: 'text-slate-500 border-white/[0.07] bg-white/[0.02]',
};

export function ToolWorkspace({ toolId, compact = false }: ToolWorkspaceProps) {
  const tool = toolRegistry.find(item => item.id === toolId);
  const manifest = getToolManifest(toolId);
  const nodeConnected = useToolRuntimeStore(state => state.nodeConnected);
  const nodeChecking = useToolRuntimeStore(state => state.nodeChecking);
  const nodeError = useToolRuntimeStore(state => state.nodeError);
  const status = useToolRuntimeStore(state => state.toolStatuses[toolId]);
  const logs = useToolRuntimeStore(state => state.logsByTool[toolId] ?? []);
  const activeTab = useToolRuntimeStore(state => state.activeWorkspaceTab);
  const connect = useToolRuntimeStore(state => state.connect);
  const setTab = useToolRuntimeStore(state => state.setWorkspaceTab);
  const installTool = useToolRuntimeStore(state => state.installTool);
  const startTool = useToolRuntimeStore(state => state.startTool);
  const stopTool = useToolRuntimeStore(state => state.stopTool);
  const refreshLogs = useToolRuntimeStore(state => state.refreshLogs);

  useEffect(() => {
    if (activeTab === 'logs' && nodeConnected) void refreshLogs(toolId);
  }, [activeTab, nodeConnected, refreshLogs, toolId]);

  const lifecycle = status?.state ?? (manifest?.recipe ? 'installable' : 'discovered');
  const tabs = useMemo(() => [
    { id: 'workspace' as const, label: 'Workspace', icon: Box },
    { id: 'console' as const, label: 'Console', icon: SquareTerminal },
    { id: 'logs' as const, label: 'Logs', icon: Activity },
    { id: 'config' as const, label: 'Configuration', icon: Settings2 },
  ], []);

  if (!tool || !manifest) {
    return <div className="flex h-full items-center justify-center bg-[#05080e] text-sm text-slate-500">Tool runtime manifest not found.</div>;
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#05080e] text-slate-100">
      <header className="border-b border-white/[0.065] bg-[#070b12]/92 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d4a843]/20 bg-[#d4a843]/[0.07] text-[#d4a843]"><CloudCog className="h-5 w-5" /></div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold tracking-tight text-white`}>{tool.name}</h1>
                <span className={`rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${STATE_TONE[lifecycle]}`}>{lifecycle}</span>
              </div>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">{tool.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600">
                <span>{tool.category}</span><span>·</span><span>{manifest.adapter}</span>{manifest.ports.length ? <><span>·</span><span>ports {manifest.ports.join(' / ')}</span></> : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!nodeConnected ? (
              <button type="button" onClick={() => void connect()} disabled={nodeChecking} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d4a843]/22 bg-[#d4a843]/[0.075] px-3 text-xs font-semibold text-[#e6c66d] hover:bg-[#d4a843]/[0.11] disabled:opacity-50">
                {nodeChecking ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <CloudCog className="h-3.5 w-3.5" />} Connect node
              </button>
            ) : null}
            {nodeConnected && ['discovered', 'installable', 'unavailable', 'failed'].includes(lifecycle) ? (
              <button type="button" onClick={() => void installTool(toolId)} aria-label={`Install ${tool.name}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-slate-300 hover:border-[#d4a843]/24 hover:text-white"><Download className="h-3.5 w-3.5" /> Install</button>
            ) : null}
            {nodeConnected && lifecycle !== 'running' && lifecycle !== 'starting' ? (
              <button type="button" onClick={() => void startTool(toolId)} aria-label={`Start ${tool.name}`} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#00d9b5] px-3 text-xs font-semibold text-[#03110e] hover:bg-[#30e8cb]"><Play className="h-3.5 w-3.5" /> {manifest.adapter === 'native-app' ? 'Launch' : 'Start'}</button>
            ) : null}
            {nodeConnected && lifecycle === 'running' ? (
              <button type="button" onClick={() => void stopTool(toolId)} aria-label={`Stop ${tool.name}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-300/20 bg-rose-300/[0.07] px-3 text-xs font-medium text-rose-200 hover:bg-rose-300/[0.11]"><CircleStop className="h-3.5 w-3.5" /> Stop</button>
            ) : null}
            <button type="button" onClick={() => nodeConnected ? void refreshLogs(toolId) : void connect()} aria-label="Refresh tool state" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-slate-500 hover:text-white"><RefreshCw className="h-3.5 w-3.5" /></button>
          </div>
        </div>
        {nodeError ? <div className="mt-3 rounded-lg border border-rose-300/15 bg-rose-300/[0.045] px-3 py-2 text-xs text-rose-200/80">{nodeError}</div> : null}
      </header>

      <div className="flex h-10 items-center gap-1 overflow-x-auto border-b border-white/[0.06] bg-[#060a10]/88 px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return <button key={tab.id} type="button" onClick={() => setTab(tab.id)} className={`flex h-8 items-center gap-2 whitespace-nowrap rounded-md px-3 text-xs transition ${activeTab === tab.id ? 'bg-white/[0.055] text-white shadow-[inset_0_-1px_0_rgba(212,168,67,0.55)]' : 'text-slate-600 hover:bg-white/[0.025] hover:text-slate-300'}`}><Icon className="h-3.5 w-3.5" />{tab.label}</button>;
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {activeTab === 'workspace' ? <EmbeddedToolFrame manifest={manifest} status={status} nodeConnected={nodeConnected} /> : null}
        {activeTab === 'console' ? <ToolConsole manifest={manifest} /> : null}
        {activeTab === 'logs' ? <RuntimeLogs toolName={tool.name} logs={logs} /> : null}
        {activeTab === 'config' ? <ToolConfiguration manifest={manifest} nodeConnected={nodeConnected} /> : null}
      </div>
    </div>
  );
}

function RuntimeLogs({ toolName, logs }: { toolName: string; logs: ReturnType<typeof useToolRuntimeStore.getState>['logsByTool'][string] }) {
  return (
    <div className="min-h-[430px] bg-[#030509] p-4 font-mono text-[11px] leading-5">
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3"><div className="flex items-center gap-2 text-slate-400"><FileCode2 className="h-4 w-4 text-[#d4a843]" /> Runtime logs</div><span className="text-[9px] uppercase tracking-[0.12em] text-slate-700">{toolName}</span></div>
      {logs.length ? logs.map(log => <div key={log.id} className="grid grid-cols-[76px_48px_minmax(0,1fr)] gap-3 border-b border-white/[0.025] py-1.5"><span className="text-slate-700">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span><span className={log.level === 'error' ? 'text-rose-300' : log.level === 'warn' ? 'text-amber-300' : 'text-[#00d9b5]'}>{log.level}</span><span className="whitespace-pre-wrap text-slate-400">{log.message}</span></div>) : <div className="py-16 text-center text-slate-700">No runtime logs are available.</div>}
    </div>
  );
}

function ToolConfiguration({ manifest, nodeConnected }: { manifest: NonNullable<ReturnType<typeof getToolManifest>>; nodeConnected: boolean }) {
  return (
    <div className="grid min-h-[430px] gap-5 p-5 lg:grid-cols-2">
      <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#d4a843]">Runtime adapter</div><dl className="mt-4 grid grid-cols-[120px_minmax(0,1fr)] gap-x-3 gap-y-3 text-xs"><dt className="text-slate-600">Adapter</dt><dd className="text-slate-300">{manifest.adapter}</dd><dt className="text-slate-600">Workspace</dt><dd className="text-slate-300">{manifest.workspaceRoute}</dd><dt className="text-slate-600">Ports</dt><dd className="text-slate-300">{manifest.ports.join(', ') || 'Configured by execution node'}</dd><dt className="text-slate-600">Capabilities</dt><dd className="text-slate-300">{manifest.capabilities.join(', ')}</dd></dl></section>
      <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#00d9b5]">Node binding</div><div className="mt-4 flex items-center gap-2 text-sm text-slate-300"><span className={`h-2 w-2 rounded-full ${nodeConnected ? 'bg-[#00d9b5]' : 'bg-slate-700'}`} />{nodeConnected ? 'Connected to HATAALII execution node' : 'No execution node connected'}</div><p className="mt-3 text-xs leading-5 text-slate-600">Environment values and endpoint overrides are administered inside the OS. Repository navigation is not required to operate this tool.</p></section>
      <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 lg:col-span-2"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><Bot className="h-3.5 w-3.5" /> Council availability</div><p className="mt-3 text-sm leading-6 text-slate-400">HATAALII and ZENITH can route approved jobs, project context, files, and outputs through this adapter. Shell access remains restricted to version-controlled recipes.</p></section>
    </div>
  );
}
