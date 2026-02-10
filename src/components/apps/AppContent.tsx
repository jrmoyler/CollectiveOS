import type { AppId } from '../../types';
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
      return <div className="flex items-center justify-center h-full text-slate-500">Unknown App</div>;
  }
}
