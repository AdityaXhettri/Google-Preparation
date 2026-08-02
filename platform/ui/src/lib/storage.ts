/**
 * localStorage wrapper for prep progress tracking.
 * Fully offline, no DB needed.
 */

const PREFIX = "gprep:";

export function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function set<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {}
}

export type Attempt = {
  id: string;
  problemId: string;
  pattern: string;
  difficulty: "easy" | "medium" | "hard";
  startedAt: number;
  finishedAt?: number;
  solved: boolean;
  retries: number;
  hintsUsed?: number;
  notes?: string;
};

export type ReadNote = { path: string; readAt: number };

export type BehavioralAttempt = {
  id: string;
  question: string;
  startedAt: number;
  durationSec: number;
  audioBlobUrl?: string;
  selfRating?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
};

export type SystemDesignAttempt = {
  id: string;
  problemId: string;
  startedAt: number;
  durationSec: number;
  notes: string;
  checklistScore?: number;
};

export type HintMsg = { role: "user" | "assistant"; content: string; ts: number };
export type HintStat = { count: number; lastUsed: number };
export type SR = { lastSolved: number; nextDue: number; interval: number; reviewCount: number };

export const storage = {
  // ---- DSA attempts ----
  getAttempts: (): Attempt[] => get("attempts", []),
  addAttempt: (a: Attempt) => set("attempts", [...storage.getAttempts(), a]),
  updateAttempt: (id: string, patch: Partial<Attempt>) => {
    const all = storage.getAttempts();
    const idx = all.findIndex((a) => a.id === id);
    if (idx >= 0) all[idx] = { ...all[idx], ...patch };
    set("attempts", all);
  },

  // ---- Notes read ----
  getReadNotes: (): ReadNote[] => get("readNotes", []),
  markRead: (path: string) => {
    const all = storage.getReadNotes();
    if (!all.find((r) => r.path === path)) {
      set("readNotes", [...all, { path, readAt: Date.now() }]);
    }
  },
  isRead: (path: string): boolean =>
    storage.getReadNotes().some((r) => r.path === path),

  // ---- Behavioral ----
  getBehavioral: (): BehavioralAttempt[] => get("behavioral", []),
  addBehavioral: (b: BehavioralAttempt) =>
    set("behavioral", [...storage.getBehavioral(), b]),

  // ---- System design ----
  getSystemDesign: (): SystemDesignAttempt[] => get("systemDesign", []),
  addSystemDesign: (s: SystemDesignAttempt) =>
    set("systemDesign", [...storage.getSystemDesign(), s]),

  // ---- Streak ----
  getStreak: (): { current: number; lastDay: string } =>
    get("streak", { current: 0, lastDay: "" }),
  recordActivity: () => {
    const today = new Date().toISOString().slice(0, 10);
    const streak = storage.getStreak();
    if (streak.lastDay === today) return streak;
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    const newCurrent = streak.lastDay === yesterday ? streak.current + 1 : 1;
    const next = { current: newCurrent, lastDay: today };
    set("streak", next);
    return next;
  },

  // ---- Hint sessions (per-problem chat with hint bot) ----
  getHints: (problemId: string): HintMsg[] => get(`hints_${problemId}`, []),
  saveHints: (problemId: string, msgs: HintMsg[]) => set(`hints_${problemId}`, msgs),

  // ---- Hint usage counter (signal of difficulty) ----
  getHintStats: (problemId: string): HintStat => get(`hintstats_${problemId}`, { count: 0, lastUsed: 0 }),
  bumpHint: (problemId: string) => {
    const cur = storage.getHintStats(problemId);
    set(`hintstats_${problemId}`, { count: cur.count + 1, lastUsed: Date.now() });
  },

  // ---- Spaced repetition ----
  // First review in 1 day, then 3, 7, 30 days
  getSR: (problemId: string): SR => get(`sr_${problemId}`, { lastSolved: 0, nextDue: 0, interval: 0, reviewCount: 0 }),
  scheduleSR: (problemId: string): SR => {
    const cur = storage.getSR(problemId);
    const intervals = [1, 3, 7, 30];
    const nextInterval = cur.reviewCount < intervals.length ? intervals[cur.reviewCount] : 30;
    const next: SR = {
      lastSolved: Date.now(),
      nextDue: Date.now() + nextInterval * 86_400_000,
      interval: nextInterval,
      reviewCount: cur.reviewCount + 1,
    };
    set(`sr_${problemId}`, next);
    return next;
  },
  dueProblems: (allProblemIds: string[]): string[] => {
    const now = Date.now();
    return allProblemIds.filter((id) => {
      const sr = storage.getSR(id);
      return sr.lastSolved > 0 && sr.nextDue <= now;
    });
  },
};