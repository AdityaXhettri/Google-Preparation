﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { storage } from "../lib/storage";
import { getNote } from "../lib/notes";
import { NOTES, MCQ_BANK, CHEAT_SHEETS, type MCQ, type NoteRef } from "../lib/study";

type Mode = "read" | "quiz" | "cheatsheet";

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
        <div className="grid grid-cols-1 gap-1 p-3 border-b border-zinc-200 dark:border-zinc-800">
          <ModeTab active={mode === "read"} onClick={() => setMode("read")} icon="📖" label="Read" />
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
  const [session, setSession] = useState<MCQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ qid: string; picked: number; correct: boolean }[]>([]);
  const [done, setDone] = useState(false);
  const [filter, setFilter] = useState<MCQ["category"] | "all">("all");

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

  if (done) {
    const totalCorrect = answers.filter((a) => a.correct).length;
    const totalAsked = answers.length;
    const pct = totalAsked > 0 ? Math.round((totalCorrect / totalAsked) * 100) : 0;

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