# HATAALII Venture Command OS — Phase 2 Intelligence Runtime Design

**Date:** 2026-07-25  
**Canonical repository:** `jrmoyler/CollectiveOS`  
**Branch:** `feature/hataalii-phase2-embedded-tool-runtime`

## Purpose

Phase 2 turns the Phase 1 command-center prototype into a polished founder intelligence environment and makes the open-source catalog operate through HATAALII OS itself. The product must feel like a calm fusion of an intelligence operations console, premium Apple-grade product surface, Codex workspace, and Gotham-style mission portal without copying any single product.

## Product principles

1. **One operational picture:** projects, ventures, agents, tools, jobs, and infrastructure share one visual language and one command layer.
2. **Internal surfaces first:** tool actions open HATAALII workspaces, not public repository pages or raw localhost tabs.
3. **Execution node separation:** the web/native UI controls an authenticated local or cloud execution node that owns Docker, GPU services, CLIs, and desktop applications.
4. **Capability truthfulness:** browser, Electron, and Capacitor expose only actions their connected execution node can perform.
5. **Calm density:** information is dense but readable, with restrained accent color, strong alignment, consistent typography, and progressive disclosure.
6. **No fake availability:** tools report discovered, installable, installed, starting, running, stopped, failed, or unavailable from execution-node state.

## Visual system

### Shell anatomy

- **36px system bar:** product identity, workspace status, execution-node state, local time, and system command access.
- **72px operational rail:** icon-first navigation with compact labels and live state marks.
- **Context rail:** section-specific navigation, saved views, active missions, and recent work.
- **Analysis canvas:** table, timeline, graph, workspace, or embedded tool UI depending on the selected operation.
- **Intelligence drawer:** contextual details, agent findings, logs, activity, dependencies, and actions.
- **Command palette:** `Ctrl/Cmd + K` searches and launches projects, agents, tools, and OS actions.

### Style

- Background: near-black navy with subtle data-grid and radial depth.
- Primary surfaces: low-contrast graphite/navy, squared geometry with restrained 10–14px radii.
- Accent: Collective gold for command emphasis, teal for active system state, cyan for data links, amber for attention.
- Typography: Space Grotesk/Inter-compatible UI hierarchy with JetBrains Mono-compatible operational metadata.
- Motion: short opacity/translate transitions, scanning indicators, and restrained panel morphing; no ornamental floating-card motion.
- Data presentation: tables, rails, timelines, lists, maps, and canvases before generic card grids.

## Embedded Tool Runtime

### Execution node

A companion Node.js service runs locally or on a private cloud VM.

Default address: `http://127.0.0.1:4280`

Responsibilities:

- Discover Docker, Git, Python, Node, GPU, Ollama, Blender, and Godot.
- Install and start allow-listed tool recipes.
- Track processes and containers.
- Stream logs and health state.
- Proxy embedded web UIs through `/embed/:toolId/*`.
- Execute allow-listed CLI and agent-framework jobs.
- Launch native applications in Electron-connected environments.
- Never execute arbitrary shell text supplied by the browser.

### API

- `GET /health`
- `GET /v1/capabilities`
- `GET /v1/tools`
- `GET /v1/tools/:toolId`
- `POST /v1/tools/:toolId/install`
- `POST /v1/tools/:toolId/start`
- `POST /v1/tools/:toolId/stop`
- `GET /v1/tools/:toolId/logs`
- `POST /v1/jobs`
- `GET /v1/jobs/:jobId`
- `GET /embed/:toolId/*`

### Tool adapters

Every catalog entry receives one adapter:

- `embedded-web`: internally proxied UI in an OS workspace.
- `managed-service`: service lifecycle plus internal UI or API console.
- `native-app`: execution-node launch and project handoff.
- `cli`: terminal/job workspace through allow-listed commands.
- `agent-framework`: Council workflow/job adapter.
- `library`: callable API/library registered for agent use.

All tools remain visible in Tool Forge. Verified service metadata is included for priority tools; tools without a safe one-click recipe remain configurable inside OS and never fall back to external-link navigation.

## Priority verified integrations

Phase 2 includes working recipes and embedded workspace support for:

- MiroFish — frontend `3000`, backend `5001`, `npm run setup:all`, `npm run dev`, Docker Compose.
- ComfyUI — default HATAALII recipe on `8188`, `python main.py`, API/workflow surface.
- Ollama — API `11434`, `ollama serve`, `/api/chat` and model endpoints.
- Open WebUI — internal mapped port `3000`, container port `8080`, Docker and `open-webui serve` recipes.
- Label Studio — `8080`, `label-studio start`.
- Qdrant — `6333` HTTP and `6334` gRPC.
- Meilisearch — `7700`.
- Uptime Kuma — `3001`.
- Langflow — `7860`.
- Freqtrade — managed service/API workspace with dry-run configuration.

Additional tools are wired through the same adapters and configurable endpoints in the OS.

## Internal Tool Workspace

Selecting any tool opens a dedicated HATAALII OS workspace containing:

- Tool title and lifecycle state.
- Install/start/stop/restart controls.
- Internal embedded UI when available.
- API inspector for service and library tools.
- Job runner for CLI and agent-framework tools.
- Live logs.
- Environment/configuration form.
- Project attachments and recent outputs.
- Council routing controls.

Repository URLs remain metadata only and are not primary user actions.

## State and data flow

1. The React app loads static tool manifests.
2. `ExecutionNodeClient` polls execution-node health and tool status.
3. Selecting a tool creates an internal `ToolWorkspaceSession` in Zustand.
4. Lifecycle actions call the execution node.
5. Embedded tools render through the execution-node proxy.
6. Logs and job status update the workspace.
7. Unavailable nodes show an in-OS setup and connection surface.

## Security boundaries

- Commands are defined in version-controlled recipes.
- The browser sends tool IDs and approved action IDs, not shell strings.
- The execution node binds to loopback by default.
- Remote binding requires an explicit token.
- Proxy targets come from manifests or persisted administrator configuration.
- Environment values are masked in the UI.

## Responsive behavior

- Desktop: operational rail + context rail + analysis canvas + intelligence drawer.
- Tablet: operational rail + analysis canvas; contextual panels become drawers.
- Mobile: bottom mission navigation, command palette, full-screen workspaces, and stacked intelligence panels.
- Embedded desktop-grade tools display a mobile warning and a launch-on-desktop action when their UI is not usable on narrow screens.

## Phase 2 acceptance criteria

- No tool card uses a public repository link as its primary action.
- Every tool opens an internal HATAALII workspace.
- Execution-node state is visible globally.
- Priority services can be installed/started/stopped through allow-listed recipes.
- Embedded web UIs route through the internal proxy.
- CLI/framework tools can create tracked internal jobs.
- The command center uses the new intelligence shell on desktop and responsive equivalents on smaller screens.
- Existing Phase 1 features and 80-test baseline remain intact.
- Lint, tests, TypeScript, and Vite production build pass before the PR is considered ready.
