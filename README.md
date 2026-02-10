# CollectiveOS

Operating system interface for Collective AI — a hybrid native app running on iOS, Android (Capacitor), Desktop (Electron), and Web.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** — Cyber-Glass aesthetic (Dark Slate #0f172a, emerald/ruby accents)
- **Framer Motion** — OS-level window animations, dock magnification
- **Zustand** — Global state management
- **Supabase** — Real-time agent database (400 AI agents)
- **Capacitor** — iOS/Android native builds with kiosk mode
- **Electron** — Desktop native builds with frameless windows

## Features

| App | Description |
|-----|-------------|
| **Agent Hive** | Chat with 400 AI agents across 10 departments (Nexus Labs, Kinetic Edge, Hybrid Living, ZenFlow, etc.) |
| **Collective CRM** | Kanban board with Lead/Negotiation/Won stages and AI win-probability scoring |
| **C-U-Later** | Video conferencing with vanity mirror lobby and live audio visualization |
| **Collect-A-Sign** | PDF upload and canvas-based signature drawing |
| **Chrome** | Browser wrapper with tab management |

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Native Builds

### iOS / Android (Capacitor)
```bash
npx cap add ios
npx cap add android
npm run build && npx cap sync
npx cap open ios
```

### Desktop (Electron)
See `electron.config.ts` for configuration.

## Environment Variables

Create a `.env` file for Supabase (optional — falls back to mock data):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Deploy to Vercel

```bash
npx vercel --prod
```
