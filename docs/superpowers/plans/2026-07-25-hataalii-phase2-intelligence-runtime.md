# HATAALII Phase 2 Intelligence Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Phase 1 dashboard with a polished intelligence workspace and make every open-source tool open inside HATAALII OS through an authenticated execution-node runtime.

**Architecture:** The React application gains an intelligence shell, internal tool workspaces, a command palette, and an execution-node client. A companion Node.js service manages allow-listed recipes, processes, containers, logs, jobs, native applications, and internal reverse-proxy routes. Static manifests connect every catalogued tool to an adapter while priority tools receive verified lifecycle recipes.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, Framer Motion 12, Zustand 5, Vitest 4, Node.js 22, Express, CORS, http-proxy-middleware.

## Global Constraints

- Preserve all Phase 1 and legacy CollectiveOS applications.
- Do not use public repository links as primary tool actions.
- Browser clients never submit arbitrary shell commands.
- The execution node binds to `127.0.0.1:4280` by default.
- Remote execution-node connections require an explicit bearer token.
- Every tool opens an internal HATAALII workspace even when the execution node is unavailable.
- Priority verified recipes use current repository-documented ports and commands.
- The build command must continue to run lint, the full test suite, TypeScript, and Vite.

---

### Task 1: Runtime manifest model

**Files:**
- Create: `src/features/tool-runtime/types.ts`
- Create: `src/features/tool-runtime/manifests.ts`
- Test: `src/features/tool-runtime/manifests.test.ts`
- Modify: `src/features/command-center/types.ts`
- Modify: `src/features/command-center/data.ts`

**Interfaces:**
- Produces `ToolManifest`, `ToolAdapter`, `ToolLifecycleState`, `toolManifests`, and `getToolManifest(toolId)`.
- Every Phase 1 tool ID must resolve to a manifest.

- [ ] Write a failing test that iterates `toolRegistry` and requires a matching manifest for every tool.
- [ ] Write failing assertions for MiroFish ports `3000/5001`, ComfyUI port `8188`, Ollama port `11434`, Open WebUI internal port `3000`, Label Studio port `8080`, Qdrant ports `6333/6334`, and Meilisearch port `7700`.
- [ ] Run `npm run test:run -- src/features/tool-runtime/manifests.test.ts` and confirm failure because the module is absent.
- [ ] Implement typed manifests and update tool definitions to reference adapters rather than external-link actions.
- [ ] Re-run the focused test and commit `feat: add embedded tool manifests`.

### Task 2: Execution-node client and Zustand sessions

**Files:**
- Create: `src/features/tool-runtime/executionNodeClient.ts`
- Create: `src/features/tool-runtime/executionNodeClient.test.ts`
- Create: `src/features/tool-runtime/useToolRuntimeStore.ts`
- Create: `src/features/tool-runtime/useToolRuntimeStore.test.ts`

**Interfaces:**
- `ExecutionNodeClient` exposes `health`, `capabilities`, `listTools`, `installTool`, `startTool`, `stopTool`, `getLogs`, and `createJob`.
- `useToolRuntimeStore` owns node connection, tool states, active workspace, logs, and jobs.

- [ ] Write failing fetch-contract tests for `/health`, `/v1/tools`, and lifecycle endpoints.
- [ ] Write failing store tests for opening a tool workspace and applying node status updates.
- [ ] Implement the browser client with bearer-token support and bounded request timeouts.
- [ ] Implement the Zustand store with immutable updates and no interval duplication.
- [ ] Run focused tests and commit `feat: add execution node client`.

### Task 3: Companion execution node

**Files:**
- Create: `execution-node/server.mjs`
- Create: `execution-node/runtime-manager.mjs`
- Create: `execution-node/tool-recipes.mjs`
- Create: `execution-node/runtime-manager.test.mjs`
- Create: `execution-node/README.md`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- HTTP API defined by the Phase 2 design.
- `RuntimeManager` exposes `list`, `install`, `start`, `stop`, `logs`, and `createJob` using allow-listed recipes.

- [ ] Add Node test cases proving unknown tools and arbitrary commands are rejected.
- [ ] Add tests proving lifecycle state transitions and log retention.
- [ ] Add Express, CORS, and proxy dependencies.
- [ ] Implement loopback binding, optional bearer authentication, process management, Docker/native/CLI adapters, and proxy routing.
- [ ] Add `npm run execution-node` and `npm run dev:full` scripts.
- [ ] Run Node tests and commit `feat: add HATAALII execution node`.

### Task 4: Intelligence shell redesign

**Files:**
- Create: `src/features/intelligence-shell/IntelligenceShell.tsx`
- Create: `src/features/intelligence-shell/IntelligenceShell.test.tsx`
- Create: `src/features/intelligence-shell/CommandPalette.tsx`
- Create: `src/features/intelligence-shell/ExecutionNodeIndicator.tsx`
- Modify: `src/features/command-center/CommandCenter.tsx`
- Modify: `src/index.css`

**Interfaces:**
- `IntelligenceShell` accepts operational navigation, context navigation, analysis content, and intelligence drawer content.
- Command palette launches sections, apps, projects, agents, and tools.

- [ ] Write failing tests for the operational rail, execution-node indicator, contextual drawer, and `Ctrl+K` command palette.
- [ ] Implement the new shell with restrained graphite/navy surfaces, gold command accents, teal active state, mono metadata, and responsive drawers.
- [ ] Refactor `CommandCenter` to use the shell without removing Phase 1 behavior.
- [ ] Run tests and commit `feat: redesign HATAALII intelligence shell`.

### Task 5: Internal tool workspace

**Files:**
- Create: `src/features/tool-runtime/ToolWorkspace.tsx`
- Create: `src/features/tool-runtime/ToolWorkspace.test.tsx`
- Create: `src/features/tool-runtime/EmbeddedToolFrame.tsx`
- Create: `src/features/tool-runtime/ToolConsole.tsx`
- Modify: `src/features/command-center/CommandCenterApp.tsx`
- Modify: `src/features/command-center/CommandCenter.tsx`

**Interfaces:**
- `ToolWorkspace` accepts `toolId` and renders lifecycle controls, internal embed, console/jobs, logs, configuration, and Council routing.
- All Tool Forge selections open `ToolWorkspace`; no selection navigates to GitHub.

- [ ] Write failing tests for internal workspace opening, install/start/stop controls, logs, and unavailable-node state.
- [ ] Implement embedded proxy URL generation and iframe sandbox policy.
- [ ] Implement CLI/framework console and job history.
- [ ] Replace external-link tool actions with internal workspace sessions.
- [ ] Run tests and commit `feat: embed tools inside HATAALII OS`.

### Task 6: Agent Council runtime routing

**Files:**
- Create: `src/features/agent-council/CouncilComposer.tsx`
- Create: `src/features/agent-council/CouncilComposer.test.tsx`
- Modify: `src/features/command-center/CommandCenterApp.tsx`
- Modify: `src/features/tool-runtime/manifests.ts`

**Interfaces:**
- Council composer selects a mode, participating agents/frameworks, project context, and task.
- Submission creates an execution-node job and displays tracked status.

- [ ] Write failing tests for scenario, debate, build-swarm, and research-swarm modes.
- [ ] Implement framework routing metadata for MiroFish, CrewAI, LangGraph, AutoGen, CAMEL, and MetaGPT.
- [ ] Implement job submission and tracked result state.
- [ ] Run tests and commit `feat: connect Agent Council runtime`.

### Task 7: Full verification and PR

**Files:**
- Modify: `README.md`
- Modify: `.github/workflows/phase-one-quality.yml`
- Review all Phase 2 files.

- [ ] Document execution-node setup, local full-stack launch, remote token configuration, and embedded workspace behavior.
- [ ] Extend CI to run Node execution-node tests before the existing lint/test/build gate.
- [ ] Verify every catalog tool resolves to an internal adapter.
- [ ] Verify desktop at 1440x900, tablet at 1024x768, and mobile at 390x844.
- [ ] Verify command palette, tool install/start/stop, embedded frame fallback, logs, Council job creation, and existing OS windows.
- [ ] Open a pull request to `main` only after all checks pass.
