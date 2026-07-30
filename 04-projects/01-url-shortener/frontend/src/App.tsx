import { useState } from "react";

type ShortenResponse = {
  shortId: string;
  shortUrl: string;
  longUrl: string;
};

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Error ${res.status}`);
        return;
      }
      const data = (await res.json()) as ShortenResponse;
      setResult(data);
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "0 1rem", fontFamily: "system-ui" }}>
      <h1>URL Shortener</h1>
      <p style={{ color: "#666" }}>Demo built with Bun + Hono + Postgres + Redis.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <input
          type="url"
          required
          placeholder="https://example.com/some/long/url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: "0.6rem", border: "1px solid #ccc", borderRadius: 6 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.6rem 1rem", background: "#000", color: "#fff", border: "none", borderRadius: 6 }}
        >
          {loading ? "..." : "Shorten"}
        </button>
      </form>

      {error && <p style={{ color: "crimson", marginTop: 12 }}>Error: {error}</p>}

      {result && (
        <div style={{ marginTop: 24, padding: 16, background: "#f4f4f4", borderRadius: 8 }}>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>Short URL:</p>
          <a href={result.shortUrl} style={{ fontSize: 18, fontWeight: 600 }}>
            {result.shortUrl}
          </a>
          <p style={{ marginTop: 12, color: "#666", fontSize: 12 }}>→ {result.longUrl}</p>
        </div>
      )}
    </main>
  );
}