# HATAALII Execution Node

The execution node is the local or private-cloud runtime that lets HATAALII Venture Command OS operate open-source services, CLI tools, agent frameworks, and native applications from inside the OS.

The browser never sends arbitrary shell commands. It sends a tool ID and an approved lifecycle action or job action. The execution node resolves those requests against the version-controlled allow list in `tool-recipes.mjs`.

## Start the complete local system

```bash
npm install
npm run dev:full
```

This starts:

- HATAALII web application at `http://localhost:5173`
- Execution node at `http://127.0.0.1:4280`

The web application automatically checks the execution node and updates the global node indicator.

## Start only the execution node

```bash
npm run execution-node
```

## Default security model

By default the server binds to loopback only:

```text
127.0.0.1:4280
```

This is appropriate when the OS and the execution node run on the same computer.

To require bearer authentication, set a token before launch:

```bash
export HATAALII_EXECUTION_TOKEN='replace-with-a-long-random-secret'
npm run execution-node
```

Configure the web application with the same values:

```bash
VITE_EXECUTION_NODE_URL=http://127.0.0.1:4280
VITE_EXECUTION_NODE_TOKEN=replace-with-a-long-random-secret
```

## Private remote node

A remote node should be placed behind a private network, VPN, zero-trust tunnel, or authenticated reverse proxy. Do not expose an unauthenticated execution node to the public internet.

Example environment:

```bash
export HATAALII_EXECUTION_HOST=0.0.0.0
export HATAALII_EXECUTION_PORT=4280
export HATAALII_EXECUTION_TOKEN='replace-with-a-long-random-secret'
npm run execution-node
```

Then set the web application to the protected HTTPS endpoint:

```bash
VITE_EXECUTION_NODE_URL=https://your-private-node.example.com
VITE_EXECUTION_NODE_TOKEN=replace-with-a-long-random-secret
```

## API

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/health` | Node identity, version, platform, and uptime |
| `GET` | `/v1/capabilities` | Docker, Git, Node, Python, GPU, Blender, Godot, and Ollama detection |
| `GET` | `/v1/tools` | Runtime state for all registered tools |
| `GET` | `/v1/tools/:toolId` | One tool's lifecycle state |
| `POST` | `/v1/tools/:toolId/install` | Execute its allow-listed installation recipe |
| `POST` | `/v1/tools/:toolId/start` | Start its allow-listed service, framework, CLI, or native application |
| `POST` | `/v1/tools/:toolId/stop` | Stop its managed process or container |
| `GET` | `/v1/tools/:toolId/logs` | Read bounded runtime logs |
| `POST` | `/v1/jobs` | Create a structured tracked job |
| `GET` | `/v1/jobs/:jobId` | Read tracked job state |
| `GET` | `/embed/:toolId/*` | Reverse-proxy an approved internal web UI |

The proxy also supports WebSocket upgrades for interactive tool interfaces.

## Tool recipes

`tool-recipes.mjs` is the execution allow list. Each record may define:

- Installation commands
- Start commands
- Stop commands
- UI and API ports
- Health endpoint
- Native executable
- Adapter type

Priority integrated services include MiroFish, ComfyUI, Ollama, Open WebUI, Label Studio, Qdrant, Meilisearch, Uptime Kuma, Langflow, Freqtrade, Blender, and Godot.

Tools without a verified automatic recipe still open inside HATAALII OS. Their workspace provides internal configuration, job, file, and runtime surfaces without redirecting to an external repository.

## Runtime data

Managed working directories are created beneath:

```text
.hataalii-runtime/
```

Do not commit that directory. Service-specific persistent Docker volumes remain managed by Docker.

## Tests

```bash
npm run test:execution-node
```

The tests verify:

- Unknown tools are rejected
- Browser-supplied shell text is not executed
- Lifecycle operations use allow-listed recipes
- Logs remain bounded
- Jobs remove shell-oriented input fields
