import { Hono } from "hono";
import { sql } from "../db/client.js";
import { redis } from "../lib/redis.js";

const router = new Hono();
const CACHE_TTL = 60 * 60; // 1h
const CACHE_PREFIX = "url:";

/**
 * GET /:shortId
 * The hot path. Cache-aside pattern:
 *   1. Lookup Redis. Hit → 302 redirect.
 *   2. Miss → query DB, populate cache, redirect.
 *   3. Async increment click counter (fire-and-forget).
 */
router.get("/:shortId", async (c) => {
  const shortId = c.req.param("shortId");

  if (!/^[a-zA-Z0-9_-]{1,30}$/.test(shortId)) {
    return c.json({ error: "invalid_id" }, 400);
  }

  // 1. cache lookup
  const cached = await redis.get(`${CACHE_PREFIX}${shortId}`).catch(() => null);
  if (cached) {
    // fire-and-forget click log
    redis.incr(`clicks:${shortId}`).catch(() => {});
    return c.redirect(cached, 302);
  }

  // 2. db lookup
  const [row] = await sql<{ long_url: string; expires_at: Date | null }[]>`
    SELECT long_url, expires_at FROM urls WHERE short_id = ${shortId}
  `;

  if (!row) return c.json({ error: "not_found" }, 404);

  // expired?
  if (row.expires_at && row.expires_at < new Date()) {
    return c.json({ error: "expired" }, 410);
  }

  // 3. populate cache
  await redis.setex(`${CACHE_PREFIX}${shortId}`, CACHE_TTL, row.long_url).catch(() => {});

  // 4. async click increment
  redis.incr(`clicks:${shortId}`).catch(() => {});

  return c.redirect(row.long_url, 302);
});

export default router;