import { Hono } from "hono";
import { cors } from "hono/cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PORT = Number(process.env.PORT ?? 3001);
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// ---- Gemini setup ----
const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;
const chatModel = genAI?.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a helpful assistant for Google L4 interview preparation. " +
    "Answer concisely (under 200 words). Use code snippets when relevant.",
});

const app = new Hono();

app.use("*", cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
}));

app.get("/health", (c) => c.json({ status: "ok", gemini: !!genAI }));

// ---- /api/chat ----
app.post("/api/chat", async (c) => {
  if (!genAI) {
    return c.json({ error: "GEMINI_API_KEY not configured on backend. Set it in google-prep-api/.env" }, 500);
  }

  try {
    const body = await c.req.json().catch(() => null) as { question?: string } | null;
    const question = body?.question?.trim();
    if (!question) return c.json({ error: "question required" }, 400);
    if (question.length > 1000) return c.json({ error: "question too long" }, 400);

    const result = await chatModel!.generateContent(question);
    return c.json({
      answer: result.response.text(),
      sessionId: crypto.randomUUID(),
    });
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : "chat failed" }, 500);
  }
});

// ---- /api/note?path=... ----
app.get("/api/note", async (c) => {
  const requestedPath = c.req.query("path");
  if (!requestedPath) return c.json({ error: "path required" }, 400);

  const prepRoot = resolve(process.cwd(), "..", "Google-Preparation");
  const absPath = resolve(prepRoot, requestedPath.replace(/^\.\.\//, "").replace(/^Google-Preparation\//, ""));

  // Path traversal guard
  if (!absPath.startsWith(prepRoot)) {
    return c.json({ error: "forbidden" }, 403);
  }

  try {
    const content = readFileSync(absPath, "utf-8");
    return c.json({ content });
  } catch (err) {
    return c.json({ error: "file not found", details: String(err) }, 404);
  }
});

console.log(`🚀 API listening on http://localhost:${PORT}`);
console.log(`Gemini: ${genAI ? "✅ configured" : "⚠️  no API key — set GEMINI_API_KEY in .env"}`);

export default {
  port: PORT,
  fetch: app.fetch,
};