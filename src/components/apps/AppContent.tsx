import type { AppId } from '../../types';
import { CommandCenterApp } from '../../features/command-center/CommandCenterApp';
import { AgentHive } from './agent-hive/AgentHive';
import { CollectiveCRM } from './crm/CollectiveCRM';
import { CULater } from './c-u-later/CULater';
import { CollectASign } from './collect-a-sign/CollectASign';
import { BrowserApp } from './browser/BrowserApp';

interface Props {
  appId: AppId;
}

export function AppContent({ appId }: Props) {
  switch (appId) {
    case 'founder-cockpit':
      return <CommandCenterApp mode="cockpit" />;
    case 'mission-control':
      return <CommandCenterApp mode="portfolio" />;
    case 'agent-council':
      return <CommandCenterApp mode="council" />;
    case 'tool-forge':
      return <CommandCenterApp mode="tools" />;
    case 'agent-hive':
      return <AgentHive />;
    case 'crm':
      return <CollectiveCRM />;
    case 'c-u-later':
      return <CULater />;
    case 'collect-a-sign':
      return <CollectASign />;
    case 'browser':
      return <BrowserApp />;
    default:
      return <div className="flex h-full items-center justify-center text-slate-500">Unknown App</div>;
  }
}
