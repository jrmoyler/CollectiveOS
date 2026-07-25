# HATAALII Venture Command OS

HATAALII Venture Command OS is JR Moyler's personal founder/operator environment for coordinating income engines, official Collective AI Inc projects, client delivery, agent orchestration, and open-source production infrastructure from one interface.

The same React application is delivered as:

- **Web application** — the complete intelligence workspace, project portfolio, Agent Council, embedded Tool Forge, CRM, and existing CollectiveOS applications.
- **Electron desktop application** — the same product plus local process, service, file, and native-application controls through the execution node.
- **Capacitor mobile application** — the same command data and internal workspaces with mobile-safe navigation and capability handling.

## Phase 2 intelligence workspace

Phase 2 replaces the card-heavy dashboard with a calm operational interface:

- Persistent operational navigation rail
- Context rail for saved views, missions, search, and current operations
- Central analysis canvas for tables, timelines, Council runs, and tool workspaces
- Contextual intelligence drawer
- Global `Ctrl/Cmd + K` command palette
- Execution-node status in the global command bar
- Gold command emphasis, teal live-state indicators, mono operational metadata, and restrained graphite/navy surfaces

## Core applications

| Application | Purpose |
|---|---|
| **Founder Cockpit** | Daily command queue, revenue posture, active projects, and production stack |
| **Collective AI Mission Control** | JR Moyler's official Collective AI and client project portfolio |
| **Revenue Command** | Personal funding engines and Collective AI allocation visibility |
| **Agent Council** | Scenario, debate, build-swarm, and research-swarm orchestration |
| **Tool Forge** | Embedded open-source services, native tools, APIs, libraries, and tracked jobs |
| **Agent Hive** | Existing CollectiveOS agent conversations |
| **Collective CRM** | Existing lead and opportunity management |
| **C-U-Later** | Existing video communication surface |
| **Collect-A-Sign** | Existing document signature surface |
| **Browser** | Existing integrated browser surface |

## Embedded open-source tools

Every catalogued tool opens inside HATAALII OS. The primary workflow no longer sends the operator to a GitHub repository or raw localhost page.

Each tool receives one internal adapter:

- **Embedded web** — proxied inside an OS workspace
- **Managed service** — installation, lifecycle, API, logs, and embedded interface
- **Native application** — execution-node launch with internal files, jobs, and logs
- **CLI** — structured allow-listed jobs
- **Agent framework** — Council and orchestration jobs
- **Library** — callable internal API/job surface

Priority lifecycle recipes and embedded support are included for MiroFish, ComfyUI, Ollama, Open WebUI, Label Studio, Qdrant, Meilisearch, Uptime Kuma, Langflow, Freqtrade, Blender, and Godot. The rest of the catalog remains internally wired through configurable adapters rather than external links.

## Execution node

Browsers cannot directly start Docker containers, terminal processes, Blender, Godot, GPU services, or local agent frameworks. HATAALII therefore includes a companion execution node that runs locally or on a protected private server.

Default node address:

```text
http://127.0.0.1:4280
```

The execution node:

- Detects Docker, Git, Node, Python, GPU support, Blender, Godot, and Ollama
- Installs and starts allow-listed tool recipes
- Tracks processes and containers
- Streams bounded logs
- Creates structured tracked jobs
- Proxies approved tool interfaces into HATAALII workspaces
- Supports WebSocket upgrades
- Rejects unknown tools and browser-submitted shell commands

Detailed runtime documentation is in [`execution-node/README.md`](execution-node/README.md).

## Run the complete local system

```bash
npm install
npm run dev:full
```

This starts:

- HATAALII web application at `http://localhost:5173`
- Execution node at `http://127.0.0.1:4280`

## Run only the web application

```bash
npm install
npm run dev
```

The web UI remains complete when the execution node is offline. Tool workspaces explain the missing capability and activate their runtime controls when a node connects.

## Run only the execution node

```bash
npm run execution-node
```

## Environment variables

```bash
# Optional Supabase configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Execution-node connection
VITE_EXECUTION_NODE_URL=http://127.0.0.1:4280
VITE_EXECUTION_NODE_TOKEN=replace-with-a-long-random-secret

# Execution-node server
HATAALII_EXECUTION_HOST=127.0.0.1
HATAALII_EXECUTION_PORT=4280
HATAALII_EXECUTION_TOKEN=replace-with-a-long-random-secret
HATAALII_NODE_ID=jr-primary-node
```

When `HATAALII_EXECUTION_TOKEN` is unset and the node remains bound to loopback, local unauthenticated operation is allowed. Remote binding should always use a token and a private network or authenticated reverse proxy.

## Quality checks

```bash
npm run lint
npm run test:execution-node
npm run test:run
npm run build
```

`npm run build` executes the complete quality gate before compiling TypeScript and producing the Vite web bundle.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion
- Zustand
- Supabase-ready data layer
- Node.js execution node using built-in HTTP, process, filesystem, and socket modules
- Vitest + Testing Library
- Node native test runner
- Capacitor for iOS and Android
- Electron for desktop

## Native builds

### iOS and Android

```bash
npx cap add ios
npx cap add android
npm run build
npx cap sync
```

### Desktop

See `electron.config.ts` and the Electron entry files for desktop packaging. The desktop shell uses the same execution-node contract as the web application and can expose native launch/file behavior.

## Web deployment

```bash
npx vercel --prod
```

The hosted web build provides the complete intelligence interface. Local or private infrastructure connects through `VITE_EXECUTION_NODE_URL`; the hosted Vercel runtime itself does not run Blender, Docker, or GPU tools.
