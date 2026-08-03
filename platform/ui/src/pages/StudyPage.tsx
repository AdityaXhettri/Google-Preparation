import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { storage } from "../lib/storage";
import { getNote } from "../lib/notes";
import { NOTES, MCQ_BANK, CHEAT_SHEETS, extractFlashcards, type Flashcard, type MCQ, type NoteRef } from "../lib/study";

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
  const stats = storage.get<Record<string, 0 | 1 | 2 | 3>>("flashcard_mastery", {});
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

function FlashcardMode() {
  // Build pool from all notes
  const allCards: Flashcard[] = useMemo(() => {
    const cards: Flashcard[] = [];
    for (const note of NOTES) {
      const md = getNote(note.path);
      if (!md || md.startsWith("*")) continue;
      const extracted = extractFlashcards(md, note.path, note.category);
      cards.push(...extracted);
    }
    // Also seed from MCQ bank (treat as "what is the optimal approach for X" → answer from explanation)
    return cards;
  }, []);

  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [filter, setFilter] = useState<"all" | "due" | "new">("all");

  const mastery = storage.get<Record<string, 0 | 1 | 2 | 3>>("flashcard_mastery", {});

  const dueCards = useMemo(() => {
    // "due" = low mastery or never seen
    return allCards.filter((c) => {
      const m = mastery[c.id];
      return m === undefined || m === 0 || m === 1;
    });
  }, [allCards, mastery]);

  const pool = filter === "due" ? dueCards : allCards;
  const card = pool[idx % Math.max(pool.length, 1)];

  const rate = (m: 0 | 1 | 2 | 3) => {
    if (!card) return;
    const next = { ...mastery, [card.id]: m };
    storage.set("flashcard_mastery", next);
    setRevealed(false);
    setIdx((i) => i + 1);
  };

  if (allCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center">
        <div className="text-6xl mb-4">🎴</div>
        <h1 className="text-2xl font-bold mb-3">No flashcards yet</h1>
        <p className="text-zinc-500">Write content in your notes (H2 headings + paragraphs) — flashcards will be auto-generated.</p>
        <p className="text-xs text-zinc-400 mt-2">Tip: Each H2 heading in a note becomes a flashcard front; the next paragraph becomes the back.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🎴 Flashcards</h1>
        <div className="flex gap-1">
          <FilterBtn active={filter === "all"} onClick={() => { setFilter("all"); setIdx(0); }} label={`All (${allCards.length})`} />
          <FilterBtn active={filter === "due"} onClick={() => { setFilter("due"); setIdx(0); }} label={`Due (${dueCards.length})`} />
        </div>
      </div>

      {!card ? (
        <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-500">
          No cards in this filter.
        </div>
      ) : (
        <div
          onClick={() => setRevealed((r) => !r)}
          className="cursor-pointer min-h-[300px] p-8 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 flex flex-col justify-center text-center hover:border-zinc-400 transition"
        >
          <div className="text-xs text-zinc-500 uppercase tracking-wide mb-3">
            {revealed ? "Answer" : "Question"} · {card.category}
          </div>
          <div className="text-xl font-semibold leading-relaxed">
            {revealed ? card.back : card.front}
          </div>
          <div className="mt-4 text-xs text-zinc-400">tap to {revealed ? "hide" : "reveal"}</div>
        </div>
      )}

      {revealed && card && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          <RateBtn label="Again" color="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200" onClick={() => rate(0)} />
          <RateBtn label="Hard" color="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200" onClick={() => rate(1)} />
          <RateBtn label="Good" color="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" onClick={() => rate(2)} />
          <RateBtn label="Easy" color="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" onClick={() => rate(3)} />
        </div>
      )}

      <div className="mt-4 text-center text-xs text-zinc-500">
        Card {(idx % Math.max(pool.length, 1)) + 1} of {pool.length}
      </div>
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
  const [pool, setPool] = useState<MCQ[]>(MCQ_BANK);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState<Record<string, { correct: number; total: number }>>({});

  const q = pool[idx];

  const choose = (i: number) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    setStats((s) => {
      const cur = s[q.category] ?? { correct: 0, total: 0 };
      return {
        ...s,
        [q.category]: {
          correct: cur.correct + (i === q.correctIndex ? 1 : 0),
          total: cur.total + 1,
        },
      };
    });
  };

  const next = () => {
    setSelected(null);
    setShowResult(false);
    setIdx((i) => (i + 1) % pool.length);
  };

  const filterByCat = (cat: MCQ["category"] | "all") => {
    setPool(cat === "all" ? MCQ_BANK : MCQ_BANK.filter((q) => q.category === cat));
    setIdx(0);
    setSelected(null);
    setShowResult(false);
  };

  if (MCQ_BANK.length === 0) {
    return <div className="p-12 text-center text-zinc-500">No quiz questions yet.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">❓ Quiz</h1>
        <select value="all" onChange={(e) => filterByCat(e.target.value as any)} className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900">
          <option value="all">All categories</option>
          <option value="DSA">DSA only</option>
          <option value="System Design">System Design</option>
          <option value="Behavioral">Behavioral</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(Object.keys(stats) as Array<keyof typeof stats>).map((cat) => {
          const s = stats[cat];
          if (!s.total) return null;
          const pct = Math.round((s.correct / s.total) * 100);
          return (
            <div key={cat} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
              <div className="text-xs text-zinc-500 uppercase">{cat}</div>
              <div className="text-lg font-bold mt-1">{pct}%</div>
              <div className="text-xs text-zinc-500">{s.correct}/{s.total} correct</div>
            </div>
          );
        })}
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

      {showResult && (
        <button onClick={next} className="w-full px-4 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium">
          Next question →
        </button>
      )}

      <div className="mt-4 text-center text-xs text-zinc-500">
        Question {idx + 1} of {pool.length}
      </div>
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