import { describe, expect, it } from 'vitest';
import {
  agentCouncil,
  collectiveProjects,
  searchCommandCenter,
  toolRegistry,
  ventureStreams,
} from './data';

describe('command center registries', () => {
  it('includes JR Moyler official Collective AI projects and personal funding ventures', () => {
    expect(collectiveProjects.some(project => project.name === 'Kre8trix Platform')).toBe(true);
    expect(collectiveProjects.some(project => project.name === 'Exclusive Essence')).toBe(true);
    expect(collectiveProjects.some(project => project.name === 'Legacy App Build')).toBe(true);
    expect(ventureStreams.some(stream => stream.name === 'Roaming Lemon')).toBe(true);
    expect(ventureStreams.some(stream => stream.name === 'AI-Augmented OBM')).toBe(true);
  });

  it('registers the highest priority agent and open-source tool layers', () => {
    expect(agentCouncil.some(agent => agent.name === 'HATAALII')).toBe(true);
    expect(agentCouncil.some(agent => agent.name === 'Knowledge Keeper')).toBe(true);
    expect(toolRegistry.some(tool => tool.name === 'MiroFish')).toBe(true);
    expect(toolRegistry.some(tool => tool.name === 'ComfyUI')).toBe(true);
    expect(toolRegistry.some(tool => tool.name === 'Ollama')).toBe(true);
  });

  it('searches projects, tools, agents, and ventures case-insensitively', () => {
    expect(searchCommandCenter('exclusive essence').map(result => result.title)).toContain('Exclusive Essence');
    expect(searchCommandCenter('MIROFISH').map(result => result.title)).toContain('MiroFish');
    expect(searchCommandCenter('roaming').map(result => result.title)).toContain('Roaming Lemon');
    expect(searchCommandCenter('knowledge').map(result => result.title)).toContain('Knowledge Keeper');
  });

  it('returns an empty result set for whitespace-only searches', () => {
    expect(searchCommandCenter('   ')).toEqual([]);
  });
});
