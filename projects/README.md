
## Tier 1 — Must build (in order)

| # | Project | Why | Stack | Status |
|---|---|---|---|---|
| 1 | URL Shortener | Classic system design | Bun + Hono + Postgres + Redis | ☐ |
| 2 | Real-time Chat | WebSocket, pub-sub | Bun + WS + Redis + Postgres | ☐ |
| 3 | Rate Limiter | Reusable middleware | Bun + Redis (token bucket) | ☐ |

## Tier 2 — Differentiators

| # | Project | Why | Status |
|---|---|---|---|
| 4 | Real-time Analytics Dashboard | BEAT-inspired, smaller | ☐ |
| 5 | Event-driven microservice | Kafka patterns | ☐ |
| 6 | Search engine | DSA applied to systems | ☐ |

## For each project, document:

1. **Problem** — what & why
2. **Architecture diagram** — ASCII or mermaid
3. **Tech choices & trade-offs** — why this stack
4. **Code highlights** — 2-3 bits worth discussing in interview
5. **Scaling story** — 10× → 100× → 1000× QPS
6. **Deploy link** + screenshot

## Inspiration (study patterns, don't copy)

- Real systems: read engineering blogs (Uber, Yelp, Stripe, Discord, Netflix)

## Per-project folder structure

```
NN-project-name/
  README.md           ← Problem + architecture + deploy link
  ARCHITECTURE.md     ← Deep dive on design choices
  backend/
  frontend/
  docs/
```
