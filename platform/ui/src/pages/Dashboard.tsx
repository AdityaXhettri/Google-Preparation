import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../lib/storage";
import { PROBLEMS, PATTERNS } from "../lib/problems";
import { BEHAVIORAL, ATTRIBUTE_LABELS } from "../lib/behavioral";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    streak: { current: 0, lastDay: "" },
    attempts: [] as ReturnType<typeof storage.getAttempts>,
    readCount: 0,
    behavioralCount: 0,
    sdCount: 0,
  });

  useEffect(() => {
    setMounted(true);
    setStats({
      streak: storage.getStreak(),
      attempts: storage.getAttempts(),
      readCount: storage.getReadNotes().length,
      behavioralCount: storage.getBehavioral().length,
      sdCount: storage.getSystemDesign().length,
    });
  }, []);

  if (!mounted) return <div className="p-8 text-zinc-500">Loading…</div>;

  const patternData = PATTERNS.map((p) => ({
    name: p.replace(/^\d+-/, ""),
    solved: stats.attempts.filter((a) => a.pattern === p && a.solved).length,
    total: PROBLEMS.filter((pr) => pr.pattern === p).length,
  }));

  const totalSolved = stats.attempts.filter((a) => a.solved).length;
  const totalAvailable = PROBLEMS.length;

  const behavioralData = (Object.keys(ATTRIBUTE_LABELS) as Array<keyof typeof ATTRIBUTE_LABELS>).map((attr) => {
    const practiced = storage.getBehavioral().filter((b) => {
      const q = BEHAVIORAL.find((x) => x.id === b.id);
      return q?.attribute === attr;
    }).length;
    return { name: ATTRIBUTE_LABELS[attr], practiced };
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Your Google L4 prep at a glance.</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Streak" value={`${stats.streak.current}d`} sub={stats.streak.lastDay || "—"} />
        <StatCard label="DSA Solved" value={`${totalSolved}/${totalAvailable}`} sub="across patterns" />
        <StatCard label="Notes Read" value={stats.readCount.toString()} sub="markdown pages" />
        <StatCard label="Sessions" value={`${stats.behavioralCount + stats.sdCount}`} sub="behavioral + design" />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Pattern Coverage</h2>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patternData}>
              <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="solved" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Googleyness Coverage</h2>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={behavioralData} layout="vertical">
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="practiced" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <QuickAction href="/practice/dsa" title="Solve a DSA problem" subtitle="Random problem, timed" emoji="💻" />
          <QuickAction href="/practice/system-design" title="Practice system design" subtitle="45-min mock" emoji="🏗️" />
          <QuickAction href="/practice/behavioral" title="Behavioral drill" subtitle="2-min STAR practice" emoji="🎤" />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        {stats.attempts.length === 0 && stats.behavioralCount === 0 && stats.sdCount === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 text-center text-zinc-500">
            No activity yet. Start with a quick action above ↑
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            {stats.attempts.slice(-5).reverse().map((a) => (
              <div key={a.id} className="p-3 text-sm flex justify-between">
                <span>{a.solved ? "✅" : "❌"} {a.pattern} ({a.difficulty})</span>
                <span className="text-zinc-500">{new Date(a.startedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
      <div className="text-xs text-zinc-500 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{sub}</div>
    </div>
  );
}

function QuickAction({ href, title, subtitle, emoji }: { href: string; title: string; subtitle: string; emoji: string }) {
  return (
    <Link to={href} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition">
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-zinc-500 mt-1">{subtitle}</div>
    </Link>
  );
}