import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PATTERN_META, DIFFICULTY_LABELS, DIFFICULTY_COLORS, type PatternMeta } from "../lib/pattern-meta";
import { PROBLEMS } from "../lib/problems";
import { storage } from "../lib/storage";

type Progress = { solved: number; attempted: number };

export function DSAPatternsPage() {
  const [progress, setProgress] = useState<Record<string, Progress>>({});

  useEffect(() => {
    const attempts = storage.getAttempts();
    const map: Record<string, Progress> = {};
    for (const pattern of PATTERN_META) {
      const ps = attempts.filter((a) => a.pattern === pattern.slug);
      map[pattern.slug] = {
        solved: ps.filter((a) => a.solved).length,
        attempted: ps.length,
      };
    }
    setProgress(map);
  }, []);

  const totalSolved = Object.values(progress).reduce((s, p) => s + p.solved, 0);
  const patternsStarted = Object.values(progress).filter((p) => p.attempted > 0).length;

  const groups: Array<{ key: PatternMeta["difficulty"]; label: string; patterns: PatternMeta[] }> = [
    { key: "core", label: "Core patterns (master these first)", patterns: PATTERN_META.filter((p) => p.difficulty === "core") },
    { key: "advanced", label: "Advanced (L4+ expectation)", patterns: PATTERN_META.filter((p) => p.difficulty === "advanced") },
    { key: "specialized", label: "Specialized (rare but show up)", patterns: PATTERN_META.filter((p) => p.difficulty === "specialized") },
  ];

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🎯</span>
          <h1 className="text-4xl font-bold tracking-tight">DSA Patterns</h1>
        </div>
        <p className="text-zinc-500 max-w-2xl">
          Learn patterns, not problems. Master all {PATTERN_META.length} to ace coding interviews.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Patterns started" value={`${patternsStarted}/${PATTERN_META.length}`} />
        <Stat label="Problems solved" value={`${totalSolved}/${PROBLEMS.length}`} accent="text-emerald-600 dark:text-emerald-400" />
        <Stat label="Total patterns" value={`${PATTERN_META.length}`} />
        <Stat label="Total problems" value={`${PROBLEMS.length}`} />
      </section>

      {groups.map((g) => (
        <section key={g.key} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">{g.label}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[g.key]}`}>
              {DIFFICULTY_LABELS[g.key]}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {g.patterns.map((p) => {
              const prog = progress[p.slug] ?? { solved: 0, attempted: 0 };
              const total = PROBLEMS.filter((pr) => pr.pattern === p.slug).length;
              const pct = total > 0 ? (prog.solved / total) * 100 : 0;
              return (
                <Link
                  key={p.slug}
                  to={`/dsa/${p.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition shadow-sm hover:shadow-lg"
                >
                  <div className={`h-2 bg-gradient-to-r ${p.color}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{p.emoji}</div>
                      <div className="text-xs font-mono text-zinc-400">#{String(p.number).padStart(2, "0")}</div>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{p.title}</h3>
                    <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{p.tagline}</p>
                    <div className="flex justify-between items-center text-xs text-zinc-500 mb-2">
                      <span>{prog.solved}/{total} solved</span>
                      <span>{prog.attempted > 0 ? `${Math.round(pct)}%` : "Not started"}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${p.color} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <section className="mt-12 text-center">
        <Link to="/practice/dsa" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90">
          🎲 Solve a random problem →
        </Link>
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
      <div className="text-xs text-zinc-500 uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${accent ?? ""}`}>{value}</div>
    </div>
  );
}