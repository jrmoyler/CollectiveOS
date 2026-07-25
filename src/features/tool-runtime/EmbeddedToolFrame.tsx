import { Activity, MonitorUp, PlugZap } from 'lucide-react';
import { executionNodeClient } from './executionNodeClient';
import type { ToolManifest, ToolRuntimeStatus } from './types';

interface EmbeddedToolFrameProps {
  manifest: ToolManifest;
  status?: ToolRuntimeStatus;
  nodeConnected: boolean;
}

export function EmbeddedToolFrame({ manifest, status, nodeConnected }: EmbeddedToolFrameProps) {
  const canEmbed = manifest.capabilities.includes('embed') && manifest.uiPort;
  const running = status?.state === 'running';

  if (!nodeConnected) {
    return (
      <EmptyFrame
        icon={PlugZap}
        title="Connect an execution node"
        description="HATAALII needs its local or private execution node to run services, proxy interfaces, and launch native tools inside the OS."
      />
    );
  }

  if (!canEmbed) {
    return (
      <EmptyFrame
        icon={MonitorUp}
        title={`${manifest.name} operational console`}
        description={manifest.adapter === 'native-app'
          ? 'This native application is controlled through the execution node. Launch it from the lifecycle controls, then use this workspace for files, jobs, and logs.'
          : 'This tool runs through the internal API or tracked-job console rather than an iframe interface.'}
      />
    );
  }

  if (!running) {
    return (
      <EmptyFrame
        icon={Activity}
        title={`${manifest.name} is ${status?.state ?? 'not running'}`}
        description="Install or start the service from the workspace command bar. Its interface will appear here through the HATAALII internal proxy."
      />
    );
  }

  return (
    <div className="relative h-full min-h-[430px] overflow-hidden bg-[#020409]">
      <div className="absolute inset-x-0 top-0 z-10 flex h-7 items-center justify-between border-b border-white/[0.06] bg-[#070b11]/92 px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600 backdrop-blur">
        <span>Internal proxy · {manifest.name}</span>
        <span className="text-[#00d9b5]">encrypted workspace</span>
      </div>
      <iframe
        title={`${manifest.name} internal workspace`}
        src={executionNodeClient.embedUrl(manifest.id, manifest.uiPath)}
        className="h-full min-h-[430px] w-full border-0 pt-7"
        sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals allow-popups allow-popups-to-escape-sandbox allow-presentation"
        allow="clipboard-read; clipboard-write; microphone; camera; fullscreen"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

function EmptyFrame({ icon: Icon, title, description }: { icon: typeof Activity; title: string; description: string }) {
  return (
    <div className="flex min-h-[430px] h-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(0,217,181,0.035),transparent_42%)] p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-[#86a7b9]"><Icon className="h-5 w-5" /></div>
        <h3 className="mt-5 text-base font-semibold text-slate-100">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}
