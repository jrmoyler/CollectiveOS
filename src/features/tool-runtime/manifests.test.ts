import { describe, expect, it } from 'vitest';
import { toolRegistry } from '../command-center/data';
import { getToolManifest, toolManifests } from './manifests';

describe('tool runtime manifests', () => {
  it('maps every Tool Forge item to an internal runtime adapter', () => {
    for (const tool of toolRegistry) {
      const manifest = getToolManifest(tool.id);
      expect(manifest, `missing manifest for ${tool.id}`).toBeDefined();
      expect(manifest?.adapter).toMatch(/embedded-web|managed-service|native-app|cli|agent-framework|library/);
    }
  });

  it('contains unique tool ids', () => {
    const ids = toolManifests.map(manifest => manifest.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses verified priority service ports', () => {
    expect(getToolManifest('mirofish')?.ports).toEqual([3000, 5001]);
    expect(getToolManifest('comfyui')?.ports).toContain(8188);
    expect(getToolManifest('ollama')?.ports).toContain(11434);
    expect(getToolManifest('open-webui')?.ports).toContain(3000);
    expect(getToolManifest('label-studio')?.ports).toContain(8080);
    expect(getToolManifest('qdrant')?.ports).toEqual([6333, 6334]);
    expect(getToolManifest('meilisearch')?.ports).toContain(7700);
  });

  it('never requires public repository navigation to open a tool', () => {
    for (const manifest of toolManifests) {
      expect(manifest.workspaceRoute).toBe(`/tools/${manifest.id}`);
      expect(manifest.primaryAction).not.toBe('external-link');
    }
  });
});
