import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PATTERN_META, getPatternMeta, DIFFICULTY_COLORS } from "../lib/pattern-meta";
import { PROBLEMS } from "../lib/problems";
import { storage } from "../lib/storage";
import { getNote } from "../lib/notes";

export function PatternDetailPage() {
  const params = useParams();
  const slug = params.pattern as string;
  const meta = getPatternMeta(slug);
  const [content, setContent] = useState<string>("");
  const [progress, setProgress] = useState({ solved: 0, attempted: 0 });

  useEffect(() => {
    const attempts = storage.getAttempts().filter((a) => a.pattern === slug);
    setProgress({
      solved: attempts.filter((a) => a.solved).length,
      attempted: attempts.length,
    });
  }, [slug]);

  useEffect(() => {
    if (!meta) return;
    const text = getNote(`dsa-patterns/${slug}/README.md`);
    setContent(text ?? `*No README found for ${slug}.*\n\nExpected at: Google-Preparation/dsa-patterns/${slug}/README.md`);
  }, [slug, meta]);

  if (!meta) {
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Pattern not found</h1>
        <Link to="/dsa" className="text-blue-600 underline">← Back to all patterns</Link>
      </div>
    );
  }

  const patternProblems = PROBLEMS.filter((p) => p.pattern === slug);
  const solved = progress.solved;
  const total = patternProblems.length;
  const pct = total > 0 ? (solved / total) * 100 : 0;

  const idx = PATTERN_META.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? PATTERN_META[idx - 1] : null;
  const next = idx < PATTERN_META.length - 1 ? PATTERN_META[idx + 1] : null;

  return (
    <div className="min-h-screen">
      <header className={`relative overflow-hidden bg-gradient-to-br ${meta.color} text-white`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-5xl mx-auto px-8 py-12">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
            <Link to="/dsa" className="hover:text-white">DSA Patterns</Link>
            <span>›</span>
            <span>#{String(meta.number).padStart(2, "0")}</span>
          </div>
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">{meta.emoji}</div>
            <div className="flex-1">
              <div className="text-sm font-mono opacity-80 mb-1">PATTERN {String(meta.number).padStart(2, "0")}</div>
              <h1 className="text-4xl font-bold mb-2">{meta.title}</h1>
              <p className="text-lg opacity-90">{meta.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">
              {DIFFICULTY_COLORS[meta.difficulty].split(" ")[0].replace("bg-", "").replace("-100", "")}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">{solved}/{total} solved</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">{progress.attempted} attempts</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-8">
        <section className="mb-8 p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <span>💡</span> When to use
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{meta.when}</p>
        </section>

        <section className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Your progress</h3>
              <span className="text-sm text-zinc-500">{Math.round(pct)}%</span>
            </div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
              <div className={`h-full bg-gradient-to-r ${meta.color} transition-all`} style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-zinc-500">
              {solved === 0 ? "Start by solving your first problem below." :
               solved === total ? "🎉 Mastered! Move to the next pattern." :
               `Keep going — ${total - solved} more to master.`}
            </p>
          </div>
          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-2">Practice this pattern</h3>
              <p className="text-xs text-zinc-500 mb-3">Pick a problem to solve right now.</p>
            </div>
            <Link to={`/practice/dsa?pattern=${meta.slug}`} className={`block text-center px-4 py-2 rounded-lg bg-gradient-to-r ${meta.color} text-white font-medium hover:opacity-90`}>
              🎲 Solve a random one
            </Link>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Problems in this pattern</h2>
          {patternProblems.length === 0 ? (
            <div className="p-8 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-center text-zinc-500">
              No practice problems yet. Add some in <code className="text-xs">src/lib/problems.ts</code>.
            </div>
          ) : (
            <div className="space-y-2">
              {patternProblems.map((p) => {
                const attempted = storage.getAttempts().some((a) => a.problemId === p.id);
                const solvedP = storage.getAttempts().some((a) => a.problemId === p.id && a.solved);
                return (
                  <Link
                    key={p.id}
                    to={`/practice/dsa?pattern=${meta.slug}&problem=${p.id}`}
                    className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{solvedP ? "✅" : attempted ? "🔄" : "⚪"}</span>
                      <div>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-zinc-500">{p.leetcode ? `LC #${p.leetcode} · ` : ""}{p.difficulty}</div>
                      </div>
                    </div>
                    <span className="text-zinc-400">→</span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pattern notes</h2>
          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
            {content ? (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            ) : (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
              </div>
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4 mb-8">
          {prev ? (
            <Link to={`/dsa/${prev.slug}`} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:border-zinc-400 transition flex items-center gap-3">
              <div className="text-2xl">←</div>
              <div>
                <div className="text-xs text-zinc-500">Previous</div>
                <div className="font-medium">{prev.emoji} {prev.title}</div>
              </div>
            </Link>
          ) : <div />}
          {next ? (
            <Link to={`/dsa/${next.slug}`} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:border-zinc-400 transition flex items-center gap-3 md:text-right md:flex-row-reverse">
              <div className="text-2xl">→</div>
              <div>
                <div className="text-xs text-zinc-500">Next</div>
                <div className="font-medium">{next.emoji} {next.title}</div>
              </div>
            </Link>
          ) : <div />}
        </section>
      </div>
    </div>
  );
}