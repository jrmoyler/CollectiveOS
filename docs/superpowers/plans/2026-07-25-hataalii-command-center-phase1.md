# HATAALII Venture Command OS Phase One Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform CollectiveOS into a responsive Founder/Operator Command Center with equal web, Electron, and Capacitor experiences for JR Moyler's personal ventures and official Collective AI project portfolio.

**Architecture:** Preserve the existing React 19/Vite OS shell and add a responsive command-center layer behind the existing window manager. Shared typed registries drive project, agent, tool, and revenue interfaces; windowed apps reuse the same feature components so the web build and native shells remain functionally equal. Browser capability detection exposes native launch requirements without presenting nonfunctional browser controls.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, Framer Motion 12, Zustand 5, Vitest 4, Testing Library, Lucide React.

## Global Constraints

- Preserve the existing cyber-glass dark design language and existing Agent Hive, CRM, C-U-Later, Collect-A-Sign, and Browser applications.
- The web application is a first-class target with the same data, command surfaces, search, project portfolio, Agent Council, and Tool Forge as Electron and Capacitor.
- Native process launch controls must be capability-aware; browser sessions show installation commands and native-runtime requirements rather than pretending to launch local software.
- Keep `App.tsx` as composition glue and place feature ownership in focused modules.
- Maintain keyboard accessibility, responsive behavior, semantic buttons, visible focus states, and reduced-motion compatibility.
- Do not add external runtime dependencies during phase one.

---

### Task 1: Typed command-center registries

**Files:**
- Create: `src/features/command-center/types.ts`
- Create: `src/features/command-center/data.ts`
- Test: `src/features/command-center/data.test.ts`

**Interfaces:**
- Produces: `collectiveProjects`, `ventureStreams`, `agentCouncil`, `toolRegistry`, `commandMetrics`, `searchCommandCenter(query)`.

- [ ] Write tests that require project, tool, agent, and venture records and verify case-insensitive global search.
- [ ] Run `npm run test:run -- src/features/command-center/data.test.ts` and confirm failure because the module is absent.
- [ ] Implement strongly typed immutable registries and search.
- [ ] Re-run the focused test and confirm pass.
- [ ] Commit with `feat: add command center registries`.

### Task 2: Founder Command Center responsive surface

**Files:**
- Create: `src/features/command-center/CommandCenter.tsx`
- Create: `src/features/command-center/CommandCenter.test.tsx`
- Modify: `src/components/Desktop.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: registries and `searchCommandCenter(query)` from Task 1; `openApp(appId)` from Zustand.
- Produces: responsive overview with sidebar navigation, header search, status overview, mission-control project table, revenue streams, Agent Council preview, Tool Forge preview, quick-launch command bar, and detail slide-over.

- [ ] Write tests for visible Founder Cockpit landmarks, project search, section navigation, and opening Agent Council.
- [ ] Run the focused test and confirm failure.
- [ ] Implement the surface with mobile sidebar behavior and capability-aware tool actions.
- [ ] Replace the passive desktop watermark/mobile launcher with the command center while leaving the OS windows above it.
- [ ] Add only reusable command-center utility classes to `index.css`.
- [ ] Re-run tests and commit with `feat: add responsive founder command center`.

### Task 3: Windowed command applications

**Files:**
- Create: `src/features/command-center/CommandCenterApp.tsx`
- Modify: `src/types/index.ts`
- Modify: `src/store/useOSStore.ts`
- Modify: `src/components/apps/AppContent.tsx`
- Test: `src/features/command-center/CommandCenterApp.test.tsx`

**Interfaces:**
- Produces new `AppId` values: `founder-cockpit`, `mission-control`, `agent-council`, and `tool-forge`.
- `CommandCenterApp` accepts `mode: 'cockpit' | 'portfolio' | 'council' | 'tools'`.

- [ ] Write tests for each mode's unique heading and core controls.
- [ ] Run tests and confirm failure.
- [ ] Extend app definitions, titles, default window dimensions, and app-content routing.
- [ ] Implement reusable windowed feature views backed by the same registries as the web surface.
- [ ] Re-run tests and commit with `feat: add command center window apps`.

### Task 4: OS navigation, search, and quick launch

**Files:**
- Modify: `src/components/dock/Dock.tsx`
- Modify: `src/components/menubar/GlobalMenubar.tsx`
- Modify: `src/components/Desktop.tsx`
- Test: `src/components/navigation/commandNavigation.test.tsx`

**Interfaces:**
- Consumes new AppIds from Task 3.
- Produces dock launchers and a menubar-level Orchestrate action.

- [ ] Write tests that require new command applications in desktop and mobile navigation.
- [ ] Run tests and confirm failure.
- [ ] Add Founder Cockpit, Mission Control, Agent Council, and Tool Forge to desktop/mobile launch surfaces.
- [ ] Rename the shell identity to HATAALII OS while retaining CollectiveOS attribution.
- [ ] Ensure mobile dock remains horizontally accessible without compressing labels.
- [ ] Re-run tests and commit with `feat: expand HATAALII OS navigation`.

### Task 5: Web/native capability model

**Files:**
- Create: `src/features/command-center/capabilities.ts`
- Create: `src/features/command-center/capabilities.test.ts`
- Modify: `src/features/command-center/CommandCenter.tsx`
- Modify: `src/features/command-center/CommandCenterApp.tsx`

**Interfaces:**
- Produces: `detectRuntimeCapabilities()` and `getToolPrimaryAction(tool, capabilities)`.

- [ ] Write tests for web, Electron, and Capacitor capability states and tool action labels.
- [ ] Run tests and confirm failure.
- [ ] Implement browser-safe runtime detection with no direct access to undefined globals.
- [ ] Wire tool cards and detail panels to show `Open UI`, `View setup`, or `Launch native` according to capability.
- [ ] Re-run tests and commit with `feat: add runtime-aware tool actions`.

### Task 6: Continuous verification

**Files:**
- Create: `.github/workflows/phase-one-quality.yml`
- Modify: `README.md`

**Interfaces:**
- Produces CI checks for install, lint, tests, and production web build.

- [ ] Add a GitHub Actions workflow using Node 22 and `npm ci`.
- [ ] Document web, Electron, Capacitor, and capability-aware local-tool behavior.
- [ ] Run or inspect CI for `npm run lint`, `npm run test:run`, and `npm run build`.
- [ ] Correct all failures before opening a pull request.
- [ ] Commit with `ci: verify HATAALII command center`.

### Task 7: Final review and pull request

**Files:**
- Review all files changed in Tasks 1-6.

- [ ] Confirm no placeholder project cards, inert primary buttons, TypeScript errors, lint warnings, clipped mobile content, or accidental horizontal page overflow.
- [ ] Verify desktop at 1440x900 and mobile at 390x844.
- [ ] Verify global search, sidebar navigation, project detail, Agent Council route, Tool Forge filtering, window launches, and browser capability messaging.
- [ ] Open a pull request from `feature/hataalii-command-center-phase1` into `main` with implementation and verification notes.
