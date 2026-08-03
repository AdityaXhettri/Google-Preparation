import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { storage, get as storageGet } from "../lib/storage";
import { getNote } from "../lib/notes";
import { NOTES, MCQ_BANK, CHEAT_SHEETS, extractFlashcards, type Flashcard, type MCQ, type NoteRef } from "../lib/study";
import { PATTERN_META } from "../lib/pattern-meta";
import {
  TIERS, RATE_LABELS, BOSSES, getBossForPattern,
  ACHIEVEMENTS, DAILY_QUESTS, getDemonRank, getStreakLabel,
  type Tier,
} from "../lib/studyTheme";

type Mode = "read" | "flashcards" | "quiz" | "cheatsheet";

export function StudyPage() {
  const [mode, setMode] = useState<Mode>("read");
  const [selected, setSelected] = useState<NoteRef | null>(null);
  const [content, setContent] = useState<string>("");
  const [readPaths, setReadPaths] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    setReadPaths(new Set(storage.getReadNotes().map((r) => r.path)));
  }, []);

  useEffect(() => {
    if (!selected) {
      setContent("");
      return;
    }
    setContent("*Loading...*");
    getNote(selected.path).then((text) => {
      if (text) {
        setContent(text);
      } else {
        setContent(
          `*Note not found: ${selected.path}.md*\n\n` +
          `Make sure the file exists at \`platform/ui/public/notes/${selected.path}.md\`.`
        );
      }
    });
  }, [selected]);

  const markRead = () => {
    if (!selected) return;
    storage.markRead(selected.path);
    setReadPaths(new Set([...readPaths, selected.path]));
  };

  const markUnread = () => {
    if (!selected) return;
    storage.markUnread(selected.path);
    const next = new Set(readPaths);
    next.delete(selected.path);
    setReadPaths(next);
  };

  const categories: NoteRef["category"][] = ["DSA", "System Design", "Behavioral", "Other"];
  const byCategory = categories.map((c) => ({
    category: c,
    notes: NOTES.filter((n) => n.category === c).filter((n) =>
      search ? n.title.toLowerCase().includes(search.toLowerCase()) || n.path.toLowerCase().includes(search.toLowerCase()) : true
    ),
  }));

  const readCount = readPaths.size;
  const progressPct = (readCount / NOTES.length) * 100;

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-80 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 overflow-auto flex flex-col">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur z-10">
          <h2 className="font-bold text-lg flex items-center gap-2"><span>📚</span> Study</h2>
          <p className="text-xs text-zinc-500 mt-1">{readCount} of {NOTES.length} notes read · {progressPct.toFixed(0)}%</p>
          <div className="mt-3 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <input
            type="search"
            placeholder="Search notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 w-full px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900"
          />
        </div>

        {/* Mode tabs */}
        <div className="grid grid-cols-2 gap-1 p-3 border-b border-zinc-200 dark:border-zinc-800">
          <ModeTab active={mode === "read"} onClick={() => setMode("read")} icon="📖" label="Read" />
          <ModeTab active={mode === "flashcards"} onClick={() => setMode("flashcards")} icon="🎴" label="Cards" />
          <ModeTab active={mode === "quiz"} onClick={() => setMode("quiz")} icon="❓" label="Quiz" />
          <ModeTab active={mode === "cheatsheet"} onClick={() => setMode("cheatsheet")} icon="📋" label="Cheat" />
        </div>

        {mode === "read" && (
          <div className="flex-1 overflow-auto">
            {byCategory.map(({ category, notes }) => (
              <div key={category} className="p-3">
                <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">{category}</div>
                <div className="space-y-1">
                  {notes.map((n) => {
                    const isRead = readPaths.has(n.path);
                    const isSelected = selected?.path === n.path;
                    return (
                      <button
                        key={n.path}
                        onClick={() => setSelected(n)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition ${
                          isSelected ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span className="text-lg">{n.emoji}</span>
                        <span className="flex-1 truncate">{n.title}</span>
                        {isRead && <span className={isSelected ? "opacity-100" : "text-green-600 dark:text-green-400"}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {mode === "flashcards" && <FlashcardStatsSidebar />}
        {mode === "quiz" && <QuizSidebar />}
        {mode === "cheatsheet" && <CheatSheetSidebar />}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {mode === "read" && (
          <ReadMode
            selected={selected}
            content={content}
            isRead={selected ? readPaths.has(selected.path) : false}
            onMarkRead={markRead}
            onMarkUnread={markUnread}
          />
        )}
        {mode === "flashcards" && <FlashcardMode />}
        {mode === "quiz" && <QuizMode />}
        {mode === "cheatsheet" && <CheatSheetMode />}
      </main>
    </div>
  );
}

function ModeTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-2 rounded text-xs font-medium flex items-center justify-center gap-1 transition ${
        active ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ---- READ MODE ----
function ReadMode({
  selected,
  content,
  isRead,
  onMarkRead,
  onMarkUnread,
}: {
  selected: NoteRef | null;
  content: string;
  isRead: boolean;
  onMarkRead: () => void;
  onMarkUnread: () => void;
}) {
  if (!selected) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-3xl font-bold mb-3">Pick a note to start</h1>
        <p className="text-zinc-500">Choose a topic from the sidebar to read.</p>
      </div>
    );
  }
  return (
    <article className="max-w-3xl mx-auto p-8 lg:p-12 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 min-h-screen">
      <div className="flex justify-between items-start mb-8 sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur py-3 -mt-3 z-10 gap-3">
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wide">{selected.emoji} {selected.category}</div>
          <h1 className="text-3xl font-bold mt-1 text-zinc-900 dark:text-zinc-100">{selected.title}</h1>
        </div>
        <div className="flex gap-2">
          {isRead ? (
            <>
              <span className="px-3 py-2 rounded-lg text-sm font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 inline-flex items-center gap-1">
                ✓ Read
              </span>
              <button
                onClick={onMarkUnread}
                className="px-3 py-2 rounded-lg text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                title="Mark as unread"
              >
                ↺ Unread
              </button>
            </>
          ) : (
            <button
              onClick={onMarkRead}
              className="px-4 py-2 rounded-lg text-sm font-medium transition bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"
            >
              Mark read
            </button>
          )}
        </div>
      </div>
      <div className="prose max-w-none text-zinc-900 dark:text-zinc-100">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </article>
  );
}

// ---- FLASHCARD MODE ----
function FlashcardStatsSidebar() {
  const stats = storageGet<Record<string, 0 | 1 | 2 | 3>>("flashcard_mastery", {});
  const all = Object.values(stats);
  const mastered = all.filter((m) => m === 3).length;
  const learning = all.filter((m) => m === 1 || m === 2).length;
  const newCount = all.filter((m) => m === 0).length;

  return (
    <div className="p-3">
      <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Progress</div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between p-2 bg-green-50 dark:bg-green-950 rounded">
          <span>✓ Mastered</span><span className="font-mono">{mastered}</span>
        </div>
        <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
          <span>📖 Learning</span><span className="font-mono">{learning}</span>
        </div>
        <div className="flex justify-between p-2 bg-zinc-50 dark:bg-zinc-800 rounded">
          <span>🆕 New</span><span className="font-mono">{newCount}</span>
        </div>
      </div>
      <div className="mt-4 px-2 py-1 text-xs text-zinc-500">
        Click a card → flip → self-rate. SR algorithm picks which card next.
      </div>
    </div>
  );
}

// ============================================
// DEMON SLAYER THEMED FLASHCARD MODE
// ============================================

function SakuraBackground() {
  // 12 floating sakura petals
  return (
    <div className="ds-sakura-bg">
      {Array.from({ length: 12 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = 15 + Math.random() * 15;
        return (
          <div
            key={i}
            className="ds-sakura"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function FlashcardMode() {
  // Build pool from all notes (async fetch)
  const [allCards, setAllCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cards: Flashcard[] = [];
      for (const note of NOTES) {
        const md = await getNote(note.path);
        if (cancelled) return;
        if (!md || md.startsWith("*")) continue;
        const extracted = extractFlashcards(md, note.path, note.category);
        cards.push(...extracted);
      }
      if (!cancelled) setAllCards(cards);
    })();
    return () => { cancelled = true; };
  }, []);

  const [mode, setMode] = useState<"review" | "boss">("review");
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [filter, setFilter] = useState<"all" | "due">("all");
  const [shaking, setShaking] = useState(false);
  const [slash, setSlash] = useState(false);
  const [burst, setBurst] = useState(false);

  const mastery = storageGet<Record<string, 0 | 1 | 2 | 3>>("flashcard_mastery", {});
  const [masteryState, setMasteryState] = useState(mastery);

  // Stats for demon rank
  const masteredCount = Object.values(masteryState).filter((m) => m === 3).length;
  const rank = getDemonRank(masteredCount);
  const streak = storage.getStreak();
  const streakLabel = getStreakLabel(streak.current);

  // Achievements
  const stats = {
    mastered: masteredCount,
    total: allCards.length,
    streakDays: streak.current,
    hashiraPatterns: PATTERN_META?.length || 0, // placeholder
  };

  const dueCards = useMemo(() => {
    return allCards.filter((c) => {
      const m = masteryState[c.id];
      return m === undefined || m === 0 || m === 1;
    });
  }, [allCards, masteryState]);

  const pool = filter === "due" ? dueCards : allCards;
  const card = pool[idx % Math.max(pool.length, 1)];

  const rate = (m: 0 | 1 | 2 | 3) => {
    if (!card) return;
    const next = { ...masteryState, [card.id]: m };
    storage.set("flashcard_mastery", next);
    setMasteryState(next);
    setRevealed(false);
    setIdx((i) => i + 1);
  };

  // Visual effects on rate
  const handleRate = (m: 0 | 1 | 2 | 3) => {
    setSlash(true);
    setTimeout(() => setSlash(false), 600);
    if (m === 0) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    } else if (m === 3) {
      setBurst(true);
      setTimeout(() => setBurst(false), 1200);
    }
    rate(m);
  };

  if (allCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center relative z-10">
        <div className="text-6xl mb-4">🎴</div>
        <h1 className="text-2xl font-bold mb-3">No flashcards yet</h1>
        <p className="text-zinc-500">Write content in your notes (H2 headings + paragraphs) — flashcards will be auto-generated.</p>
      </div>
    );
  }

  const cardTier: Tier = card ? (masteryState[card.id] ?? 0) as Tier : 0;
  const tierMeta = TIERS[cardTier];

  return (
    <div className="max-w-3xl mx-auto p-8 relative z-10">
      <SakuraBackground />

      {/* Header with rank + mode switcher */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            🗡️ Hashira Training
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm">
            <span className="ds-title-gradient">{rank.emoji} {rank.name}</span>
            <span className="text-zinc-500">·</span>
            <span className="ds-flame">{streakLabel.emoji}</span>
            <span className="text-zinc-500 text-xs">{streakLabel.label}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setMode("review")}
            className={`px-3 py-1.5 text-sm rounded ${mode === "review" ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "border border-zinc-300 dark:border-zinc-700"}`}
          >
            🎴 Review
          </button>
          <button
            onClick={() => setMode("boss")}
            className={`px-3 py-1.5 text-sm rounded ${mode === "boss" ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "border border-zinc-300 dark:border-zinc-700"}`}
          >
            👹 Boss Battle
          </button>
        </div>
      </div>

      {mode === "review" ? (
        <ReviewMode
          pool={pool}
          allCards={allCards}
          dueCards={dueCards}
          filter={filter}
          setFilter={(f) => { setFilter(f); setIdx(0); }}
          card={card}
          idx={idx}
          revealed={revealed}
          shaking={shaking}
          slash={slash}
          burst={burst}
          cardTier={cardTier}
          tierMeta={tierMeta}
          onFlip={() => setRevealed((r) => !r)}
          onRate={handleRate}
          masteredCount={masteredCount}
          achievements={ACHIEVEMENTS}
          stats={stats}
          rank={rank}
        />
      ) : (
        <BossBattleMode
          allCards={allCards}
          masteryState={masteryState}
          onMasteryUpdate={(id, m) => {
            const next = { ...masteryState, [id]: m };
            setMasteryState(next);
            storage.set("flashcard_mastery", next);
          }}
        />
      )}
    </div>
  );
}

// ---- Review Mode (Hashira Training) ----
function ReviewMode({
  pool, allCards, dueCards, filter, setFilter, card, idx, revealed,
  shaking, slash, burst, cardTier, tierMeta, onFlip, onRate, masteredCount, achievements, stats, rank,
}: any) {
  return (
    <>
      <div className="flex gap-1 mb-4">
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")} label={`🎴 All (${allCards.length})`} />
        <FilterBtn active={filter === "due"} onClick={() => setFilter("due")} label={`🩸 Due (${dueCards.length})`} />
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Mastered:</span>
          <span className="font-bold text-amber-500">{masteredCount}/{allCards.length}</span>
        </div>
      </div>

      {!card ? (
        <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-500 relative z-10">
          No cards in this filter.
        </div>
      ) : (
        <div className="relative z-10">
          <div
            onClick={onFlip}
            className={`ds-card ${revealed ? "flipped" : ""} ${shaking ? "ds-shake" : ""} cursor-pointer`}
            style={{ minHeight: "320px" }}
          >
            {/* Slash animation overlay */}
            {slash && <div className="ds-slash" />}
            {burst && <div className="ds-burst" />}

            <div className="ds-card-inner relative w-full h-full" style={{ minHeight: "320px" }}>
              {/* Front */}
              <div
                className={`ds-card-face rounded-2xl p-8 bg-zinc-900 dark:bg-zinc-950 flex flex-col justify-center items-center text-center ds-tier-${cardTier}`}
                style={{ minHeight: "320px" }}
              >
                {cardTier === 3 && <span className="ds-hashira-badge absolute top-4 right-4">⚔️ HASHIRA</span>}
                <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                  {tierMeta.emoji} {tierMeta.name}
                </div>
                <div className="text-xl font-semibold leading-relaxed text-zinc-100">
                  {card.front}
                </div>
                <div className="mt-4 text-xs text-zinc-600">
                  ⚔️ Tap to reveal the technique
                </div>
              </div>

              {/* Back */}
              <div
                className={`ds-card-back rounded-2xl p-8 bg-gradient-to-br from-amber-950 to-red-950 flex flex-col justify-center items-center text-center ds-tier-${cardTier}`}
                style={{ minHeight: "320px" }}
              >
                {cardTier === 3 && <span className="ds-hashira-badge absolute top-4 right-4">⚔️ HASHIRA</span>}
                <div className="text-xs uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
                  🩸 Answer · {tierMeta.name}
                </div>
                <div className="text-base leading-relaxed text-zinc-100 whitespace-pre-wrap overflow-auto max-h-64">
                  {card.back}
                </div>
                <div className="mt-4 text-xs text-amber-200/60">
                  How cleanly did you strike?
                </div>
              </div>
            </div>
          </div>

          {revealed && (
            <div className="mt-4 grid grid-cols-4 gap-2 relative z-10">
              <ThemedRateBtn tier={0} onClick={() => onRate(0)} />
              <ThemedRateBtn tier={1} onClick={() => onRate(1)} />
              <ThemedRateBtn tier={2} onClick={() => onRate(2)} />
              <ThemedRateBtn tier={3} onClick={() => onRate(3)} />
            </div>
          )}

          <div className="mt-4 text-center text-xs text-zinc-500 relative z-10">
            Card {(idx % Math.max(pool.length, 1)) + 1} of {pool.length}
          </div>
        </div>
      )}

      <AchievementsPanel stats={stats} achievements={achievements} rank={rank} />
    </>
  );
}

// ---- Themed rate button ----
function ThemedRateBtn({ tier, onClick }: { tier: Tier; onClick: () => void }) {
  const label = RATE_LABELS[tier];
  const colorMap: Record<Tier, string> = {
    0: "bg-red-900/50 hover:bg-red-900 text-red-200 border-red-700",
    1: "bg-orange-900/50 hover:bg-orange-900 text-orange-200 border-orange-700",
    2: "bg-amber-900/50 hover:bg-amber-900 text-amber-200 border-amber-700",
    3: "bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white border-amber-400",
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-3 rounded-lg text-xs font-medium border-2 ${colorMap[tier]} transition`}
    >
      <div className="text-lg mb-1">{label.emoji}</div>
      <div className="font-bold">{label.name}</div>
    </button>
  );
}

// ---- Achievements Panel ----
function AchievementsPanel({ stats, achievements, rank }: any) {
  return (
    <div className="mt-8 p-4 border border-zinc-800 bg-zinc-900/50 rounded-xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-zinc-100 flex items-center gap-2">🏆 Achievements</h3>
        <span className="text-sm">
          <span className="ds-title-gradient">{rank.emoji} {rank.name}</span>
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {achievements.map((a: any) => {
          const unlocked = a.check(stats);
          return (
            <div
              key={a.id}
              className={`p-2 rounded-lg text-xs border ${
                unlocked
                  ? "border-amber-500 bg-amber-950/30 text-amber-100"
                  : "border-zinc-800 bg-zinc-900/30 text-zinc-600"
              }`}
            >
              <div className="text-lg mb-1">{a.emoji} {unlocked ? "" : "🔒"}</div>
              <div className="font-bold">{a.name}</div>
              <div className="text-[10px] opacity-70">{a.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// BOSS BATTLE MODE
// ============================================

function BossBattleMode({ allCards, masteryState, onMasteryUpdate }: { allCards: Flashcard[]; masteryState: Record<string, Tier>; onMasteryUpdate: (id: string, m: Tier) => void }) {
  // Pick a pattern: default first available
  const [patternIdx, setPatternIdx] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [flashClass, setFlashClass] = useState<"ds-damage" | "ds-heal" | "">("");

  // Cards for this pattern
  const patternCards = useMemo(() => {
    return allCards.filter((c) => c.sourcePath.includes(`/${["01-sliding-window","02-two-pointers","03-fast-slow-pointers","04-merge-intervals","05-cyclic-sort","06-linkedlist-reversal","07-tree-bfs","08-tree-dfs","09-two-heaps","10-subsets-backtracking","11-binary-search","12-top-k-elements","13-k-way-merge","14-dynamic-programming","15-greedy","16-graphs-topological-sort","17-union-find","18-trie"][patternIdx]}/`));
  }, [allCards, patternIdx]);

  const boss = BOSSES[patternIdx];
  const card = patternCards[cardIdx % Math.max(patternCards.length, 1)];

  // HP based on how many cards in pattern are still "low mastery"
  const cardsInPattern = allCards.filter((c) =>
    c.sourcePath.includes(`/${boss.pattern}/`)
  );
  const damagedCount = cardsInPattern.filter(
    (c) => (masteryState[c.id] ?? 0) >= 2
  ).length;
  const hp = Math.max(0, cardsInPattern.length - damagedCount);
  const maxHp = cardsInPattern.length;
  const isDefeated = hp === 0 && cardsInPattern.length > 0;

  // Hashira unlocks: when ALL cards in pattern are at level 3
  const allMastered = cardsInPattern.length > 0 && cardsInPattern.every((c) => masteryState[c.id] === 3);
  const justDefeated = isDefeated && !allMastered;

  const rate = (m: Tier) => {
    if (!card) return;
    onMasteryUpdate(card.id, m);

    if (m >= 2) {
      // Demon takes damage
      setFlashClass("ds-damage");
      setTimeout(() => setFlashClass(""), 300);
    } else {
      // Demon attacks
      setFlashClass("ds-heal");
      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        setFlashClass("");
      }, 400);
    }

    setRevealed(false);
    setCardIdx((i) => i + 1);
  };

  if (allCards.length === 0) {
    return (
      <div className="p-12 text-center text-zinc-500">
        No flashcards available. Write content in your notes.
      </div>
    );
  }

  return (
    <div>
      {/* Pattern selector */}
      <div className="mb-4 flex gap-1 overflow-x-auto pb-2">
        {BOSSES.map((b, i) => {
          const c = allCards.filter((card) => card.sourcePath.includes(`/${b.pattern}/`));
          const mastered = c.filter((card) => masteryState[card.id] === 3).length;
          const done = mastered > 0 && mastered === c.length;
          return (
            <button
              key={b.pattern}
              onClick={() => { setPatternIdx(i); setCardIdx(0); setRevealed(false); }}
              className={`px-3 py-2 rounded text-xs whitespace-nowrap ${
                i === patternIdx
                  ? done
                    ? "bg-gradient-to-r from-amber-500 to-red-500 text-white"
                    : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : done
                  ? "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200"
                  : "border border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {done ? "⚔️" : b.rank.includes("Upper") ? "👹" : "🩸"} {b.name}
            </button>
          );
        })}
      </div>

      {/* Boss HP bar */}
      <div className={`mb-4 p-4 rounded-xl bg-zinc-900/80 border-2 border-red-900 ${flashClass}`}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-xs text-zinc-500 uppercase">{boss.rank} {boss.pattern}</div>
            <div className="text-lg font-bold text-red-300">👹 {boss.name}</div>
          </div>
          {isDefeated && (
            <div className="ds-hashira-badge ds-trail">⚔️ DEFEATED</div>
          )}
        </div>
        <div className="ds-hp-bar">
          <div className="ds-hp-fill" style={{ width: `${(hp / maxHp) * 100}%` }} />
          <div className="ds-hp-text">
            {hp} / {maxHp} HP
          </div>
        </div>
        {isDefeated && allMastered && (
          <div className="mt-3 text-center text-amber-400 font-bold ds-trail">
            👑 You have become a HASHIRA of {boss.name}!
          </div>
        )}
      </div>

      {/* Card */}
      {patternCards.length === 0 ? (
        <div className="p-8 border border-zinc-700 bg-zinc-900 rounded-xl text-center text-zinc-500">
          No cards in this pattern yet. Write content in the pattern's README.
        </div>
      ) : (
        <div className={`relative z-10 ${shaking ? "ds-shake" : ""}`}>
          <div
            onClick={() => setRevealed((r) => !r)}
            className={`ds-card ${revealed ? "flipped" : ""} cursor-pointer`}
            style={{ minHeight: "280px" }}
          >
            <div className="ds-card-inner relative w-full h-full" style={{ minHeight: "280px" }}>
              <div className="ds-card-face rounded-2xl p-8 bg-zinc-900 dark:bg-zinc-950 flex flex-col justify-center items-center text-center border-2 border-red-900" style={{ minHeight: "280px" }}>
                <div className="text-xs uppercase tracking-wider text-red-400 mb-3">⚔️ STRIKE THE DEMON</div>
                <div className="text-lg font-semibold leading-relaxed text-zinc-100">
                  {card.front}
                </div>
                <div className="mt-4 text-xs text-zinc-600">Tap to attack</div>
              </div>
              <div className="ds-card-back rounded-2xl p-8 bg-gradient-to-br from-red-950 to-amber-950 flex flex-col justify-center items-center text-center border-2 border-amber-600" style={{ minHeight: "280px" }}>
                <div className="text-xs uppercase tracking-wider text-amber-300 mb-3">🩸 DEMON WOUNDED</div>
                <div className="text-base leading-relaxed text-zinc-100 overflow-auto max-h-56">
                  {card.back}
                </div>
              </div>
            </div>
          </div>

          {revealed && (
            <div className="mt-4 grid grid-cols-2 gap-2 relative z-10">
              <ThemedRateBtn tier={0} onClick={() => rate(0)} />
              <ThemedRateBtn tier={1} onClick={() => rate(1)} />
              <ThemedRateBtn tier={2} onClick={() => rate(2)} />
              <ThemedRateBtn tier={3} onClick={() => rate(3)} />
            </div>
          )}

          <div className="mt-4 text-center text-xs text-zinc-500 relative z-10">
            Strike {(cardIdx % Math.max(patternCards.length, 1)) + 1} of {patternCards.length}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-xs font-medium ${active ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "border border-zinc-300 dark:border-zinc-700"}`}
    >
      {label}
    </button>
  );
}

function RateBtn({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-3 py-3 rounded-lg font-medium text-sm ${color} hover:opacity-80 transition`}>
      {label}
    </button>
  );
}

// ---- QUIZ MODE ----
function QuizSidebar() {
  const byCat: Record<string, number> = {};
  for (const q of MCQ_BANK) byCat[q.category] = (byCat[q.category] ?? 0) + 1;
  return (
    <div className="p-3">
      <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Quiz bank</div>
      <div className="space-y-1 text-xs">
        {Object.entries(byCat).map(([c, n]) => (
          <div key={c} className="flex justify-between p-2 bg-zinc-50 dark:bg-zinc-800 rounded">
            <span>{c}</span><span className="font-mono">{n} Q</span>
          </div>
        ))}
      </div>
      <div className="mt-4 px-2 py-1 text-xs text-zinc-500">
        Pick an answer → see explanation. Tracks best/worst areas.
      </div>
    </div>
  );
}

function QuizMode() {
  const QUIZ_SIZE = 17;
  const [bank, setBank] = useState<MCQ[]>(MCQ_BANK);
  const [session, setSession] = useState<MCQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ qid: string; picked: number; correct: boolean }[]>([]);
  const [done, setDone] = useState(false);
  const [filter, setFilter] = useState<MCQ["category"] | "all">("all");

  // Build a shuffled session of QUIZ_SIZE questions
  const startNew = (cat: MCQ["category"] | "all" = filter) => {
    let pool = cat === "all" ? MCQ_BANK : MCQ_BANK.filter((q) => q.category === cat);
    pool = pool.slice().sort(() => Math.random() - 0.5);
    const drawn = pool.slice(0, Math.min(QUIZ_SIZE, pool.length));
    setSession(drawn);
    setIdx(0);
    setSelected(null);
    setShowResult(false);
    setAnswers([]);
    setDone(false);
    if (cat !== "all") setFilter(cat);
  };

  // Auto-start first session
  useEffect(() => {
    if (session.length === 0) startNew("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = session[idx];

  const choose = (i: number) => {
    if (showResult || !q) return;
    const correct = i === q.correctIndex;
    setSelected(i);
    setShowResult(true);
    setAnswers((a) => [...a, { qid: q.id, picked: i, correct }]);
  };

  const next = () => {
    if (idx + 1 >= session.length) {
      setDone(true);
      return;
    }
    setSelected(null);
    setShowResult(false);
    setIdx((i) => i + 1);
  };

  if (MCQ_BANK.length === 0) {
    return <div className="p-12 text-center text-zinc-500">No quiz questions yet.</div>;
  }

  // ---- DONE SCREEN ----
  if (done) {
    const totalCorrect = answers.filter((a) => a.correct).length;
    const totalAsked = answers.length;
    const pct = totalAsked > 0 ? Math.round((totalCorrect / totalAsked) * 100) : 0;

    // Per-category breakdown
    const byCat: Record<string, { correct: number; total: number }> = {};
    for (const a of answers) {
      const qx = session.find((s) => s.id === a.qid);
      if (!qx) continue;
      const cur = byCat[qx.category] ?? { correct: 0, total: 0 };
      byCat[qx.category] = { correct: cur.correct + (a.correct ? 1 : 0), total: cur.total + 1 };
    }

    return (
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">🎉 Quiz complete!</h1>
        <p className="text-zinc-500 mb-6">You scored <strong className="text-zinc-900 dark:text-zinc-100">{totalCorrect}/{totalAsked}</strong> ({pct}%)</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {Object.entries(byCat).map(([cat, s]) => (
            <div key={cat} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
              <div className="text-xs text-zinc-500 uppercase">{cat}</div>
              <div className="text-2xl font-bold mt-1">{Math.round((s.correct / s.total) * 100)}%</div>
              <div className="text-xs text-zinc-500">{s.correct}/{s.total} correct</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={() => startNew("all")} className="flex-1 px-4 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium">
            🔀 New random 17 questions
          </button>
          <button onClick={() => startNew("DSA")} className="px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg font-medium">
            DSA only
          </button>
          <button onClick={() => startNew("System Design")} className="px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg font-medium">
            SD only
          </button>
        </div>
      </div>
    );
  }

  if (!q) return <div className="p-8 text-zinc-500">Loading question…</div>;

  // ---- IN-PROGRESS ----
  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <h1 className="text-2xl font-bold">❓ Quiz</h1>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => startNew(e.target.value as any)}
            className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900"
          >
            <option value="all">All categories</option>
            <option value="DSA">DSA only</option>
            <option value="System Design">System Design</option>
            <option value="Behavioral">Behavioral</option>
          </select>
          <button
            onClick={() => startNew(filter)}
            className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Draw a new random set"
          >
            🔀 Reshuffle
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs text-zinc-500 mb-1">
          <span>Question {idx + 1} of {session.length}</span>
          <span>{answers.filter((a) => a.correct).length} correct so far</span>
        </div>
        <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
            style={{ width: `${((idx + (showResult ? 1 : 0)) / session.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 mb-4">
        <div className="text-xs text-zinc-500 uppercase mb-2">{q.category}</div>
        <div className="text-lg font-semibold mb-4">{q.question}</div>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isSelected = selected === i;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={showResult}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                  showCorrect
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : showWrong
                    ? "border-red-500 bg-red-50 dark:bg-red-950"
                    : isSelected
                    ? "border-zinc-900 dark:border-white"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                } disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                  {showCorrect && <span className="ml-auto">✓</span>}
                  {showWrong && <span className="ml-auto">✗</span>}
                </div>
              </button>
            );
          })}
        </div>
        {showResult && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
            <strong>Why:</strong> {q.explanation}
          </div>
        )}
      </div>

      {showResult ? (
        <div className="flex gap-2">
          <button
            onClick={next}
            className="flex-1 px-4 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium"
          >
            {idx + 1 >= session.length ? "See results →" : "Next question →"}
          </button>
          <button
            onClick={() => startNew(filter)}
            className="px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Restart
          </button>
        </div>
      ) : (
        <div className="text-center text-xs text-zinc-500">
          Pick an answer to see if you're right
        </div>
      )}
    </div>
  );
}

// ---- CHEAT SHEET MODE ----
function CheatSheetSidebar() {
  return (
    <div className="p-3">
      <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Quick reference</div>
      <div className="space-y-1">
        {CHEAT_SHEETS.map((c) => (
          <a key={c.pattern} href={`#${c.pattern}`} className="block px-3 py-2 rounded text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <span className="mr-2">{c.emoji}</span>
            {c.title}
          </a>
        ))}
      </div>
    </div>
  );
}

function CheatSheetMode() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">📋 Cheat Sheets</h1>
        <p className="text-zinc-500 mt-1">One-page reference per pattern. Read these right before interviews.</p>
      </header>

      {CHEAT_SHEETS.map((c) => (
        <section key={c.pattern} id={c.pattern} className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 scroll-mt-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{c.emoji}</span>
            <div>
              <h2 className="text-2xl font-bold">{c.title}</h2>
              <p className="text-sm text-zinc-500">{c.pattern}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs font-semibold uppercase text-zinc-500 mb-1">When to use</div>
            <p className="text-sm">{c.when}</p>
          </div>

          <div className="mb-4">
            <div className="text-xs font-semibold uppercase text-zinc-500 mb-1">Template</div>
            <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 p-3 rounded overflow-x-auto whitespace-pre-wrap font-mono">{c.template}</pre>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase text-zinc-500 mb-1">Common pitfalls</div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {c.pitfalls.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}