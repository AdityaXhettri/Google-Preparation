/**
 * Pattern recommendation engine.
 * Analyzes attempts and gives personalized suggestions.
 */

import { PROBLEMS, type Problem } from "./problems";
import { PATTERN_META } from "./pattern-meta";
import { storage, type Attempt } from "./storage";

export type Insight = {
  type: "weak-pattern" | "slow-medium" | "fast-hard" | "needs-spaced" | "ready-mock" | "streak";
  title: string;
  description: string;
  action?: { label: string; href: string };
  emoji: string;
};

export function generateInsights(): Insight[] {
  const attempts = storage.getAttempts();
  const streak = storage.getStreak();
  const insights: Insight[] = [];

  if (attempts.length === 0) {
    return [{
      type: "weak-pattern",
      title: "Welcome!",
      description: "Solve your first problem to start getting personalized insights.",
      action: { label: "Start with Sliding Window", href: "/dsa/01-sliding-window" },
      emoji: "👋",
    }];
  }

  // 1. Weak pattern detection
  const byPattern: Record<string, Attempt[]> = {};
  for (const a of attempts) {
    (byPattern[a.pattern] ??= []).push(a);
  }

  let weakest: { pattern: string; solved: number; total: number; rate: number } | null = null;
  for (const [pattern, ps] of Object.entries(byPattern)) {
    const total = PROBLEMS.filter((p) => p.pattern === pattern).length;
    const solved = ps.filter((a) => a.solved).length;
    const rate = total > 0 ? solved / total : 0;
    if (total > 0 && (!weakest || rate < weakest.rate)) {
      weakest = { pattern, solved, total, rate };
    }
  }

  if (weakest && weakest.solved < weakest.total && weakest.rate < 0.5) {
    const meta = PATTERN_META.find((p) => p.slug === weakest!.pattern);
    insights.push({
      type: "weak-pattern",
      title: `Weak: ${meta?.title ?? weakest.pattern}`,
      description: `Only ${weakest.solved}/${weakest.total} solved. Drill this pattern.`,
      action: { label: "Practice now", href: `/dsa/${weakest.pattern}` },
      emoji: meta?.emoji ?? "📉",
    });
  }

  // 2. Speed analysis: easy fast, medium slow
  const mediums = attempts.filter((a) => a.difficulty === "medium" && a.solved && a.finishedAt);
  if (mediums.length >= 3) {
    const avgMediumMin = mediums.reduce((s, a) => s + (a.finishedAt! - a.startedAt) / 60_000, 0) / mediums.length;
    if (avgMediumMin > 35) {
      insights.push({
        type: "slow-medium",
        title: "Slow on mediums",
        description: `Your average medium time is ${avgMediumMin.toFixed(0)} min. Target: 25 min.`,
        action: { label: "Drill mediums", href: "/practice/dsa" },
        emoji: "⏱️",
      });
    }
  }

  // 3. Hards fast but mediums slow (unusual, worth flagging)
  const hards = attempts.filter((a) => a.difficulty === "hard" && a.solved && a.finishedAt);
  if (mediums.length >= 3 && hards.length >= 1) {
    const avgHard = hards.reduce((s, a) => s + (a.finishedAt! - a.startedAt) / 60_000, 0) / hards.length;
    const avgMedium = mediums.reduce((s, a) => s + (a.finishedAt! - a.startedAt) / 60_000, 0) / mediums.length;
    if (avgHard < avgMedium * 0.7) {
      insights.push({
        type: "fast-hard",
        title: "Inverted speed curve",
        description: `You solve hards faster than mediums (${avgHard.toFixed(0)} vs ${avgMedium.toFixed(0)} min). Check your medium-level pattern coverage.`,
        emoji: "🔍",
      });
    }
  }

  // 4. Spaced repetition
  const allIds = PROBLEMS.map((p) => p.id);
  const due = storage.dueProblems(allIds);
  if (due.length > 0) {
    const sample = due.slice(0, 3);
    insights.push({
      type: "needs-spaced",
      title: `${due.length} problem${due.length === 1 ? "" : "s"} due for review`,
      description: `Spaced repetition: solve ${sample.join(", ")} to retain them.`,
      action: { label: "Review now", href: "/practice/dsa" },
      emoji: "🔁",
    });
  }

  // 5. Mock interview ready
  const totalSolved = attempts.filter((a) => a.solved).length;
  if (totalSolved >= 20 && streak.current >= 3) {
    insights.push({
      type: "ready-mock",
      title: "Ready for mock interview?",
      description: `You've solved ${totalSolved} problems and have a ${streak.current}-day streak. Try a full mock.`,
      action: { label: "Start mock interview", href: "/mock" },
      emoji: "🎤",
    });
  }

  // 6. Streak
  if (streak.current >= 1) {
    insights.push({
      type: "streak",
      title: `${streak.current}-day streak!`,
      description: streak.current >= 7 ? "You're in the zone. Keep going." : "Solve one more today to keep it alive.",
      emoji: "🔥",
    });
  }

  return insights;
}

/**
 * Get recommended next problems to solve.
 * Prioritizes: weak patterns > due for review > new problems.
 */
export function recommendNext(count = 3): Problem[] {
  const attempts = storage.getAttempts();
  const solvedIds = new Set(attempts.filter((a) => a.solved).map((a) => a.problemId));

  // 1. Due for spaced repetition
  const allIds = PROBLEMS.map((p) => p.id);
  const due = storage.dueProblems(allIds)
    .map((id) => PROBLEMS.find((p) => p.id === id))
    .filter((p): p is Problem => !!p);
  if (due.length >= count) return due.slice(0, count);

  // 2. Weak patterns
  const byPattern: Record<string, number> = {};
  for (const a of attempts) {
    if (a.solved) byPattern[a.pattern] = (byPattern[a.pattern] ?? 0) + 1;
  }
  const patternPool: Problem[] = [];
  for (const meta of PATTERN_META) {
    const ps = PROBLEMS.filter((p) => p.pattern === meta.slug);
    const solved = byPattern[meta.slug] ?? 0;
    if (solved < ps.length) {
      // Add unsolved ones from this pattern
      patternPool.push(...ps.filter((p) => !solvedIds.has(p.id)));
    }
  }
  // Sort by least-solved pattern first
  patternPool.sort((a, b) => {
    const sa = byPattern[a.pattern] ?? 0;
    const sb = byPattern[b.pattern] ?? 0;
    return sa - sb;
  });

  return [...due, ...patternPool].slice(0, count);
}