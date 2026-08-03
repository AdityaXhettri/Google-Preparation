/**
 * Markdown note loader — fetches from /notes/ at runtime.
 * The .md files are mirrored in platform/ui/public/notes/ so Vite
 * can serve them as static assets without fs.allow restrictions.
 */

export type NoteRef = {
  path: string;
  title: string;
  category: "DSA" | "System Design" | "Behavioral" | "Other";
};

export const NOTES: NoteRef[] = [
  { path: "README", title: "Master Plan", category: "Other" },
  { path: "dsa-patterns/README", title: "DSA Patterns Overview (50 patterns)", category: "DSA" },
  { path: "dsa-patterns/01-sliding-window/README", title: "01. Sliding Window", category: "DSA" },
  { path: "dsa-patterns/02-two-pointers/README", title: "02. Two Pointers", category: "DSA" },
  { path: "dsa-patterns/03-fast-slow-pointers/README", title: "03. Fast & Slow Pointers", category: "DSA" },
  { path: "dsa-patterns/04-merge-intervals/README", title: "04. Merge Intervals", category: "DSA" },
  { path: "dsa-patterns/05-cyclic-sort/README", title: "05. Cyclic Sort", category: "DSA" },
  { path: "dsa-patterns/06-linkedlist-reversal/README", title: "06. LinkedList Reversal", category: "DSA" },
  { path: "dsa-patterns/07-tree-bfs/README", title: "07. Tree BFS", category: "DSA" },
  { path: "dsa-patterns/08-tree-dfs/README", title: "08. Tree DFS", category: "DSA" },
  { path: "dsa-patterns/09-two-heaps/README", title: "09. Two Heaps", category: "DSA" },
  { path: "dsa-patterns/10-subsets-backtracking/README", title: "10. Subsets / Backtracking", category: "DSA" },
  { path: "dsa-patterns/11-binary-search/README", title: "11. Binary Search", category: "DSA" },
  { path: "dsa-patterns/12-top-k-elements/README", title: "12. Top K Elements", category: "DSA" },
  { path: "dsa-patterns/13-k-way-merge/README", title: "13. K-way Merge", category: "DSA" },
  { path: "dsa-patterns/14-dynamic-programming/README", title: "14. Dynamic Programming", category: "DSA" },
  { path: "dsa-patterns/15-greedy/README", title: "15. Greedy", category: "DSA" },
  { path: "dsa-patterns/16-graphs-topological-sort/README", title: "16. Topological Sort", category: "DSA" },
  { path: "dsa-patterns/17-union-find/README", title: "17. Union Find", category: "DSA" },
  { path: "dsa-patterns/18-trie/README", title: "18. Trie", category: "DSA" },
  { path: "system-design/README", title: "System Design Tracker", category: "System Design" },
  { path: "googleyness-stories/README", title: "Googleyness Stories", category: "Behavioral" },
  { path: "googleyness-stories/01-ambiguity", title: "01. Ambiguity Story", category: "Behavioral" },
  { path: "interview-checklist/README", title: "Interview Checklist", category: "Other" },
];

// Cache for loaded notes
const cache = new Map<string, string>();

/**
 * Get the content of a note by its path.
 * Fetches from /notes/{path}.md once, then caches.
 */
export async function getNote(relPath: string): Promise<string | null> {
  // Normalize: strip .md if present
  const clean = relPath.replace(/^\.\//, "").replace(/^Google-Preparation\//, "").replace(/\.md$/, "");

  if (cache.has(clean)) return cache.get(clean)!;

  try {
    const res = await fetch(`/notes/${clean}.md`);
    if (!res.ok) return null;
    const text = await res.text();
    cache.set(clean, text);
    return text;
  } catch {
    return null;
  }
}

/**
 * Synchronous version (returns cached only)
 */
export function getNoteSync(relPath: string): string | null {
  const clean = relPath.replace(/^\.\//, "").replace(/^Google-Preparation\//, "").replace(/\.md$/, "");
  return cache.get(clean) ?? null;
}

// Debug
if (typeof window !== "undefined") {
  (window as any).__loadedNotes = () => Array.from(cache.keys());
}