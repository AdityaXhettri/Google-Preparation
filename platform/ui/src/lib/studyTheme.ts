/**
 * Demon Slayer theme for the Study section.
 * - Tier definitions (Final Selection → Hashira)
 * - Boss battle data per pattern
 * - Demon Rank progression
 * - Achievement definitions
 */

export type Tier = 0 | 1 | 2 | 3;

export type TierMeta = {
  level: Tier;
  name: string;
  emoji: string;
  description: string;
  // CSS color classes for the card border
  borderClass: string;
  glowClass: string;
  // Class to add to card for the "level-up" celebration
  auraClass: string;
};

export const TIERS: Record<Tier, TierMeta> = {
  0: {
    level: 0,
    name: "Final Selection",
    emoji: "🩸",
    description: "A new demon slayer enters the mountain. The journey begins.",
    borderClass: "border-zinc-600",
    glowClass: "",
    auraClass: "",
  },
  1: {
    level: 1,
    name: "Wounded",
    emoji: "🩸",
    description: "Wounded but standing. Time to hone your breathing.",
    borderClass: "border-red-800",
    glowClass: "shadow-[0_0_15px_rgba(220,38,38,0.3)]",
    auraClass: "",
  },
  2: {
    level: 2,
    name: "Hinokami Kagura",
    emoji: "🔥",
    description: "The sun breathing has awakened within you.",
    borderClass: "border-amber-500",
    glowClass: "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
    auraClass: "animate-pulse",
  },
  3: {
    level: 3,
    name: "Hashira",
    emoji: "⚔️",
    description: "You have mastered this technique. A pillar of the Corps.",
    borderClass: "border-amber-400",
    glowClass: "shadow-[0_0_25px_rgba(245,158,11,0.6)]",
    auraClass: "animate-pulse",
  },
};

// ---- Boss Battle Data ----
export type Boss = {
  pattern: string;
  name: string; // Demon name (themed)
  rank: string; // "Lower Moon X" / "Upper Moon X" / "Muzan"
  maxHp: number; // Total cards in the pattern
};

export const BOSSES: Boss[] = [
  { pattern: "01-sliding-window", name: "Kasugai Crow", rank: "Lower Moon", maxHp: 6 },
  { pattern: "02-two-pointers", name: "Temple Demon", rank: "Lower Moon", maxHp: 8 },
  { pattern: "03-fast-slow-pointers", name: "Swamp Demon", rank: "Lower Moon", maxHp: 6 },
  { pattern: "04-merge-intervals", name: "Tongue Demon", rank: "Lower Moon", maxHp: 6 },
  { pattern: "05-cyclic-sort", name: "Hand Demon", rank: "Lower Moon", maxHp: 5 },
  { pattern: "06-linkedlist-reversal", name: "Temple Trio", rank: "Lower Moon", maxHp: 5 },
  { pattern: "07-tree-bfs", name: "Kyogai (Former Upper)", rank: "Lower Moon", maxHp: 6 },
  { pattern: "08-tree-dfs", name: "Spider Demon (Father)", rank: "Lower Moon", maxHp: 6 },
  { pattern: "09-two-heaps", name: "Rui (Spider Demon)", rank: "Upper Moon", maxHp: 4 },
  { pattern: "10-subsets-backtracking", name: "Enmu (Lower Moon One)", rank: "Lower Moon", maxHp: 5 },
  { pattern: "11-binary-search", name: "Akaza (Upper Moon Three)", rank: "Upper Moon", maxHp: 6 },
  { pattern: "12-top-k-elements", name: "Doma (Upper Moon Two)", rank: "Upper Moon", maxHp: 5 },
  { pattern: "13-k-way-merge", name: "Hantengu (Upper Moon Four)", rank: "Upper Moon", maxHp: 4 },
  { pattern: "14-dynamic-programming", name: "Kokushibo (Upper Moon One)", rank: "Upper Moon", maxHp: 8 },
  { pattern: "15-greedy", name: "Gyutaro (Upper Moon Six)", rank: "Upper Moon", maxHp: 4 },
  { pattern: "16-graphs-topological-sort", name: "Daki (Upper Moon Six)", rank: "Upper Moon", maxHp: 3 },
  { pattern: "17-union-find", name: "Muzan Kibutsuji", rank: "Demon King", maxHp: 5 },
  { pattern: "18-trie", name: "Tamayo (Demon Ally)", rank: "Ally", maxHp: 3 },
];

export function getBossForPattern(pattern: string): Boss | undefined {
  return BOSSES.find((b) => b.pattern === pattern);
}

// ---- Demon Rank (overall level) ----
export type DemonRank = {
  name: string;
  emoji: string;
  minCards: number;
};

export const DEMON_RANKS: DemonRank[] = [
  { name: "Mizunoto", emoji: "🌱", minCards: 0 },
  { name: "Demon Slayer", emoji: "🗡️", minCards: 10 },
  { name: "Hashira Candidate", emoji: "⭐", minCards: 50 },
  { name: "Hashira", emoji: "⚔️", minCards: 150 },
  { name: "Yoriichi Type Zero", emoji: "👑", minCards: 500 },
];

export function getDemonRank(masteredCount: number): DemonRank {
  let rank = DEMON_RANKS[0];
  for (const r of DEMON_RANKS) {
    if (masteredCount >= r.minCards) rank = r;
  }
  return rank;
}

// ---- Themed button labels ----
export const RATE_LABELS: Record<Tier, { name: string; emoji: string; desc: string }> = {
  0: { name: "Slashed by demon", emoji: "🩸", desc: "Card resets. Back to training." },
  1: { name: "Wounded", emoji: "🩸", desc: "You survived but need to study more." },
  2: { name: "Cleaned cut", emoji: "⚔️", desc: "You know this. Moving forward." },
  3: { name: "Demon Slayer Mark", emoji: "👁️", desc: "Mastered. Won't forget easily." },
};

export const STREAK_LABELS = [
  { days: 0, emoji: "🕯️", label: "No flame" },
  { days: 1, emoji: "🔥", label: "Total Concentration: 1 day" },
  { days: 3, emoji: "🔥", label: "Total Concentration: 3 days" },
  { days: 7, emoji: "🌋", label: "Total Concentration: 1 week" },
  { days: 14, emoji: "☀️", label: "Total Concentration: 2 weeks" },
  { days: 30, emoji: "👑", label: "Hashira-level: 30 days" },
];

export function getStreakLabel(days: number) {
  let result = STREAK_LABELS[0];
  for (const s of STREAK_LABELS) {
    if (days >= s.days) result = s;
  }
  return result;
}

// ---- Achievements ----
export type Achievement = {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  check: (stats: { mastered: number; total: number; streakDays: number; hashiraPatterns: number }) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-blood",
    name: "First Blood",
    emoji: "🩸",
    desc: "Slay your first demon (master 1 card)",
    check: (s) => s.mastered >= 1,
  },
  {
    id: "hinokami",
    name: "Hinokami Awakened",
    emoji: "🔥",
    desc: "7 day streak of Total Concentration",
    check: (s) => s.streakDays >= 7,
  },
  {
    id: "hashira",
    name: "Hashira of Code",
    emoji: "⚔️",
    desc: "Master all cards in one pattern",
    check: (s) => s.hashiraPatterns >= 1,
  },
  {
    id: "hollow-purple",
    name: "Hollow Purple Slashed",
    emoji: "💜",
    desc: "Master 100 cards",
    check: (s) => s.mastered >= 100,
  },
  {
    id: "sakura",
    name: "Sakura Bloomed",
    emoji: "🌸",
    desc: "First perfect session (10 cards in a row)",
    check: (s) => s.mastered >= 10,
  },
  {
    id: "upper-moon",
    name: "Upper Moon Slayer",
    emoji: "👹",
    desc: "Defeat 5+ patterns (Hashira x5)",
    check: (s) => s.hashiraPatterns >= 5,
  },
  {
    id: "muzan",
    name: "Muzan Defeated",
    emoji: "⚔️👑",
    desc: "Master 500 cards",
    check: (s) => s.mastered >= 500,
  },
  {
    id: "yoriichi",
    name: "Yoriichi Type Zero",
    emoji: "👑",
    desc: "Reach Hashira rank (150+ cards)",
    check: (s) => s.mastered >= 150,
  },
];

// ---- Daily Quest definitions ----
export type Quest = {
  id: string;
  desc: string;
  emoji: string;
  // target count to complete
  target: number;
  // returns how much progress the user has made today
  getProgress: (s: { cardsToday: number; perfectToday: number; cardsMastered: number; streakDays: number }) => number;
};

export const DAILY_QUESTS: Quest[] = [
  {
    id: "slay-demons",
    desc: "Slay 5 demons today (review 5 cards)",
    emoji: "🗡️",
    target: 5,
    getProgress: (s) => s.cardsToday,
  },
  {
    id: "clean-cuts",
    desc: "Land 3 clean cuts in a row (3 Easies)",
    emoji: "⚔️",
    target: 3,
    getProgress: (s) => s.perfectToday,
  },
  {
    id: "flame",
    desc: "Keep your flame alive (don't break streak)",
    emoji: "🔥",
    target: 1,
    getProgress: (s) => (s.streakDays >= 1 ? 1 : 0),
  },
];