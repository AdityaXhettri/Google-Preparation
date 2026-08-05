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
const chatModel = null; // unused — each endpoint creates its own model

const app = new Hono();

app.use("*", cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
}));

app.get("/health", (c) => c.json({ status: "ok", gemini: !!genAI }));

// ---- /api/test-models ----
// Test ALL available models for a key, return which ones work
app.get("/api/test-models", async (c) => {
  const key = GEMINI_KEY || "";
  if (!key) return c.json({ error: "No API key configured" }, 400);

  const models = [
    "gemini-1.5-flash-8b",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-pro-latest",
  ];
  const testGenAI = new GoogleGenerativeAI(key);
  const results: Record<string, { ok: boolean; error?: string }> = {};

  for (const model of models) {
    try {
      const result = await testGenAI.getGenerativeModel({ model })
        .generateContent("OK");
      results[model] = { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "failed";
      results[model] = { ok: false, error: msg.slice(0, 200) };
    }
  }

  return c.json({ results, workingModels: Object.entries(results).filter(([_, v]) => v.ok).map(([k]) => k) });
});

// ---- /api/test-groq ----
// Test if Groq API key is valid
app.post("/api/test-gemini", async (c) => {
  try {
    const body = await c.req.json().catch(() => null) as { apiKey?: string } | null;
    const key = (body?.apiKey || "").trim();
    if (!key) return c.json({ ok: false, error: "No API key provided" }, 400);
    const testGenAI = new GoogleGenerativeAI(key);
    const result = await testGenAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      .generateContent("Reply with the word OK.");
    return c.json({ ok: true, response: result.response.text().trim(), model: "gemini-1.5-flash" });
  } catch (e) {
    return c.json({ ok: false, error: e instanceof Error ? e.message.slice(0, 200) : "test failed" }, 500);
  }
});

// ---- /api/test-groq ----
// Test if Groq API key is valid
app.post("/api/test-groq", async (c) => {
  try {
    const body = await c.req.json().catch(() => null) as { apiKey?: string } | null;
    const key = (body?.apiKey || "").trim();
    if (!key) return c.json({ ok: false, error: "No API key provided" }, 400);

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: "Reply with just the word OK." }],
        max_tokens: 10,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return c.json({ ok: false, error: `HTTP ${res.status}: ${errText.slice(0, 200)}` }, res.status as 400);
    }
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "(no response)";
    return c.json({ ok: true, response: reply, model: "llama-3.1-8b-instant" });
  } catch (e) {
    return c.json({ ok: false, error: e instanceof Error ? e.message : "test failed" }, 500);
  }
});

// ---- /api/groq-usage ----
// Get current usage stats for a Groq API key
app.post("/api/groq-usage", async (c) => {
  try {
    const body = await c.req.json().catch(() => null) as { apiKey?: string } | null;
    const key = (body?.apiKey || "").trim();
    if (!key) return c.json({ ok: false, error: "No API key provided" }, 400);

    // Try to get usage from Groq's response headers (they include x-ratelimit-* headers)
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: "ok" }],
        max_tokens: 1,
      }),
    });

    if (!res.ok) {
      return c.json({ ok: false, error: `HTTP ${res.status}` }, res.status as 400);
    }

    // Groq returns rate limit info in headers
    const headers = Object.fromEntries(res.headers.entries());
    return c.json({
      ok: true,
      remainingRequests: headers["x-ratelimit-remaining-requests"] || "?",
      remainingTokens: headers["x-ratelimit-remaining-tokens"] || "?",
      limitRequests: headers["x-ratelimit-limit-requests"] || "?",
      limitTokens: headers["x-ratelimit-limit-tokens"] || "?",
      resetRequests: headers["x-ratelimit-reset-requests"] || "?",
      resetTokens: headers["x-ratelimit-reset-tokens"] || "?",
    });
  } catch (e) {
    return c.json({ ok: false, error: e instanceof Error ? e.message : "failed" }, 500);
  }
});

// ---- /api/chat ----
app.post("/api/chat", async (c) => {
  try {
    const body = await c.req.json().catch(() => null) as { question?: string; apiKey?: string; provider?: string } | null;
    const question = body?.question?.trim();
    const requestKey = body?.apiKey?.trim();
    const requestProvider = body?.provider;
    const activeKey = requestKey || GEMINI_KEY;
    if (!activeKey) {
      return c.json({ error: "No API key. Add one in Settings (⚙️)." }, 500);
    }
    if (!question) return c.json({ error: "question required" }, 400);
    if (question.length > 1000) return c.json({ error: "question too long" }, 400);

    // Try Groq first if it's a Groq key or explicitly requested
    if (activeKey.startsWith("gsk_") || requestProvider === "groq") {
      const groqModels = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "mixtral-8x7b-32768"];
      for (const modelName of groqModels) {
        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${activeKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: "system", content: "You are a helpful assistant for Google L4 interview preparation. Answer concisely (under 200 words). Use code snippets when relevant." },
                { role: "user", content: question },
              ],
              max_tokens: 500,
              temperature: 0.7,
            }),
          });
          if (!res.ok) {
            const errText = await res.text();
            if (errText.includes("429") || errText.includes("rate")) continue;
            continue;
          }
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content?.trim() || "";
          if (text) {
            return c.json({ answer: text, model: modelName, provider: "groq" });
          }
        } catch (e) {
          // try next model
        }
      }
    }

    // Fall back to Gemini
    if (activeKey.startsWith("AIza")) {
      const activeGenAI = new GoogleGenerativeAI(activeKey);
      const models = ["gemini-1.5-flash-8b", "gemini-1.5-flash", "gemini-2.0-flash"];
      let lastError = null;
      for (const modelName of models) {
        try {
          const result = await activeGenAI.getGenerativeModel({ model: modelName, systemInstruction: "You are a helpful assistant for Google L4 interview preparation. Answer concisely (under 200 words). Use code snippets when relevant." })
            .generateContent(question);
          return c.json({ answer: result.response.text(), model: modelName, provider: "gemini" });
        } catch (e) {
          lastError = e;
          const errMsg = e instanceof Error ? e.message : "";
          if (errMsg.includes("429") || errMsg.includes("quota")) break;
          continue;
        }
      }
      throw lastError || new Error("All models failed");
    }

    throw new Error("No valid API key. Use a Groq key (gsk_...) or Gemini key (AIza...).");
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : "chat failed" }, 500);
  }
});

// ---- /api/test-key ----
// Test if a Gemini API key is valid. Tries multiple models.
app.post("/api/test-key", async (c) => {
  try {
    const body = await c.req.json().catch(() => null) as { apiKey?: string } | null;
    const key = (body?.apiKey || GEMINI_KEY || "").trim();
    if (!key) {
      return c.json({ ok: false, error: "No API key provided" }, 400);
    }
    const testGenAI = new GoogleGenerativeAI(key);
    // Try multiple models in order — pick the one that works
    const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-pro"];
    for (const modelName of models) {
      try {
        const result = await testGenAI.getGenerativeModel({ model: modelName })
          .generateContent("Reply with just the word OK.");
        return c.json({ ok: true, model: modelName, response: result.response.text().trim() });
      } catch (e) {
        // Try next model
        const errMsg = e instanceof Error ? e.message : "failed";
        if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("Quota")) {
          // Quota issue — but at least the key is valid. Return as ok with a note.
          return c.json({ ok: true, model: modelName, warning: "Key is valid but quota exceeded. Wait 1-2 minutes." });
        }
        continue; // try next model
      }
    }
    return c.json({ ok: false, error: "All models failed. Check your key at aistudio.google.com/apikey" }, 500);
  } catch (err) {
    return c.json({ ok: false, error: err instanceof Error ? err.message : "test failed" }, 500);
  }
});

// ---- /api/hint ----
// Socratic hint bot for a specific problem. Never gives the answer.
// Token-safety: caps question length, limits history, has system prompt guards.
app.post("/api/hint", async (c) => {
  try {
    const body = await c.req.json().catch(() => null) as {
      problemTitle?: string;
      problemDescription?: string;
      pattern?: string;
      difficulty?: string;
      userQuestion?: string;
      history?: { role: "user" | "assistant"; content: string }[];
      apiKey?: string;
    } | null;

    if (!body?.problemTitle || !body?.userQuestion) {
      return c.json({ error: "problemTitle and userQuestion required" }, 400);
    }

    // Use key from request body if provided, else from env
    const requestKey = (body.apiKey as string | undefined)?.trim();
    const activeKey = requestKey || GEMINI_KEY;
    if (!activeKey) {
      return c.json({ error: "No API key. Set GEMINI_API_KEY in .env or paste it in the app's Settings page." }, 500);
    }
    const activeGenAI = new GoogleGenerativeAI(activeKey);

    // SAFETY 1: Cap user question to 500 chars (prevents token abuse)
    let userQuestion = body.userQuestion.trim();
    if (userQuestion.length > 500) {
      userQuestion = userQuestion.slice(0, 500) + "...";
    }

    // SAFETY 2: Only last 3 exchanges (was unlimited) — saves huge tokens
    const recentHistory = (body.history ?? []).slice(-6); // 3 user + 3 assistant

    // SAFETY 3: Truncate problem description to first 600 chars
    const problemDesc = (body.problemDescription ?? "").slice(0, 600);

    // SAFETY 4: Hard refusal system prompt — multiple guards
    const sysPrompt = `You are a Socratic tutor for DSA coding interview prep. A student is working on the problem: "${body.problemTitle}" (pattern: ${body.pattern ?? "unknown"}, difficulty: ${body.difficulty ?? "medium"}).

Problem description (truncated):
${problemDesc || "(not provided)"}

CRITICAL RULES (HARD CONSTRAINTS — DO NOT VIOLATE):
1. NEVER give the full solution or final answer.
2. NEVER write working code in any language.
3. NEVER provide pseudocode that solves the problem.
4. If asked "give me the answer" / "solve it" / "show the code" / "complete solution", REFUSE and instead ask "What part are you stuck on? What have you tried so far?"
5. Give progressive hints: start with questions, then technique names, then conceptual guidance.
6. Keep responses SHORT (under 120 words).
7. Be encouraging and Socratic (use questions to guide thinking).
8. If the student claims they can't figure it out after 3+ tries, suggest they look up the pattern name in GeeksForGeeks or LeetCode discuss (don't give the answer).`;

    const historyText = recentHistory
      .map((m) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content.slice(0, 200)}`)
      .join("\n");

    const userMsg = historyText
      ? `Conversation so far:\n${historyText}\n\nStudent: ${userQuestion}`
      : `Student: ${userQuestion}`;

    // Try Groq first (faster + more generous free tier)
    if (activeKey.startsWith("gsk_") || body.provider === "groq") {
      try {
        const groqModels = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "mixtral-8x7b-32768"];
        for (const modelName of groqModels) {
          const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
            { role: "system", content: sysPrompt },
            ...recentHistory.map((m) => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 200) })),
            { role: "user" as const, content: userQuestion },
          ];
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${activeKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: modelName,
              messages,
              max_tokens: 250,
              temperature: 0.7,
            }),
          });
          if (!res.ok) {
            const errText = await res.text();
            if (errText.includes("429") || errText.includes("rate")) continue;
            continue;
          }
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content?.trim() || "";
          if (text) {
            const tokensUsed = data.usage?.total_tokens || Math.ceil((sysPrompt.length + userMsg.length + text.length) / 4);
            return c.json({ hint: text, model: modelName, provider: "groq", tokensUsed });
          }
        }
        throw new Error("All Groq models failed");
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : "";
        if (errMsg.includes("429") || errMsg.includes("rate")) {
          throw new Error("Groq rate limited. Try again in 1 minute.");
        }
        // Fall through to Gemini
      }
    }

    // Fall back to Gemini
    if (!activeKey.startsWith("gsk_") && activeKey.startsWith("AIza")) {
      const geminiGenAI = new GoogleGenerativeAI(activeKey);
      const models = ["gemini-1.5-flash-8b", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest", "gemini-pro-latest"];
      let lastError = null;
      for (const modelName of models) {
        try {
          const result = await geminiGenAI.getGenerativeModel({ model: modelName, systemInstruction: sysPrompt })
            .generateContent(userMsg);
          const text = result.response.text();
          const tokensUsed = Math.ceil((sysPrompt.length + userMsg.length + text.length) / 4);
          return c.json({ hint: text, model: modelName, provider: "gemini", tokensUsed });
        } catch (e) {
          lastError = e;
          const errMsg = e instanceof Error ? e.message : "";
          if (errMsg.includes("429") || errMsg.includes("quota")) break;
          continue;
        }
      }
      throw lastError || new Error("All Gemini models failed");
    }

    throw new Error("No valid API key. Get a free Groq key at https://console.groq.com/ (starts with gsk_) or use a Gemini key (starts with AIza).");
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