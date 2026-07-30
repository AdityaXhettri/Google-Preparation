# System Design: URL Shortener (TinyURL)

> **My solution** to the classic L4 design problem. Written in my own words after studying public references.

## 1. Requirements

### Functional
- Given a long URL, return a short alias (e.g. `https://tiny.url/a1B2c3`)
- Visiting the short URL → 302 redirect to the original
- Optional: custom alias, expiration, analytics

### Non-functional
- **High availability** — short links must resolve, always
- **Low latency** — p99 < 100ms for redirect path
- **Durable** — never lose a URL once created
- **Scalable** — handle 10:1 read-to-write ratio efficiently

## 2. Scale Estimation (back-of-envelope)

Assume: 100M new URLs/month, 10:1 read-to-write

| Metric | Number |
|---|---|
| Writes | ~40 QPS (100M / 30 / 86400) |
| Reads | ~400 QPS |
| Storage (5 years) | 6B URLs × 500 bytes ≈ 3 TB |
| Cache size | 20% of URLs get 80% of traffic → 1.2B hot URLs × 500 bytes ≈ 600 GB |
| Short ID length | 7 chars base62 → 62^7 = 3.5T unique IDs ✓ |

## 3. High-Level Design

```
                  ┌────────────┐
                  │   Client   │
                  └─────┬──────┘
                        │
                        ▼
              ┌─────────────────────┐
              │  Load Balancer (LB) │
              └──────────┬──────────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
      ┌───────────┐             ┌───────────┐
      │ API       │             │ API       │    (stateless, horizontally scaled)
      │ Server 1  │             │ Server 2  │
      └─────┬─────┘             └─────┬─────┘
            │                       │
            └──────────┬────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
  ┌──────────┐                 ┌─────────────┐
  │  Redis   │                 │  Postgres   │
  │  cache   │                 │  (sharded)  │
  └──────────┘                 └─────────────┘
```

## 4. Deep Dive

### Short ID generation

**Option A — Hash + truncate:** `MD5(longUrl)[:7]` base62. Pro: deterministic. Con: collisions, need retry loop.

**Option B — Random:** 7 random base62 chars. Pro: simple. Con: collisions, need retry loop.

**Option C — Snowflake + base62:** Generate a 63-bit snowflake ID, encode in base62. Pro: no collisions, time-ordered, scalable. Con: predictable (could be a feature for debuggability).

**My choice:** Snowflake + base62. It's what I used in [src/lib/short-id.ts](./backend/src/lib/short-id.ts). Snowflake IDs guarantee uniqueness across machines (no DB roundtrip to generate) and base62 keeps URLs short.

### Storage — Postgres schema

```sql
CREATE TABLE urls (
  id BIGSERIAL PRIMARY KEY,
  short_id VARCHAR(10) UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  click_count BIGINT DEFAULT 0
);
CREATE INDEX idx_short_id ON urls(short_id);
```

Why Postgres: ACID, mature, easy to shard later. We don't need NoSQL here.

### Read path — cache-aside

1. Browser → LB → API server
2. Check Redis: `GET url:{shortId}`
3. **Hit:** 302 redirect, async increment counter
4. **Miss:** Query Postgres, populate cache (TTL 1h), redirect

Cache hit rate target: 80%+ (Pareto distribution on URLs).

### Write path

1. Generate shortId via Snowflake
2. `INSERT INTO urls (...)` — handle collision (unlikely with snowflake)
3. Warm cache: `SETEX url:{shortId} 3600 longUrl`
4. Return short URL

## 5. Scaling (10× → 100× → 1000×)

### At 10× (4K QPS)
- 3 API servers behind LB
- Redis single instance (with replica)
- Postgres single primary, read replicas

### At 100× (40K QPS)
- 10 API servers
- Redis Cluster (sharded)
- Postgres sharded by `short_id` hash
- CDN for static frontend assets

### At 1000× (400K QPS)
- All of above + **regional deployment** (US, EU, APAC)
- DNS-based geo routing (`api.us.tiny.url`, etc.)
- Cache aggressively at edge (Cloudflare Workers)
- Async analytics: write to Kafka, batch into ClickHouse

## 6. Bottlenecks & Trade-offs

| Bottleneck | Mitigation |
|---|---|
| Postgres writes saturate | Buffer writes via queue, batch insert |
| Redis OOM | Use Redis Cluster with sharding + eviction policy |
| Cache miss storm ("thundering herd") | Probabilistic early expiration + single-flight (only one DB query per key) |
| Hot key (one URL goes viral) | Replicate hot keys across cache shards |
| DB storage grows forever | Move expired/old URLs to cold storage (S3) |

## 7. Future work

- **Custom aliases** — reserve & check on write path
- **User accounts** — JWT auth, dashboard, link management
- **Analytics** — Click events → Kafka → ClickHouse dashboard
- **Rate limiting** — per-IP token bucket via Redis
- **QR codes** — generate on demand
- **Link preview** — fetch OG metadata asynchronously

## 8. Interview Cheat-Sheet

If asked "design URL shortener" — say:
1. **Functional requirements:** shorten, redirect, optional custom alias
2. **Non-functional:** high availability, low latency, durable
3. **Scale:** 100M URLs/month, 10:1 read-write
4. **Storage:** 3 TB over 5 years → Postgres
5. **Cache:** Redis with cache-aside, 80%+ hit rate
6. **Short ID:** Snowflake + base62 (mention hash + random as alternatives)
7. **Scale further:** read replicas → sharding → regional + edge caching

That's 7 minutes of talking. Spend the rest of the 45 min on deep dives the interviewer cares about.