# URL Shortener

> **Goal:** Build a production-quality URL shortener. This is my interview prep project — designed to demonstrate backend depth + system design thinking.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Bun + Hono (TypeScript) |
| Database | Postgres |
| Cache | Redis |
| Deployment | TBD (Render / Fly.io) |

## Architecture

```
                    ┌────────────┐
                    │  Browser   │
                    └─────┬──────┘
                          │
                          ▼
              ┌────────────────────┐         ┌─────────┐
   GET /:id ─►│  Hono / Bun API    │────────►│  Redis  │  (cache hot URLs)
              │                    │         └─────────┘
              │  - POST /shorten   │
              │  - GET /:shortId   │         ┌──────────┐
              │  - GET /api/urls   │────────►│ Postgres │  (source of truth)
              └────────────────────┘         └──────────┘
```

## Features (MVP)

- [x] POST `/api/shorten` — create short URL (with optional custom alias)
- [x] GET `/:shortId` — 302 redirect (cached via Redis)
- [x] GET `/api/urls/:shortId` — metadata
- [x] Click counter (async, fire-and-forget)
- [x] Optional expiration (`expiresInDays`)
- [ ] Rate limiting (per IP)
- [ ] User accounts & dashboards
- [ ] Analytics dashboard (clicks over time, geo)
- [ ] QR code generation

## Setup

```bash
# Backend
cd backend
bun install
cp .env.example .env   # edit values
# Run schema
psql $DATABASE_URL < src/db/schema.sql
bun run dev

# Frontend
cd frontend
bun install
bun run dev
```

## Interview Talking Points (1-pagers in this folder)

- `01-design.md` — System design write-up (45-min interview format)
- `02-scaling.md` — How to scale from 100 RPS to 100K RPS
- `03-tradeoffs.md` — Decisions and alternatives
- `04-runbook.md` — How I'd operate this in prod

## Inspiration sources
- Anshul Garg's repo: study patterns from his Kafka/gRPC projects
- Alex Xu's *System Design Interview Vol 1* — Ch. 1 URL Shortener
- Real-world: bit.ly, tinyurl engineering blogs