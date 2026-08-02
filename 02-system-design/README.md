# System Design Tracker (Google L4)

> For each problem: write a 1-page solution. Don't just read — write it yourself.

## Classic Problems (start here)

| # | Problem | Status | My notes file |
|---|---|---|---|
| 1 | URL Shortener (TinyURL) | ☐ | [01-url-shortener.md](./01-url-shortener.md) |
| 2 | Design Twitter / X (feed) | ☐ | [02-twitter-feed.md](./02-twitter-feed.md) |
| 3 | YouTube / Netflix | ☐ | [03-video-streaming.md](./03-video-streaming.md) |
| 4 | Uber / Lyft (geo) | ☐ | [04-ride-sharing.md](./04-ride-sharing.md) |
| 5 | WhatsApp / Messenger | ☐ | [05-chat-messenger.md](./05-chat-messenger.md) |
| 6 | Yelp / Nearby | ☐ | [06-yelp-nearby.md](./06-yelp-nearby.md) |
| 7 | Rate Limiter | ☐ | [07-rate-limiter.md](./07-rate-limiter.md) |
| 8 | Web Crawler | ☐ | [08-web-crawler.md](./08-web-crawler.md) |
| 9 | Notification System | ☐ | [09-notification-system.md](./09-notification-system.md) |
| 10 | Dropbox / Google Drive | ☐ | [10-file-storage.md](./10-file-storage.md) |

## Core Concepts to Master

- [ ] **Scalability** — vertical vs horizontal, load balancing
- [ ] **Caching** — Redis, eviction policies, cache-aside vs write-through
- [ ] **Databases** — SQL vs NoSQL, sharding, replication, CAP theorem
- [ ] **Message Queues** — Kafka, RabbitMQ, pub-sub vs point-to-point
- [ ] **CDN** — edge caching, cache invalidation
- [ ] **Consistent Hashing** — when and why
- [ ] **CAP & PACELC** — trade-offs explained
- [ ] **API Design** — REST, gRPC, GraphQL trade-offs
- [ ] **Monitoring & Observability** — metrics, logs, traces

## My Approach (45-min interview format)
1. **Clarify** requirements (5 min) — ask 3-5 questions about scale, features, users
2. **Estimate** scale (2 min) — QPS, storage, bandwidth
3. **High-level design** (10 min) — boxes & arrows: clients, services, DBs, caches
4. **Deep dive** (15 min) — pick 1-2 components and go deep
5. **Bottlenecks & trade-offs** (8 min) — what breaks first? how to mitigate?
6. **Wrap up** (5 min) — summary, future work

## Resources
- (Fill in: Alex Xu's books? educative.io? YouTube?)


