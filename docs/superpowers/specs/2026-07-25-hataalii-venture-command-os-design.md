# HATAALII Venture Command OS — Design Specification

**Date:** 2026-07-25  
**Canonical repository:** `jrmoyler/CollectiveOS`  
**Product identity:** HATAALII Venture Command OS — Founder/Operator Edition  
**Core systems:** HATAALII, Zenith OS, ZenFlow, Knowledge Keeper, Aegis Protocol

## 1. Purpose

HATAALII Venture Command OS is John-Ross Moyler's personal founder and operator environment for coordinating income-generating ventures, client delivery, official Collective AI Inc responsibilities, open-source AI tooling, software production, creative production, classes, Roaming Lemon, LegalShield, Primerica, and market research from one operating system.

The system's primary objective is execution: increase dependable cash flow, accelerate Collective AI Inc projects, reduce context switching, centralize tools and information, and turn repeatable work into reusable systems, agents, and products.

This is not a generic team SaaS dashboard. It is a personal command operating system built around one founder, one canonical memory, one portfolio, and one agent council.

## 2. Existing Product Foundation

The implementation extends the existing CollectiveOS architecture and design language rather than replacing it.

Current foundation:

- React 19, TypeScript, Vite
- Tailwind CSS v4
- Framer Motion
- Zustand
- Supabase
- Electron desktop runtime
- Capacitor mobile runtime
- Global menubar
- Desktop shell
- Window manager
- Dock
- Existing Agent Hive, CRM, C-U-Later, Collect-A-Sign, and browser applications

The existing cyber-glass dark interface remains the visual foundation. Collective AI's parent design system is layered into it:

- Background: `#050A18` / `#0A0F1E`
- Surface: `#0D1326` / `#111827`
- Primary gold: `#D4A843`
- Secondary teal: `#00D9B5`
- Text: `#F5F5F5`
- Secondary text: `#8B9BAE`
- Borders: `#1A2540`
- Typography: Space Grotesk, Inter, JetBrains Mono

Emerald and ruby accents already present in CollectiveOS may remain for status, alerts, and tool-specific identity, but gold and teal establish the parent system identity.

## 3. Product Principles

1. **One command surface:** The user primarily interacts with HATAALII.
2. **One canonical portfolio:** Personal ventures and official Collective AI projects use the same project model.
3. **Tools are operational, not decorative:** Every integrated tool must have a verified launch, health, configuration, or deep-link behavior.
4. **Project-aware tools:** Tools understand which project, client, asset, or workflow they are serving.
5. **Local-first where valuable:** Local models, media tools, Docker services, and desktop applications are first-class citizens.
6. **Cloud-connected where practical:** Gmail, Calendar, Drive, GitHub, Vercel, Supabase, Stripe, and external APIs integrate through adapters.
7. **Human-directed autonomy:** Agents can research, plan, draft, classify, summarize, test, and prepare actions; irreversible external actions remain explicitly invoked.
8. **Reusable systems over one-off work:** Client delivery should generate templates, modules, agents, workflows, and IP that strengthen Collective AI Inc.
9. **No invented integration details:** Ports, commands, environment variables, API endpoints, and launch instructions must be verified against current official repositories or documentation.

## 4. Information Architecture

### 4.1 Global shell

The existing menubar, desktop, window manager, and dock remain.

The global shell adds:

- Global command/search field
- `Orchestrate with Council` action
- Active project context selector
- System status cluster
- Current focus indicator
- Notifications and approvals
- Quick launch command palette
- Local runtime connectivity indicator

### 4.2 Primary applications

1. Founder Cockpit
2. HATAALII
3. Agent Council
4. Collective AI Mission Control
5. Project Command
6. Revenue Command
7. CRM
8. Client Delivery
9. AI Service Studio
10. Academy
11. Roaming Lemon
12. LegalShield
13. Insurance Operations
14. Markets Lab
15. Build Center
16. Creative Studio
17. 3D and Game Studio
18. Voice Studio
19. Tool Forge
20. Knowledge Keeper
21. Calendar
22. Communications
23. Files and Assets
24. Infrastructure
25. Analytics
26. Settings

Desktop and mobile launchers become category-aware and searchable. The dock displays pinned applications, active applications, and runtime status.

## 5. Founder Cockpit

The Founder Cockpit answers:

1. What should JR do next?
2. What can generate or collect revenue today?
3. Which Collective AI project needs attention?
4. Which client or collaborator is blocked?
5. Which build, deployment, class, launch, or service is failing?

Primary panels:

- Today's Command Queue
- Active revenue opportunities
- Cash collected and receivables
- Collective AI funding contribution
- Official project health
- Client delivery health
- Class and cohort status
- Roaming Lemon launch status
- LegalShield Fast Start progress
- Primerica licensing and activity
- Build and deployment status
- Agent Council activity
- Tool runtime health
- Recent decisions and memory

Tasks are categorized as:

- Do now
- Approve
- Delegate
- Waiting
- Review
- Blocked

Every task includes project, business line, deadline, estimated effort, value, owner, assigned agent, source, dependencies, and linked records.

## 6. Canonical Portfolio

### 6.1 Official Collective AI and client projects

Initial registry includes:

- Kre8trix Platform
- Legacy app build
- Exclusive Essence website maintenance
- Exclusive Essence Content Engine
- Collective Merch Closet
- Child Care Compass
- Child-care website builds
- Impact Community Action website
- Kennel Dog App
- Legacy Hermes agent
- Future Champs series
- Curbball
- ZenFlow
- Zenith OS
- Aegis Protocol
- Knowledge Keeper
- Collective Atlas / 20-division scrollable world
- Collective Times
- Collective AI workbook and learning systems
- Collective AI division websites and applications
- Collective AI agent lattice
- Collective AI service-delivery infrastructure
- Collective AI campus and physical-node concepts
- Collective AI games and interactive experiences

### 6.2 Personal funding engines

- AI consulting
- AI-integrated websites
- AI applications
- Agent systems
- Business operating systems
- AI-augmented OBM
- Classes and cohorts
- LegalShield
- Primerica and life insurance
- Roaming Lemon
- Options and crypto research and trading journals

### 6.3 Project record

Each project stores:

- Name and type
- Client, division, or owner
- Description
- Current stage
- Health
- Priority
- Strategic value
- Revenue and cost
- Repository and branch
- Vercel or deployment target
- Live URL
- Drive folder
- Design files
- Knowledge graph
- Assigned humans and agents
- Milestones
- Tasks
- Risks and blockers
- Decisions
- Communications
- Assets
- Build and test status
- Recent deployments
- Hours invested
- Collective AI funding contribution

## 7. HATAALII and Agent Architecture

### 7.1 HATAALII

HATAALII is the conversational executive interface and chief-of-staff agent. It receives goals, resolves active project context, gathers memory, delegates work, and returns a unified result.

### 7.2 Zenith Orchestrator

Zenith selects:

- Agent or crew
- Workflow pattern
- Model provider
- Tool permissions
- Project context
- Memory scope
- Review sequence
- Output format

### 7.3 Knowledge Keeper

Knowledge Keeper maintains:

- Project memory
- People and organizations
- Decisions
- Meeting summaries
- Requirements
- Documents
- Contracts and proposals
- Reusable components
- Prompt and workflow history
- Lessons learned
- Source citations

### 7.4 Agent Council

Council modes:

- Command
- Council review
- Structured debate
- Scenario simulation
- Build swarm
- Research swarm
- Retrospective

Council members are selected by task. Core roles include:

- Portfolio Director
- Revenue Strategist
- Product Architect
- Engineering Director
- AI Solutions Architect
- Client Delivery Director
- OBM Director
- Academy Director
- Creative Director
- 3D and Game Director
- Roaming Lemon General Manager
- LegalShield Operations Agent
- Insurance Operations Agent
- Markets Research Agent
- Finance Agent
- Infrastructure Agent
- Knowledge Keeper

### 7.5 Framework router

Supported framework adapters:

- LangGraph
- CrewAI
- AutoGen
- CAMEL
- MetaGPT
- MiroFish
- MiroFish Offline
- ZenFlow native workflows

The router chooses one orchestration pattern per workflow unless a deliberate comparison is requested.

## 8. Open-Source Tool Forge

### 8.1 Tool manifest

Every tool is represented by a versioned manifest containing:

- Name
- Slug
- Category
- Description
- Repository URL
- License
- Runtime type
- Install methods
- Docker image or Compose file
- Start and stop commands
- Default ports
- UI URL
- API URL
- Health check
- Environment variables
- Required volumes
- CPU, RAM, GPU, and operating-system requirements
- Configuration examples
- Supported agent actions
- Associated projects
- Documentation references
- Last verified release, commit, and date

### 8.2 Runtime types

- Embedded web UI
- External web UI
- Local service
- Docker service
- Native desktop application
- CLI tool
- Hosted API
- Library/framework

### 8.3 Tool actions

Cards expose applicable actions:

- Install
- Launch
- Stop
- Restart
- Open UI
- Open project
- Configure
- View logs
- Health check
- Update
- Send to Agent Council
- Attach to project

### 8.4 Local execution daemon

A separately authenticated local daemon is required for operations browsers cannot perform.

Responsibilities:

- Detect installed software
- Detect Docker and containers
- Start and stop services
- Execute approved commands
- Launch desktop applications
- Open project files
- Monitor ports
- Stream logs
- Report CPU, RAM, disk, and GPU status
- Manage project-specific environment configuration
- Return normalized runtime status to CollectiveOS

The web application must degrade gracefully when the daemon is offline.

## 9. Initial Tool Registry

### Voice, audio, and transcription

- Voicebox
- OpenVoice
- F5-TTS
- Fish Speech
- Coqui TTS / XTTS
- WhisperLive
- OpenAI Whisper
- RealtimeSTT
- ebook2audiobook
- PDF Narrator

### 3D, Gaussian splatting, rigging, and animation

- TripoSR
- InstantMesh
- Gaussian Splatting
- SuperSplat
- UniRig
- Puppeteer
- Blender
- Godot

### Image and video

- ComfyUI
- ComfyStudio

### Productivity, design, and knowledge

- Plane
- WeKan
- Logseq
- Penpot
- AppFlowy

### Agent frameworks

- MiroFish
- MiroFish Offline
- CAMEL
- CrewAI
- AutoGen
- LangGraph
- MetaGPT

### Markets and data

- Freqtrade
- QuantConnect LEAN
- CCXT

### Infrastructure and ML

- Ollama
- Label Studio
- Coolify

### Additional recommended tools

- LiteLLM
- Open WebUI
- Dify
- Langflow or Flowise
- Langfuse
- Qdrant
- Twenty CRM
- Documenso
- Cal.com
- Chatwoot
- Formbricks
- Baserow or NocoDB
- Metabase
- Grafana
- Prometheus
- Uptime Kuma
- PostHog
- GlitchTip
- OpenHands
- Continue
- Aider
- Playwright
- Storybook
- Appsmith or Budibase
- Docling
- Unstructured
- Meilisearch
- MinIO

## 10. Service Studio

The AI Service Studio supports the following offers:

- AI Business Diagnostic
- AI Conversion Website
- AI Business Operating System
- AI Agent Workforce
- AI-Augmented OBM
- Custom AI Application
- Managed AI Operations

Each offer has reusable scope templates, discovery questions, architecture templates, pricing rules, proposal components, delivery checklists, maintenance plans, and project-agent teams.

## 11. Project-Aware Tooling

Tools must resolve active project context.

Examples:

- Exclusive Essence links Shopify, repository, deployment, Penpot, ComfyUI workflows, content assets, analytics, maintenance tickets, and communications.
- Kre8trix links source documents, architecture, partner records, repository, deployment, decision log, product roadmap, and agent council.
- Legacy app links requirements, screens, assets, repository, Hermes agent, testing, deployments, and client feedback.

Tool actions generate records against the active project and write meaningful results to Knowledge Keeper.

## 12. Data Architecture

Canonical entities:

- User
- Person
- Organization
- Business line
- Project
- Project membership
- Opportunity
- Offer
- Proposal
- Contract
- Invoice
- Payment
- Commission
- Task
- Milestone
- Event
- Communication
- Document
- Asset
- Repository
- Deployment
- Build
- Test run
- Tool
- Tool manifest
- Tool instance
- Runtime process
- Agent
- Agent run
- Council session
- Workflow
- Prompt
- Decision
- Memory
- Class
- Enrollment
- Product
- Inventory item
- Location
- Trade thesis
- Trade journal entry
- Metric
- Dashboard

All important records include timestamps, ownership, project scope, source, audit history, and related objects.

## 13. Integration Architecture

### Cloud adapters

- Supabase
- Gmail
- Google Calendar
- Google Drive
- Google Contacts
- GitHub
- Vercel
- Stripe
- Optional accounting and banking providers

### Model and agent infrastructure

- LiteLLM model gateway
- Ollama local inference
- OpenAI-compatible providers
- Langfuse observability
- Qdrant or pgvector memory
- Redis queues
- FastAPI orchestration service
- WebSocket event transport

### Tool manifest verification

A repository research pipeline collects and stores verified information. No unverified ports or commands are rendered as authoritative.

## 14. UX Requirements

### Tool cards

Each card includes:

- Name
- Description
- Category
- Status
- Version
- Runtime
- Active project usage
- Launch or open action
- Configuration action
- Council action

### Modals and slide-overs

Used for:

- Launch instructions
- Environment variables
- Runtime logs
- Tool configuration
- Project attachment
- API details
- Repository notes

### Search and command palette

Search spans:

- Applications
- Projects
- People
- Organizations
- Tasks
- Documents
- Assets
- Tools
- Agents
- Commands

### Accessibility and responsiveness

- Keyboard-first operation
- Focus-visible states
- Reduced-motion support
- WCAG-conscious contrast
- Mobile launcher and simplified mobile windows
- Desktop multi-window workflows

## 15. Security and Permissions

Security controls remain underlying infrastructure, not the product's dominant visual identity.

Required controls:

- Authenticated user sessions
- Encrypted secrets
- Local daemon pairing
- Per-integration tokens
- Project-scoped access
- Audit logs
- Explicit invocation for irreversible actions
- Sandboxed command templates
- No arbitrary shell execution from untrusted content
- Sanitized iframe and reverse-proxy behavior

## 16. Testing Strategy

### Unit tests

- Stores
- Manifest parsing
- Command construction
- Project context resolution
- Agent routing
- Search
- Status normalization

### Integration tests

- Supabase repositories
- GitHub adapter
- Vercel adapter
- Local daemon communication
- Tool health checks
- Council session persistence

### End-to-end tests

- Open application from dock
- Search and launch a tool
- Attach tool to project
- Create a council session
- Route a project task
- View logs and status
- Open project workspace
- Recover when local daemon is offline

### Visual tests

- Desktop
- Mobile
- Window states
- Tool cards
- Cockpit dashboards
- Council interface
- Dark theme and reduced motion

## 17. Delivery Phases

### Phase 1 — Shell and command MVP

- Rebrand CollectiveOS as HATAALII Venture Command OS
- Expand application registry
- Founder Cockpit
- Global search and command palette
- Canonical project registry
- Project Command
- HATAALII interface shell
- Knowledge Keeper foundation
- Tool manifest schema
- Static tool catalog

### Phase 2 — Agent Council and portfolio operations

- Council session UI
- Zenith router
- Agent registry
- Official Collective AI project templates
- Revenue Command
- Client Delivery
- Academy
- Roaming Lemon

### Phase 3 — Local Tool Forge

- Local daemon
- Docker and process supervision
- Verified manifests
- Tool launch, health, logs, and configuration
- Ollama, ComfyUI, Plane, Logseq, Label Studio, Blender, and Godot first

### Phase 4 — Service delivery and build automation

- AI Service Studio
- Proposal and delivery templates
- GitHub and Vercel build center
- Playwright QA
- Client portals
- Managed AI Operations

### Phase 5 — Specialized studios

- Voice Studio
- 3D and Game Studio
- Creative Studio
- Markets Lab
- LegalShield
- Insurance Operations

### Phase 6 — Expanded orchestration

- LangGraph, CrewAI, AutoGen, CAMEL, MetaGPT, and MiroFish adapters
- Scenario simulations
- Build swarms
- Research swarms
- Agent evaluations
- Model routing and cost observability

## 18. Out of Scope for Initial MVP

- Autonomous trade execution
- Unrestricted arbitrary shell execution
- Full replacement of every third-party tool's native UI
- Multi-tenant enterprise SaaS
- Public marketplace
- Complete mobile parity for desktop-native tools
- Simultaneous implementation of every listed open-source integration

## 19. Acceptance Criteria

The architecture is successfully established when:

1. CollectiveOS presents the HATAALII identity without losing existing windowing behavior.
2. JR can see all official Collective AI and personal venture projects from one portfolio.
3. HATAALII can resolve an active project and route a task to a Council session.
4. Tool Forge renders verified tool manifests and never invents launch details.
5. At least one local web service, one Docker service, and one native desktop application can be detected and opened through the local daemon.
6. Search can locate projects, tools, tasks, documents, and agents.
7. Existing Agent Hive, CRM, C-U-Later, Collect-A-Sign, and browser functionality remains available.
8. Desktop, mobile, and browser builds continue to compile and test.

## 20. Implementation Decision

`jrmoyler/CollectiveOS` is the canonical repository and source interface. All new work must preserve the current OS shell and incrementally introduce the HATAALII application architecture. The first implementation plan must focus on Phase 1 and avoid premature integration of every tool.