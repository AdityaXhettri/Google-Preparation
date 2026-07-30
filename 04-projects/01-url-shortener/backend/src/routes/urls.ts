import { Hono } from "hono";
import { z } from "zod";
import { sql } from "../db/client.js";
import { redis } from "../lib/redis.js";
import { generateShortId } from "../lib/short-id.js";

const router = new Hono();

const ShortenBody = z.object({
  url: z.string().url().max(2048),
  customAlias: z.string().regex(/^[a-zA-Z0-9_-]{3,30}$/).optional(),
  expiresInDays: z.number().int().positive().max(365).optional(),
});

// CACHE_TTL in seconds
const CACHE_TTL = 60 * 60; // 1 hour
const CACHE_PREFIX = "url:";

/**
 * POST /api/shorten
 * Body: { url, customAlias?, expiresInDays? }
 * Returns: { shortId, shortUrl, longUrl }
 */
router.post("/shorten", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = ShortenBody.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid_input", details: parsed.error.flatten() }, 400);
  }

  const { url, customAlias, expiresInDays } = parsed.data;

  let shortId = customAlias ?? generateShortId();
  let attempts = 0;
  while (attempts < 5) {
    try {
      const expiresAt = expiresInDays
        ? new Date(Date.now() + expiresInDays * 86_400_000)
        : null;

      const [row] = await sql<{ short_id: string }[]>`
        INSERT INTO urls (short_id, long_url, expires_at)
        VALUES (${shortId}, ${url}, ${expiresAt})
        RETURNING short_id
      `;

      // warm cache
      await redis.setex(`${CACHE_PREFIX}${shortId}`, CACHE_TTL, url);

      return c.json({
        shortId: row.short_id,
        shortUrl: `${process.env.BASE_URL ?? "http://localhost:3001"}/${row.short_id}`,
        longUrl: url,
      }, 201);
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e.code === "23505" && !customAlias) {
        // unique violation on auto-generated id (extremely unlikely with snowflake)
        shortId = generateShortId();
        attempts++;
        continue;
      }
      if (e.code === "23505") {
        return c.json({ error: "alias_taken" }, 409);
      }
      throw err;
    }
  }
  return c.json({ error: "collision_retry" }, 500);
});

/**
 * GET /api/urls/:shortId
 * Returns metadata (not the redirect — use :shortId for that).
 */
router.get("/urls/:shortId", async (c) => {
  const shortId = c.req.param("shortId");
  const [row] = await sql<{
    short_id: string;
    long_url: string;
    created_at: Date;
    expires_at: Date | null;
    click_count: string;
  }[]>`
    SELECT short_id, long_url, created_at, expires_at, click_count
    FROM urls WHERE short_id = ${shortId}
  `;
  if (!row) return c.json({ error: "not_found" }, 404);
  return c.json(row);
});

export default router;