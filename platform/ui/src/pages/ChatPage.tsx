import { useState } from "react";

type Source = { path: string; similarity: number; snippet: string };
type ChatResponse = { answer?: string; sources?: Source[]; sessionId?: string; error?: string };

const SUGGESTED = [
  "What's the cache-aside pattern?",
  "Explain sliding window technique",
  "How do I write a STAR story?",
  "What should I include in a system design answer?",
];

export function ChatPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [error, setError] = useState<string | null>(null);

  const ask = async (q?: string) => {
    const query = (q ?? question).trim();
    if (!query || loading) return;

    setQuestion(query);
    setLoading(true);
    setError(null);
    setAnswer("");
    setSources([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      const data = (await res.json()) as ChatResponse;

      if (!res.ok || data.error) {
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setAnswer(data.answer ?? "");
      setSources(data.sources ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-8 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">💬 Ask the Prep Assistant</h1>
        <p className="text-zinc-500 mt-1">RAG over your prep notes. Powered by Gemini.</p>
      </header>

      <section className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="What's the cache-aside pattern?"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
          <button onClick={() => ask()} disabled={loading || !question.trim()} className="px-6 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium disabled:opacity-50">
            {loading ? "..." : "Ask"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">Error: {error}</p>}
      </section>

      <section className="mb-8">
        <p className="text-sm text-zinc-500 mb-2">Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED.map((s) => (
            <button key={s} onClick={() => ask(s)} disabled={loading} className="text-sm px-3 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50">
              {s}
            </button>
          ))}
        </div>
      </section>

      {answer && (
        <section className="p-6 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-500 mb-3">ANSWER</h2>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">{answer}</div>
          {sources.length > 0 && (
            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-500 mb-2">SOURCES ({sources.length})</h3>
              <ul className="space-y-2">
                {sources.map((s, i) => (
                  <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-mono text-zinc-500">[{i + 1}]</span>{" "}
                    <span className="font-medium">{s.path}</span>{" "}
                    <span className="text-zinc-400">({(s.similarity * 100).toFixed(0)}% match)</span>
                    <p className="mt-1 italic line-clamp-2">{s.snippet}...</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}