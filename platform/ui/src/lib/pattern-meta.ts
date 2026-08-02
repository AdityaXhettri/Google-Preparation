export type PatternMeta = {
  slug: string;
  number: number;
  emoji: string;
  title: string;
  tagline: string;
  when: string;
  difficulty: "core" | "advanced" | "specialized";
  color: string;
};

export const PATTERN_META: PatternMeta[] = [
  { slug: "01-sliding-window",         number: 1,  emoji: "🪟", title: "Sliding Window",              tagline: "Contiguous subarrays, fixed or dynamic size",         when: "Subarray/substring with constraint",     difficulty: "core",        color: "from-sky-500 to-blue-600" },
  { slug: "02-two-pointers",           number: 2,  emoji: "👉", title: "Two Pointers",                tagline: "Sorted arrays, pairs from both ends",                   when: "Sorted input, find pairs/triplets",       difficulty: "core",        color: "from-violet-500 to-purple-600" },
  { slug: "03-fast-slow-pointers",     number: 3,  emoji: "🐢", title: "Fast & Slow Pointers",         tagline: "Tortoise & Hare cycle detection",                        when: "Linked list cycle, middle of list",       difficulty: "core",        color: "from-emerald-500 to-green-600" },
  { slug: "04-merge-intervals",        number: 4,  emoji: "📅", title: "Merge Intervals",             tagline: "Sort + sweep overlapping ranges",                        when: "Overlapping intervals, scheduling",        difficulty: "core",        color: "from-amber-500 to-orange-600" },
  { slug: "05-cyclic-sort",            number: 5,  emoji: "🔄", title: "Cyclic Sort",                 tagline: "Swap each number to its index",                          when: "Numbers in [1,n], find missing/duplicate", difficulty: "core",        color: "from-rose-500 to-pink-600" },
  { slug: "06-linkedlist-reversal",    number: 6,  emoji: "↩️", title: "LinkedList Reversal",         tagline: "prev/curr/next pointer dance",                           when: "Reverse sublist, k-group reversal",        difficulty: "core",        color: "from-fuchsia-500 to-pink-600" },
  { slug: "07-tree-bfs",               number: 7,  emoji: "🌲", title: "Tree BFS",                    tagline: "Level-by-level with a queue",                            when: "Level order, min depth, zigzag",            difficulty: "core",        color: "from-lime-500 to-green-600" },
  { slug: "08-tree-dfs",               number: 8,  emoji: "🌳", title: "Tree DFS",                    tagline: "Path problems + backtracking",                           when: "Path sum, validate BST",                    difficulty: "core",        color: "from-teal-500 to-emerald-600" },
  { slug: "09-two-heaps",              number: 9,  emoji: "⚖️", title: "Two Heaps",                   tagline: "Min-heap + max-heap for streaming medians",              when: "Median of stream",                          difficulty: "advanced",    color: "from-orange-500 to-red-600" },
  { slug: "10-subsets-backtracking",   number: 10, emoji: "🧩", title: "Subsets / Backtracking",      tagline: "Choose → Explore → Unchoose",                            when: "All combinations, permutations",            difficulty: "core",        color: "from-cyan-500 to-blue-600" },
  { slug: "11-binary-search",          number: 11, emoji: "🔍", title: "Modified Binary Search",      tagline: "lo/hi with condition-shifted bounds",                    when: "Sorted/rotated array",                       difficulty: "advanced",    color: "from-indigo-500 to-violet-600" },
  { slug: "12-top-k-elements",         number: 12, emoji: "🏆", title: "Top K Elements",              tagline: "Heap of size K",                                         when: "Kth largest, top K frequent",               difficulty: "advanced",    color: "from-yellow-500 to-amber-600" },
  { slug: "13-k-way-merge",            number: 13, emoji: "🔀", title: "K-way Merge",                 tagline: "Heap to merge K sorted streams",                         when: "Merge K sorted lists",                      difficulty: "advanced",    color: "from-blue-500 to-indigo-600" },
  { slug: "14-dynamic-programming",    number: 14, emoji: "🧠", title: "Dynamic Programming",         tagline: "Memoize overlapping subproblems",                        when: "Count ways, min/max cost",                   difficulty: "advanced",    color: "from-purple-500 to-fuchsia-600" },
  { slug: "15-greedy",                 number: 15, emoji: "💰", title: "Greedy",                      tagline: "Local optimal → global optimal",                          when: "Activity selection, jump game",             difficulty: "advanced",    color: "from-green-500 to-teal-600" },
  { slug: "16-graphs-topological-sort",number: 16, emoji: "📊", title: "Topological Sort",            tagline: "Process nodes with in-degree 0",                         when: "Dependencies, course schedule",             difficulty: "specialized", color: "from-pink-500 to-rose-600" },
  { slug: "17-union-find",             number: 17, emoji: "🌐", title: "Union Find",                  tagline: "Path compression + union by rank",                        when: "Connected components",                      difficulty: "specialized", color: "from-red-500 to-orange-600" },
  { slug: "18-trie",                   number: 18, emoji: "🔤", title: "Trie",                        tagline: "Prefix tree, O(L) lookups",                              when: "Autocomplete, word search",                 difficulty: "specialized", color: "from-slate-500 to-gray-700" },
];

export function getPatternMeta(slug: string): PatternMeta | undefined {
  return PATTERN_META.find((p) => p.slug === slug);
}

export const DIFFICULTY_LABELS: Record<PatternMeta["difficulty"], string> = {
  core: "Core",
  advanced: "Advanced",
  specialized: "Specialized",
};

export const DIFFICULTY_COLORS: Record<PatternMeta["difficulty"], string> = {
  core: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
  advanced: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  specialized: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200",
};