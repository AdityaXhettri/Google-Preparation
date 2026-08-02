# System Design for Google L4

## The 45-minute interview format

| Time | Phase | What you do |
|---|---|---|
| 0-5 min | **Clarify** | 3-5 questions about scope, scale, users |
| 5-7 min | **Estimate** | QPS, storage, bandwidth |
| 7-17 min | **High-level design** | Boxes and arrows |
| 17-35 min | **Deep dive** | 2-3 components in detail |
| 35-40 min | **Bottlenecks** | What breaks first? |
| 40-45 min | **Wrap up** | Summary, future work |

## Clarifying questions (always ask)

1. **Who are the users?** (consumer? enterprise? internal?)
2. **What's the scale?** (DAU, write-heavy vs read-heavy)
3. **What's the geo?** (single region? global?)
4. **What features are MVP vs nice-to-have?**
5. **Real-time or batch?**
6. **Existing systems to integrate with?**

## Scale estimation cheat sheet

| Scale | QPS | Storage / day |
|---|---|---|
| Small startup | 10-100 | MB |
| Mid-size app | 1K-10K | GB |
| Google scale | 100K-1M+ | TB-PB |

**Rule of thumb:**
- 1M DAU × 5 actions/day ÷ 86400 sec = ~60 QPS avg
- Peak = 2-3× avg
- Text tweet ≈ 1 KB, video tweet ≈ 5 MB
- Photos: 200 KB each

## The high-level design

Always cover these layers:

```
       ┌────────────────────────────────────────┐
       │            CLIENT (Web/Mobile)          │
       └────────────────────┬───────────────────┘
                            │
       ┌────────────────────▼───────────────────┐
       │              LOAD BALANCER              │
       └─┬──────────────┬──────────────┬────────┘
         │              │              │
       ┌─▼──┐        ┌──▼─┐        ┌──▼─┐
       │API │        │API │        │API │    ← stateless app servers
       └┬───┘        └┬───┘        └┬───┘
        │             │             │
   ┌────▼─────────────▼─────────────▼────┐
   │             CACHE LAYER (Redis)       │
   └────┬─────────────┬─────────────┬────┘
        │             │             │
   ┌────▼──┐    ┌────▼──┐    ┌────▼──┐
   │Postgres│   │Postgres│   │Postgres│  ← primary DB
   └────┬──┘    └────┬──┘    └────┬──┘
        │             │             │
   ┌────▼─────────────▼─────────────▼────┐
   │           MESSAGE QUEUE (Kafka)       │
   └─────────────┬───────────┬────────────┘
                 │           │
            ┌────▼──┐   ┌────▼──┐
            │Search │   │Analytics│  ← async processing
            └───────┘   └────────┘
```

## Core concepts to know

### Caching
- **Cache-aside**: app reads cache first, falls back to DB, populates cache
- **Read-through**: cache itself reads from DB on miss
- **Write-through**: every write goes to DB and cache
- **Eviction**: LRU (most common), LFU, FIFO

### Databases
- **SQL vs NoSQL**: SQL for ACID + relationships; NoSQL for scale + flexibility
- **Sharding**: split data across nodes by some key (user_id, geo)
- **Replication**: master-slave (read scaling), multi-master (write scaling)
- **CAP theorem**: pick 2 of Consistency, Availability, Partition tolerance
- **Indexing**: B-tree (default), hash, full-text

### Message queues
- **Why**: decouple producers from consumers, buffer spikes, async processing
- **Kafka**: high throughput, durable, partitioned
- **RabbitMQ**: traditional, more features, less throughput
- **SQS**: AWS-managed, simple

### Scaling
- **Vertical**: bigger machine. Limited.
- **Horizontal**: more machines. Need statelessness + sharding.
- **Read replicas**: for read-heavy workloads
- **Caching**: easiest first win

### API design
- **REST**: stateless, resource-based, HTTP verbs
- **gRPC**: binary, fast, schema-defined
- **GraphQL**: client specifies shape, single endpoint
- **WebSocket**: bidirectional, real-time

### CDN
- Caches static + cacheable content at edge globally
- Reduces latency, offloads origin
- Use for: images, videos, JS/CSS, HTML for public pages

### Consistent hashing
- Distribute keys across N nodes
- Adding/removing node only affects K/N keys
- Standard hash mod N fails when N changes

## The 10 problems to master

| # | Problem | Key concepts |
|---|---|---|
| 1 | [URL Shortener](01-url-shortener.md) | Hash vs Snowflake IDs, cache-aside, 302 vs 301 |
| 2 | [Twitter / X Feed](02-twitter-feed.md) | Fan-out on write vs read, celebrity problem |
| 3 | [YouTube / Netflix](03-video-streaming.md) | Transcoding, CDN, HLS/DASH |
| 4 | [Rate Limiter](04-rate-limiter.md) | Token bucket, leaky bucket, sliding window |
| 5 | [WhatsApp / Messenger](05-chat-messenger.md) | WebSocket, presence, message ordering |
| 6 | [Notification System](06-notification.md) | Multi-channel, retry, dedup |
| 7 | [Dropbox / Google Drive](07-file-storage.md) | Chunking, dedup, sync conflicts |
| 8 | [Uber / Lyft](08-ride-sharing.md) | Geo-indexing (QuadTree/S2), dispatch |
| 9 | [Yelp / Nearby](09-yelp-nearby.md) | Geo-search, full-text search |
| 10 | [Real-time Analytics](10-realtime-analytics.md) | Kafka + Flink/Spark + OLAP |

## Trade-offs to know

| Decision | Trade-off |
|---|---|
| SQL vs NoSQL | Consistency/joins vs scale/flex |
| Push vs pull (fan-out) | Read latency vs write cost |
| Cache TTL | Stale data vs cache misses |
| Sync vs async | Simplicity vs latency |
| gRPC vs REST | Speed/typing vs simplicity/tooling |
| Polling vs push | Battery/latency vs server cost |

