import { Hono } from "hono";
import { cors } from "hono/cors";
import urls from "./routes/urls.js";
import redirect from "./routes/redirect.js";

const app = new Hono();

app.use("*", cors({ origin: ["http://localhost:5173"], credentials: true }));

app.get("/health", (c) => c.json({ status: "ok" }));

// Order matters: redirect router matches GET /:shortId which is greedy.
// Register it AFTER more specific routes by mounting it last.
app.route("/api", urls);
app.route("/", redirect);

const port = Number(process.env.PORT ?? 3001);
console.log(`URL shortener backend listening on :${port}`);

export default {
  port,
  fetch: app.fetch,
};