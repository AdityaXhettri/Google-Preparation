# Google L4 Prep Platform

Local-only study + practice platform. **Vite + React + Bun**.

## Run

```bash
cd "c:\Users\adity\OneDrive\Desktop\github projects\google-prep-ui"
npm install
npm run dev
```

Opens http://localhost:5173.

**For chat to work**, also run the backend in another terminal:

```bash
cd "c:\Users\adity\OneDrive\Desktop\github projects\google-prep-api"
bun install
cp .env.example .env
# edit .env with your Gemini key from https://aistudio.google.com/apikey
bun run dev
```

The Vite dev server proxies `/api/*` to `http://localhost:3001`.

## Features

- **Dashboard** — streak, progress charts, quick actions
- **DSA Patterns** (`/dsa`) — all 18 patterns with cards, progress bars
- **Pattern detail** (`/dsa/01-sliding-window`) — gradient header, problems list, notes
- **DSA Practice** (`/practice/dsa`) — Monaco editor, timed (15/25/40 min), auto test runner
- **System Design** (`/practice/system-design`) — 45 min timer + checklist
- **Behavioral** (`/practice/behavioral`) — 2 min timer + audio record
- **Study** (`/study`) — markdown viewer with progress
- **Chat** (`/chat`) — Gemini-powered RAG (optional)

## Stack

- Vite 6 + React 19
- React Router 7
- Tailwind 4
- Monaco Editor
- Recharts
- localStorage (all progress stored locally)