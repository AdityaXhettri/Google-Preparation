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

export const storage = {
  getAttempts: (): Attempt[] => get("attempts", []),
  addAttempt: (a: Attempt) => set("attempts", [...storage.getAttempts(), a]),
  updateAttempt: (id: string, patch: Partial<Attempt>) => {
    const all = storage.getAttempts();
    const idx = all.findIndex((a) => a.id === id);
    if (idx >= 0) all[idx] = { ...all[idx], ...patch };
    set("attempts", all);
  },
  getReadNotes: (): ReadNote[] => get("readNotes", []),
  markRead: (path: string) => {
    const all = storage.getReadNotes();
    if (!all.find((r) => r.path === path)) {
      set("readNotes", [...all, { path, readAt: Date.now() }]);
    }
  },
  isRead: (path: string): boolean =>
    storage.getReadNotes().some((r) => r.path === path),
  getBehavioral: (): BehavioralAttempt[] => get("behavioral", []),
  addBehavioral: (b: BehavioralAttempt) =>
    set("behavioral", [...storage.getBehavioral(), b]),
  getSystemDesign: (): SystemDesignAttempt[] => get("systemDesign", []),
  addSystemDesign: (s: SystemDesignAttempt) =>
    set("systemDesign", [...storage.getSystemDesign(), s]),
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
};