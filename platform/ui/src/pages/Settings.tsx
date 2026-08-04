import { useState } from "react";

type Provider = "groq" | "gemini";
const KEY_STORAGE = "ai_api_key_v2";
const PROVIDER_STORAGE = "ai_provider_v2";

export function Settings() {
  const [provider, setProvider] = useState<Provider>(
    (localStorage.getItem(PROVIDER_STORAGE) as Provider) || "groq"
  );
  const [key, setKey] = useState(localStorage.getItem(KEY_STORAGE) || "");
  const [status, setStatus] = useState<"idle" | "testing" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const test = async () => {
    if (!key.trim()) {
      setStatus("error");
      setMessage("Please paste an API key first");
      return;
    }
    setStatus("testing");
    setMessage(`Testing ${provider} key...`);
    try {
      const endpoint = provider === "groq" ? "/api/test-groq" : "/api/test-gemini";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("ok");
        setMessage(`✅ Key works! ${provider} replied: "${data.response || "OK"}" (using ${data.model})`);
        localStorage.setItem(KEY_STORAGE, key.trim());
        localStorage.setItem(PROVIDER_STORAGE, provider);
      } else {
        setStatus("error");
        setMessage(`❌ ${data.error || "Key didn't work"}`);
      }
    } catch (e) {
      setStatus("error");
      setMessage(`❌ Network error: ${e instanceof Error ? e.message : "unknown"}`);
    }
  };

  const save = () => {
    localStorage.setItem(KEY_STORAGE, key.trim());
    localStorage.setItem(PROVIDER_STORAGE, provider);
    setStatus("ok");
    setMessage("✅ Saved (untested)");
  };

  const clear = () => {
    localStorage.removeItem(KEY_STORAGE);
    localStorage.removeItem(PROVIDER_STORAGE);
    setKey("");
    setStatus("idle");
    setMessage("Cleared. The hint bot will use offline mode.");
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">⚙️ Settings</h1>
        <p className="text-zinc-500 mt-1">Configure your AI API key for the hint tutor.</p>
      </div>

      <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 mb-4">
        <h2 className="font-semibold text-lg mb-3">🤖 Choose AI Provider</h2>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => setProvider("groq")}
            className={`p-3 rounded-lg border-2 text-left ${
              provider === "groq"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <div className="font-semibold">⚡ Groq (Recommended)</div>
            <div className="text-xs text-zinc-500 mt-1">
              14,400 free requests/day, super fast (~0.5s)
            </div>
          </button>
          <button
            onClick={() => setProvider("gemini")}
            className={`p-3 rounded-lg border-2 text-left ${
              provider === "gemini"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <div className="font-semibold">🌟 Google Gemini</div>
            <div className="text-xs text-zinc-500 mt-1">
              Free tier (quota may be limited in some regions)
            </div>
          </button>
        </div>

        <h2 className="font-semibold text-lg mb-2">🔑 API Key</h2>
        {provider === "groq" ? (
          <p className="text-sm text-zinc-500 mb-4">
            Get a free key at{" "}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              console.groq.com/keys
            </a>
            . The key should start with <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">gsk_</code>.
          </p>
        ) : (
          <p className="text-sm text-zinc-500 mb-4">
            Get a free key at{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              aistudio.google.com/apikey
            </a>
            . The key should start with <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">AIzaSy</code>.
          </p>
        )}

        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={provider === "groq" ? "gsk_..." : "AIzaSy..."}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-mono text-sm bg-white dark:bg-zinc-950 mb-3"
        />

        <div className="flex gap-2 mb-3">
          <button
            onClick={test}
            disabled={status === "testing"}
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded font-medium disabled:opacity-50"
          >
            {status === "testing" ? "Testing..." : "🧪 Test key"}
          </button>
          <button
            onClick={save}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-medium"
          >
            💾 Save
          </button>
          <button
            onClick={clear}
            className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded font-medium"
          >
            🗑 Clear
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded text-sm ${
              status === "ok"
                ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                : status === "error"
                ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
                : "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-600 dark:text-zinc-400">
        <strong>💡 Why Groq?</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>14,400 free requests/day (vs Gemini's often-limited quota)</li>
          <li>Super fast inference (~500ms responses)</li>
          <li>OpenAI-compatible API (easy to use)</li>
          <li>Multiple models: Llama 3.1, Mixtral, Gemma</li>
          <li>Your key is stored in your browser's localStorage only</li>
        </ul>
      </div>
    </div>
  );
}