import { Cpu, LoaderCircle, Radio, ServerOff } from 'lucide-react';
import { useToolRuntimeStore } from '../tool-runtime/useToolRuntimeStore';

export function ExecutionNodeIndicator() {
  const connected = useToolRuntimeStore(state => state.nodeConnected);
  const checking = useToolRuntimeStore(state => state.nodeChecking);
  const health = useToolRuntimeStore(state => state.health);
  const error = useToolRuntimeStore(state => state.nodeError);
  const connect = useToolRuntimeStore(state => state.connect);

  return (
    <button
      type="button"
      onClick={() => void connect()}
      className={`group flex h-8 items-center gap-2 rounded-lg border px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition ${connected ? 'border-[#00d9b5]/22 bg-[#00d9b5]/[0.07] text-[#63efd8]' : 'border-white/[0.08] bg-white/[0.025] text-slate-500 hover:border-[#d4a843]/25 hover:text-[#d4a843]'}`}
      title={error ?? (health ? `${health.nodeId} · ${health.platform}` : 'Connect the HATAALII execution node')}
    >
      {checking ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : connected ? <Radio className="h-3.5 w-3.5" /> : <ServerOff className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">Execution node</span>
      <span className={connected ? 'text-[#00d9b5]' : 'text-slate-600'}>{connected ? 'online' : checking ? 'checking' : 'offline'}</span>
      {connected ? <Cpu className="hidden h-3 w-3 text-[#00d9b5]/70 lg:block" /> : null}
    </button>
  );
}
