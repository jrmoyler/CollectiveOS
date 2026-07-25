# HATAALII Venture Command OS

HATAALII Venture Command OS is the founder/operator edition of CollectiveOS: one responsive command center for JR Moyler's personal income engines, official Collective AI Inc projects, client delivery, agent orchestration, and open-source production tools.

The same React application is delivered as:

- **Web application** — the complete Founder Cockpit, project portfolio, Agent Council, Tool Forge, CRM, and existing CollectiveOS applications.
- **Electron desktop application** — the web experience plus native-process and local-service capabilities as the execution bridge is implemented.
- **Capacitor mobile application** — the same command data and OS applications with mobile navigation and native-safe capability handling.

## Phase One Surfaces

| Application | Purpose |
|---|---|
| **Founder Cockpit** | Daily signals, Collective AI mission queue, revenue momentum, and quick launch |
| **Collective AI Mission Control** | JR Moyler's official Collective AI and client project portfolio |
| **Agent Council** | HATAALII, ZENITH, Knowledge Keeper, and specialized execution agents |
| **Open-source Tool Forge** | Project-aware catalog of agent, voice, 3D, studio, productivity, trading, infrastructure, and developer tools |
| **Agent Hive** | Existing CollectiveOS agent conversations |
| **Collective CRM** | Existing lead and opportunity management |
| **C-U-Later** | Existing video communication surface |
| **Collect-A-Sign** | Existing document signature surface |
| **Browser** | Existing integrated browser surface |

## Runtime-Aware Tools

Web browsers cannot directly start Docker containers, terminal commands, Blender, Godot, or other desktop applications. Tool Forge therefore detects its runtime:

- Reachable web UIs can expose **Open UI**.
- Browser sessions expose verified setup instructions or repository documentation for local services.
- Electron sessions can expose **Launch** or **Launch native** after the authenticated local execution bridge is connected.
- Launch ports and commands are only stored when verified; missing metadata is never guessed.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion
- Zustand
- Supabase-ready data layer
- Vitest + Testing Library
- Capacitor for iOS and Android
- Electron for desktop

## Run the Web Application

```bash
npm install
npm run dev
```

Vite serves the app on `http://localhost:5173` by default.

## Quality Checks

```bash
npm run lint
npm run test:run
npm run build
```

The production build command compiles TypeScript and creates the Vite web bundle.

## Native Builds

### iOS and Android

```bash
npx cap add ios
npx cap add android
npm run build
npx cap sync
```

### Desktop

See `electron.config.ts` and the Electron entry files for desktop packaging.

## Environment Variables

The current application can run with mock/local registry data. Supabase configuration remains optional:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

```bash
npx vercel --prod
```

The web build is an equal product surface, not a reduced preview of the desktop application.
