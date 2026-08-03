import { Hono } from "hono";
import { cors } from "hono/cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Manually load .env (handles BOM and Windows quirks)
function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  try {
    let content = readFileSync(envPath, "utf-8");
    // Strip UTF-8 BOM if present
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      if (m[1].startsWith("#")) continue;
      if (process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2];
      }
    }
  } catch (e) {
    console.error("Failed to load .env:", e);
  }
}
loadEnv();

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

// ---- /api/hint ----
// Socratic hint bot for a specific problem. Never gives the answer.
app.post("/api/hint", async (c) => {
  if (!genAI) {
    return c.json({ error: "GEMINI_API_KEY not configured" }, 500);
  }

  try {
    const body = await c.req.json().catch(() => null) as {
      problemTitle?: string;
      problemDescription?: string;
      pattern?: string;
      difficulty?: string;
      userQuestion?: string;
      history?: { role: "user" | "assistant"; content: string }[];
    } | null;

    if (!body?.problemTitle || !body?.userQuestion) {
      return c.json({ error: "problemTitle and userQuestion required" }, 400);
    }

    const sysPrompt = `You are a Socratic tutor for DSA coding interview prep. A student is working on the problem: "${body.problemTitle}" (pattern: ${body.pattern ?? "unknown"}, difficulty: ${body.difficulty ?? "medium"}).

Problem description:
${body.problemDescription ?? "(not provided)"}

RULES (CRITICAL):
- NEVER give the full solution or final answer
- NEVER write working code
- Ask clarifying questions to understand what the student has tried
- Give progressive hints: questions, then technique names, then pseudocode (NOT real code)
- Be encouraging and short (under 100 words)
- If the student asks for the answer directly, refuse and instead ask what they've tried
- Reference the problem context when possible`;

    const historyText = (body.history ?? [])
      .map((m) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`)
      .join("\n");

    const userMsg = historyText
      ? `Conversation so far:\n${historyText}\n\nStudent: ${body.userQuestion}`
      : `Student: ${body.userQuestion}`;

    const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: sysPrompt })
      .generateContent(userMsg);

    return c.json({ hint: result.response.text() });
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : "hint failed" }, 500);
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