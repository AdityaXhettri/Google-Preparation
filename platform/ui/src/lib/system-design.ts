export type SystemDesignProblem = {
  id: string;
  title: string;
  difficulty: "medium" | "hard";
  description: string;
  keyRequirements: string[];
  checklist: { id: string; label: string }[];
};

export const SYSTEM_DESIGN: SystemDesignProblem[] = [
  { id: "sd-url", title: "URL Shortener (TinyURL)", difficulty: "medium", description: "Design a service like bit.ly. Given a long URL, return a short alias. Visiting the alias redirects to the original.", keyRequirements: ["Shorten long URLs (POST /shorten)", "Redirect (GET /:id → 302)", "10:1 read-to-write ratio", "URLs last forever"], checklist: [
    { id: "scale", label: "Estimated QPS, storage, bandwidth" },
    { id: "api", label: "Defined API endpoints" },
    { id: "ids", label: "Explained short ID generation (snowflake / hash)" },
    { id: "db", label: "Chose DB schema (Postgres)" },
    { id: "cache", label: "Caching strategy (Redis, cache-aside)" },
    { id: "redirect", label: "302 vs 301 trade-off" },
    { id: "scale", label: "Scaling story (10× → 100× → 1000×)" },
    { id: "bottleneck", label: "Identified bottlenecks" },
    { id: "monitoring", label: "Monitoring + analytics" },
  ]},
  { id: "sd-twitter", title: "Design Twitter / X Feed", difficulty: "hard", description: "Design a home timeline. Users post tweets, follow others, see tweets from followed accounts.", keyRequirements: ["Post a tweet", "Follow / unfollow users", "Home timeline reverse chrono", "Like, retweet"], checklist: [
    { id: "fanout", label: "Fan-out on write vs read (chose one, justified)" },
    { id: "scale", label: "Scale: 300M DAU, ~5K tweets/sec" },
    { id: "timeline", label: "Timeline generation strategy" },
    { id: "cache", label: "Hot user / celebrity problem" },
    { id: "media", label: "Media (images / video) handling" },
    { id: "search", label: "Search integration" },
    { id: "notifications", label: "Push notifications" },
  ]},
  { id: "sd-youtube", title: "Design YouTube / Netflix", difficulty: "hard", description: "Design a video streaming service.", keyRequirements: ["Upload video", "Watch video (stream)", "Search / recommend"], checklist: [
    { id: "storage", label: "Blob storage (S3) + chunking" },
    { id: "transcoding", label: "Transcoding (multiple bitrates)" },
    { id: "cdn", label: "CDN strategy" },
    { id: "protocol", label: "Streaming protocol (HLS / DASH)" },
    { id: "scale", label: "Bandwidth estimation" },
    { id: "search", label: "Search by metadata + content" },
    { id: "recommend", label: "Recommendation system overview" },
  ]},
  { id: "sd-rate", title: "Rate Limiter", difficulty: "medium", description: "Limit users to N requests per time window.", keyRequirements: ["Per-user or per-IP limits", "Configurable limits", "Return 429 when exceeded"], checklist: [
    { id: "algorithms", label: "Compared token / leaky / fixed / sliding window" },
    { id: "storage", label: "Storage: Redis with TTL" },
    { id: "race", label: "Race conditions (atomic ops)" },
    { id: "distributed", label: "Distributed rate limiting" },
    { id: "response", label: "429 + Retry-After header" },
    { id: "monitoring", label: "Monitoring + alerts" },
  ]},
  { id: "sd-chat", title: "WhatsApp / Messenger", difficulty: "hard", description: "1-on-1 real-time chat.", keyRequirements: ["Send / receive messages in real time", "Online status", "Read receipts"], checklist: [
    { id: "protocol", label: "WebSocket vs long polling" },
    { id: "store", label: "Message storage (NoSQL?)" },
    { id: "delivery", label: "Delivery guarantees" },
    { id: "presence", label: "Online status service" },
    { id: "encryption", label: "E2E encryption note" },
    { id: "scale", label: "Scaling WebSocket connections" },
    { id: "media", label: "Media messages" },
  ]},
  { id: "sd-notif", title: "Notification System", difficulty: "medium", description: "Send notifications (push, email, SMS).", keyRequirements: ["Multiple channels", "User preferences", "Rate limiting"], checklist: [
    { id: "channels", label: "Channel abstraction" },
    { id: "queue", label: "Async via queue (Kafka / SQS)" },
    { id: "retry", label: "Retry strategy + dead-letter" },
    { id: "prefs", label: "User preference store" },
    { id: "rate", label: "Rate limiting per user" },
    { id: "delivery", label: "Delivery tracking + receipts" },
  ]},
  { id: "sd-dropbox", title: "Dropbox / Google Drive", difficulty: "hard", description: "Cloud file storage service.", keyRequirements: ["Upload / download files", "Sync across devices", "Share files"], checklist: [
    { id: "chunking", label: "Chunked uploads" },
    { id: "dedup", label: "Deduplication (content hash)" },
    { id: "metadata", label: "Metadata DB vs blob storage" },
    { id: "sync", label: "Sync conflict resolution" },
    { id: "cdn", label: "CDN for downloads" },
    { id: "sharing", label: "Sharing + permissions" },
  ]},
  { id: "sd-uber", title: "Uber / Lyft", difficulty: "hard", description: "Ride-sharing service.", keyRequirements: ["Rider requests ride", "Find nearby drivers", "Match rider with driver", "Real-time location"], checklist: [
    { id: "geo", label: "Geo-indexing (QuadTree / S2)" },
    { id: "dispatch", label: "Driver matching algorithm" },
    { id: "location", label: "Real-time location updates" },
    { id: "eta", label: "ETA calculation" },
    { id: "payments", label: "Payment flow" },
    { id: "scale", label: "Scale (millions of locations)" },
  ]},
  { id: "sd-yelp", title: "Yelp / Nearby", difficulty: "medium", description: "Place search service.", keyRequirements: ["Search by query", "Filter by location + radius", "Sort by distance / rating"], checklist: [
    { id: "geo", label: "Geo-indexing" },
    { id: "search", label: "Full-text search" },
    { id: "filter", label: "Filtering strategy" },
    { id: "scale", label: "Indexing pipeline" },
    { id: "cache", label: "Cache popular queries" },
  ]},
  { id: "sd-analytics", title: "Real-time Analytics Pipeline", difficulty: "medium", description: "Ingest events in real-time, produce dashboards.", keyRequirements: ["Ingest millions of events/sec", "Real-time aggregations", "Historical batch analytics"], checklist: [
    { id: "ingest", label: "Event ingestion (Kafka)" },
    { id: "stream", label: "Stream processing (Flink / Spark)" },
    { id: "store", label: "OLAP store" },
    { id: "lambda", label: "Lambda / Kappa architecture" },
    { id: "dashboard", label: "Dashboard serving" },
    { id: "schema", label: "Schema evolution" },
  ]},
];

export function randomDesignProblem(): SystemDesignProblem {
  return SYSTEM_DESIGN[Math.floor(Math.random() * SYSTEM_DESIGN.length)];
}