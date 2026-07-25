import { useEffect, useMemo, useState } from 'react';
import {
  Bot,
  CircleDollarSign,
  FolderKanban,
  LayoutDashboard,
  Wrench,
} from 'lucide-react';
import type { AppId } from '../../types';
import { IntelligenceShell, type IntelligenceNavigationItem } from '../intelligence-shell/IntelligenceShell';
import type { CommandPaletteItem } from '../intelligence-shell/CommandPalette';
import { ToolWorkspace } from '../tool-runtime/ToolWorkspace';
import { useToolRuntimeStore } from '../tool-runtime/useToolRuntimeStore';
import {
  CockpitView,
  ContextPanel,
  CouncilView,
  IntelligencePanel,
  PortfolioView,
  RevenueView,
  ToolForgeView,
} from './CommandViews';
import { agentCouncil, collectiveProjects, toolRegistry, ventureStreams } from './data';
import type { CommandSection, ProjectDefinition, SearchResult } from './types';

interface CommandCenterProps {
  onOpenApp?: (appId: AppId) => void;
}

const NAVIGATION: IntelligenceNavigationItem[] = [
  { id: 'cockpit', label: 'Founder Cockpit', icon: LayoutDashboard },
  { id: 'portfolio', label: 'Collective Portfolio', icon: FolderKanban, count: collectiveProjects.length },
  { id: 'revenue', label: 'Revenue Command', icon: CircleDollarSign, count: ventureStreams.length },
  { id: 'council', label: 'Agent Council', icon: Bot, count: agentCouncil.length },
  { id: 'tools', label: 'Tool Forge', icon: Wrench, count: toolRegistry.length },
];

export function CommandCenter({ onOpenApp }: CommandCenterProps) {
  const [section, setSection] = useState<CommandSection>('cockpit');
  const [query, setQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectDefinition | null>(null);
  const activeToolId = useToolRuntimeStore(state => state.activeToolId);
  const workspaceOpen = useToolRuntimeStore(state => state.workspaceOpen);
  const openWorkspace = useToolRuntimeStore(state => state.openWorkspace);
  const closeWorkspace = useToolRuntimeStore(state => state.closeWorkspace);
  const connect = useToolRuntimeStore(state => state.connect);

  useEffect(() => {
    void connect();
  }, [connect]);

  const navigate = (next: string) => {
    const commandSection = next as CommandSection;
    setSection(commandSection);
    if (commandSection !== 'tools') closeWorkspace();
  };

  const selectProject = (project: ProjectDefinition) => {
    setSelectedProject(project);
    setSection('portfolio');
  };

  const selectTool = (toolId: string) => {
    setSection('tools');
    openWorkspace(toolId);
  };

  const selectSearchResult = (result: SearchResult) => {
    setQuery('');
    setSection(result.section);
    if (result.type === 'project') {
      const project = collectiveProjects.find(item => item.id === result.id);
      if (project) setSelectedProject(project);
    }
    if (result.type === 'tool') selectTool(result.id);
  };

  const commandItems = useMemo<CommandPaletteItem[]>(() => [
    ...NAVIGATION.map(item => ({
      id: `section-${item.id}`,
      label: item.label,
      description: `Open ${item.label} in the analysis canvas`,
      group: 'Navigate',
      onSelect: () => navigate(item.id),
    })),
    ...collectiveProjects.map(project => ({
      id: `project-${project.id}`,
      label: project.name,
      description: project.nextMilestone,
      group: 'Mission',
      keywords: [project.division, ...project.tags],
      onSelect: () => selectProject(project),
    })),
    ...agentCouncil.map(agent => ({
      id: `agent-${agent.id}`,
      label: agent.name,
      description: `${agent.role} · ${agent.framework}`,
      group: 'Agent',
      keywords: agent.specialties,
      onSelect: () => setSection('council'),
    })),
    ...toolRegistry.map(tool => ({
      id: `tool-${tool.id}`,
      label: tool.name,
      description: `${tool.category} · Open internal workspace`,
      group: 'Tool',
      keywords: tool.tags,
      onSelect: () => selectTool(tool.id),
    })),
  ], []);

  const analysis = section === 'cockpit'
    ? <CockpitView onNavigate={navigate as (section: CommandSection) => void} onOpenApp={onOpenApp ?? (() => undefined)} onProject={selectProject} onTool={selectTool} />
    : section === 'portfolio'
      ? <PortfolioView onProject={selectProject} />
      : section === 'revenue'
        ? <RevenueView />
        : section === 'council'
          ? <CouncilView />
          : workspaceOpen && activeToolId
            ? (
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#060a10]/88 px-3">
                  <button type="button" onClick={closeWorkspace} className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#d4a843] hover:text-[#e6c66d]">← Tool Forge</button>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-700">Internal operating workspace</span>
                </div>
                <div className="min-h-0 flex-1"><ToolWorkspace toolId={activeToolId} /></div>
              </div>
            )
            : <ToolForgeView onTool={selectTool} />;

  return (
    <IntelligenceShell
      activeSection={section}
      navigation={NAVIGATION}
      onNavigate={navigate}
      context={(
        <ContextPanel
          section={section}
          query={query}
          onQuery={setQuery}
          onResult={selectSearchResult}
          onNavigate={next => navigate(next)}
        />
      )}
      analysis={analysis}
      intelligence={<IntelligencePanel section={section} selectedProject={selectedProject} activeToolId={activeToolId} />}
      commandItems={commandItems}
      statusText={workspaceOpen && activeToolId ? `Tool workspace · ${activeToolId}` : `Active mission · ${section}`}
    />
  );
}
