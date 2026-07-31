# Projects (Build your own portfolio — JS/TS full-stack)

> Build 3-5 real projects that demonstrate **backend depth + system design thinking**. These become resume bullets AND interview talking points.
>
> **My stack:** React + Vite + Bun (UI), Bun + Hono/Express (backend), TypeScript everywhere, Postgres + Redis.

## Project Ideas (pick 3-5)

### Tier 1 — Must Have (start here)
| # | Project | Stack | Why | Status |
|---|---|---|---|---|
| 1 | URL Shortener | Bun + Hono + Postgres + Redis | Classic, shows caching + DB design + hashing | ☐ |
| 2 | Real-time Chat | Bun + WebSocket + Redis pub-sub + Postgres | Shows async + scaling | ☐ |
| 3 | Rate Limiter middleware | Bun + token bucket + Redis | Shows infra thinking, reusable library | ☐ |

### Tier 2 — Strong Differentiators
| # | Project | Stack | Why | Status |
|---|---|---|---|---|
| 4 | Distributed Cache | Bun + consistent hashing + cluster | Shows infra depth | ☐ |
| 5 | Event-driven microservice | Bun + Redis Streams (or Kafka) | Shows event-driven patterns | ☐ |
| 6 | Search engine | Bun + tries + inverted index + ranking | Shows DSA applied to systems | ☐ |
| 7 | Mini Twitter / X (fan-out service) | Bun + Redis + queue | System design classic, debate fan-out on write vs read | ☐ |

### Tier 3 — Stretch
| # | Project | Stack | Why | Status |
|---|---|---|---|---|
| 8 | Observability dashboard | Prometheus + Grafana + custom exporter | Shows production thinking | ☐ |
| 9 | Notification system (email/push) | Bun + queue + retry + dead-letter | Shows async reliability | ☐ |
| 10 | DropBox-clone (file storage) | Bun + S3/MinIO + chunked uploads | Shows blob storage + dedup | ☐ |

## Recommended First Project: URL Shortener

**Why this one:**
- Solved in 1-2 weeks even for beginners
- Hits ALL interview topics: hashing, DB design, caching, scaling, analytics
- Small enough to deploy for free (Render/Fly.io)
- Easy to talk about in interview: "How would you scale to 10M URLs?"

**Scope (MVP):**
1. POST /api/shorten → returns short URL
2. GET /:shortId → 302 redirect to original
3. Postgres stores (shortId, longUrl, createdAt, clickCount)
4. Redis caches hot URLs
5. Simple React frontend to demo

**Scale questions to explore:**
- How do you generate short IDs? (base62, hash, counter, snowflake)
- How do you handle collisions?
- How do you cache? (cache-aside, TTL, invalidation)
- How do you rate-limit?
- How do you track analytics?

## For each project, document:
1. **Problem** — what & why
2. **Architecture** — diagram + tech choices + trade-offs
3. **Code highlights** — 2-3 interesting bits worth discussing in interview
4. **What I'd do next** with more time
5. **Deploy link** + screenshot

## Inspiration (study patterns, don't copy code)
- Anshul Garg's repo: Kafka, gRPC, Spring Boot projects → study **patterns**, not solutions
- Awesome GitHub repos for backend systems
- Engineering blogs: Uber, Yelp, Stripe, Cloudflare

- ## Goal
- 1 project every 4-6 weeks
- Each must be **deployable + documented + interview-ready**
