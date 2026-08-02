# System Design Tracker (Google L4)

> Practice 10 classic problems. Write 1 page each. **Do not just read — write it.**

## Classic Problems

| # | Problem | My write-up | Rehearsed |
|---|---|---|---|
| 1 | URL Shortener (TinyURL) | [01-url-shortener.md](./01-url-shortener.md) | ☐ |
| 2 | Design Twitter feed | [02-twitter-feed.md](./02-twitter-feed.md) | ☐ |
| 3 | YouTube / Netflix | [03-video-streaming.md](./03-video-streaming.md) | ☐ |
| 4 | Uber / Lyft (geo) | [04-ride-sharing.md](./04-ride-sharing.md) | ☐ |
| 5 | WhatsApp / Messenger | [05-chat-messenger.md](./05-chat-messenger.md) | ☐ |
| 6 | Rate Limiter | [06-rate-limiter.md](./06-rate-limiter.md) | ☐ |
| 7 | Notification System | [07-notification.md](./07-notification.md) | ☐ |
| 8 | Dropbox / Google Drive | [08-file-storage.md](./08-file-storage.md) | ☐ |
| 9 | Yelp / Nearby | [09-yelp-nearby.md](./09-yelp-nearby.md) | ☐ |
| 10 | Real-time Analytics (BEAT-inspired) | [10-realtime-analytics.md](./10-realtime-analytics.md) | ☐ |

## Core Concepts to Master

- [ ] **Scalability** — vertical vs horizontal, load balancing
- [ ] **Caching** — Redis, eviction policies, cache-aside vs write-through
- [ ] **Databases** — SQL vs NoSQL, sharding, replication, CAP theorem
- [ ] **Message Queues** — Kafka, RabbitMQ, pub-sub vs point-to-point
- [ ] **CDN** — edge caching, cache invalidation
- [ ] **Consistent Hashing** — when and why
- [ ] **API Design** — REST, gRPC, GraphQL trade-offs
- [ ] **Monitoring** — metrics, logs, traces

## 45-min Interview Format (memorize this)

1. **Clarify** (5 min) — 3-5 questions about scale, features, users
2. **Estimate** (2 min) — QPS, storage, bandwidth
3. **High-level** (10 min) — boxes & arrows
4. **Deep dive** (15 min) — pick 1-2 components
5. **Bottlenecks** (8 min) — what breaks first, mitigation
6. **Wrap up** (5 min) — summary, future work

## Inspiration

- Alex Xu books
- Engineering blogs: Uber, Yelp, Stripe, Cloudflare, Discord