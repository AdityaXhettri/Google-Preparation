import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { storage } from "../lib/storage";
import { getNote } from "../lib/notes";

type Note = { path: string; title: string; category: "DSA" | "System Design" | "Behavioral" | "Other"; emoji: string };

const NOTES: Note[] = [
  { path: "README.md", title: "Master Plan", category: "Other", emoji: "🗺️" },
  { path: "dsa-patterns/README.md", title: "DSA Patterns Overview", category: "DSA", emoji: "🎯" },
  { path: "dsa-patterns/01-sliding-window/README.md", title: "01. Sliding Window", category: "DSA", emoji: "🪟" },
  { path: "dsa-patterns/02-two-pointers/README.md", title: "02. Two Pointers", category: "DSA", emoji: "👉" },
  { path: "dsa-patterns/14-dynamic-programming/README.md", title: "14. Dynamic Programming", category: "DSA", emoji: "🧠" },
  { path: "dsa-patterns/18-trie/README.md", title: "18. Trie", category: "DSA", emoji: "🔤" },
  { path: "system-design/README.md", title: "System Design Tracker", category: "System Design", emoji: "🏗️" },
  { path: "googleyness-stories/README.md", title: "Googleyness Stories", category: "Behavioral", emoji: "✨" },
  { path: "googleyness-stories/01-ambiguity.md", title: "01. Ambiguity Story", category: "Behavioral", emoji: "❓" },
  { path: "interview-checklist/README.md", title: "Interview Checklist", category: "Other", emoji: "✅" },
];

export function StudyPage() {
  const [selected, setSelected] = useState<Note | null>(null);
  const [content, setContent] = useState<string>("");
  const [readPaths, setReadPaths] = useState<Set<string>>(new Set());

  useEffect(() => {
    setReadPaths(new Set(storage.getReadNotes().map((r) => r.path)));
  }, []);

  useEffect(() => {
    if (!selected) {
      setContent("");
      return;
    }
    const text = getNote(selected.path);
    setContent(text ?? `*Note not found: ${selected.path}*\n\nMake sure \`Google-Preparation/${selected.path}\` exists.`);
  }, [selected]);

  const markRead = () => {
    if (!selected) return;
    storage.markRead(selected.path);
    setReadPaths(new Set([...readPaths, selected.path]));
  };

  const categories: Note["category"][] = ["DSA", "System Design", "Behavioral", "Other"];
  const byCategory = categories.map((c) => ({ category: c, notes: NOTES.filter((n) => n.category === c) }));
  const readCount = readPaths.size;
  const progressPct = (readCount / NOTES.length) * 100;

  return (
    <div className="min-h-screen flex">
      <aside className="w-80 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 overflow-auto">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur z-10">
          <h2 className="font-bold text-lg flex items-center gap-2"><span>📚</span> Study</h2>
          <p className="text-xs text-zinc-500 mt-1">{readCount} of {NOTES.length} notes read</p>
          <div className="mt-3 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="mt-1 text-xs text-zinc-500 text-right">{progressPct.toFixed(0)}%</div>
        </div>
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
      </aside>

      <main className="flex-1 overflow-auto">
        {!selected ? (
          <div className="max-w-3xl mx-auto p-12 text-center">
            <div className="text-6xl mb-4">📖</div>
            <h1 className="text-3xl font-bold mb-3">Pick a note to start</h1>
            <p className="text-zinc-500">Choose a topic from the sidebar.</p>
          </div>
        ) : (
          <article className="max-w-3xl mx-auto p-8 lg:p-12">
            <div className="flex justify-between items-start mb-8 sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur py-3 -mt-3 z-10">
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide">{selected.emoji} {selected.category}</div>
                <h1 className="text-3xl font-bold mt-1">{selected.title}</h1>
              </div>
              <button
                onClick={markRead}
                disabled={readPaths.has(selected.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  readPaths.has(selected.path) ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"
                }`}
              >
                {readPaths.has(selected.path) ? "✓ Read" : "Mark read"}
              </button>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}