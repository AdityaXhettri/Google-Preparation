/**
 * Study helpers: extract headings, build flashcards, generate quizzes.
 */

export type NoteRef = {
  path: string;
  title: string;
  category: "DSA" | "System Design" | "Behavioral" | "Other";
  emoji: string;
};

export const NOTES: NoteRef[] = [
  { path: "README.md", title: "Master Plan", category: "Other", emoji: "🗺️" },
  { path: "dsa-patterns/README.md", title: "DSA Patterns Overview (50 patterns)", category: "DSA", emoji: "🎯" },
  { path: "dsa-patterns/01-sliding-window/README.md", title: "01. Sliding Window", category: "DSA", emoji: "🪟" },
  { path: "dsa-patterns/02-two-pointers/README.md", title: "02. Two Pointers", category: "DSA", emoji: "👉" },
  { path: "dsa-patterns/03-fast-slow-pointers/README.md", title: "03. Fast & Slow Pointers", category: "DSA", emoji: "🐢" },
  { path: "dsa-patterns/04-merge-intervals/README.md", title: "04. Merge Intervals", category: "DSA", emoji: "📅" },
  { path: "dsa-patterns/05-cyclic-sort/README.md", title: "05. Cyclic Sort", category: "DSA", emoji: "🔄" },
  { path: "dsa-patterns/06-linkedlist-reversal/README.md", title: "06. LinkedList Reversal", category: "DSA", emoji: "↩️" },
  { path: "dsa-patterns/07-tree-bfs/README.md", title: "07. Tree BFS", category: "DSA", emoji: "🌲" },
  { path: "dsa-patterns/08-tree-dfs/README.md", title: "08. Tree DFS", category: "DSA", emoji: "🌳" },
  { path: "dsa-patterns/09-two-heaps/README.md", title: "09. Two Heaps", category: "DSA", emoji: "⚖️" },
  { path: "dsa-patterns/10-subsets-backtracking/README.md", title: "10. Subsets / Backtracking", category: "DSA", emoji: "🧩" },
  { path: "dsa-patterns/11-binary-search/README.md", title: "11. Binary Search", category: "DSA", emoji: "🔍" },
  { path: "dsa-patterns/12-top-k-elements/README.md", title: "12. Top K Elements", category: "DSA", emoji: "🏆" },
  { path: "dsa-patterns/13-k-way-merge/README.md", title: "13. K-way Merge", category: "DSA", emoji: "🔀" },
  { path: "dsa-patterns/14-dynamic-programming/README.md", title: "14. Dynamic Programming", category: "DSA", emoji: "🧠" },
  { path: "dsa-patterns/15-greedy/README.md", title: "15. Greedy", category: "DSA", emoji: "💰" },
  { path: "dsa-patterns/16-graphs-topological-sort/README.md", title: "16. Topological Sort", category: "DSA", emoji: "📊" },
  { path: "dsa-patterns/17-union-find/README.md", title: "17. Union Find", category: "DSA", emoji: "🌐" },
  { path: "dsa-patterns/18-trie/README.md", title: "18. Trie", category: "DSA", emoji: "🔤" },
  { path: "system-design/README.md", title: "System Design Tracker", category: "System Design", emoji: "🏗️" },
  { path: "googleyness-stories/README.md", title: "Googleyness Stories", category: "Behavioral", emoji: "✨" },
  { path: "googleyness-stories/01-ambiguity.md", title: "01. Ambiguity Story", category: "Behavioral", emoji: "❓" },
  { path: "interview-checklist/README.md", title: "Interview Checklist", category: "Other", emoji: "✅" },
];

export type Flashcard = {
  id: string;
  sourcePath: string;
  front: string;  // Question
  back: string;   // Answer
  category: NoteRef["category"];
  /** Mastery: 0=new, 1=learning, 2=familiar, 3=mastered */
  mastery?: 0 | 1 | 2 | 3;
};

/**
 * Extract flashcards from a markdown note.
 * Heuristic: H2 headings become fronts, the next paragraph becomes the back.
 */
export function extractFlashcards(markdown: string, sourcePath: string, category: NoteRef["category"]): Flashcard[] {
  const cards: Flashcard[] = [];
  const sections = markdown.split(/(?=^##\s)/m);

  for (const section of sections) {
    const lines = section.trim().split("\n");
    if (lines.length < 2) continue;

    const headingMatch = lines[0].match(/^##\s+(.+)/);
    if (!headingMatch) continue;

    const front = headingMatch[1].trim();
    // Back = first non-empty paragraph after the heading
    const back = lines
      .slice(1)
      .filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("- ") && !l.startsWith("|") && !l.startsWith("```"))
      .slice(0, 5)
      .join("\n")
      .trim();

    if (!back || back.length < 20) continue;

    cards.push({
      id: `${sourcePath}#${front}`,
      sourcePath,
      front,
      back: back.slice(0, 300),
      category,
    });
  }
  return cards;
}

/** MCQ for testing recall. Manually curated for now. */
export type MCQ = {
  id: string;
  category: "DSA" | "System Design" | "Behavioral";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

// Raw question bank. The exported MCQ_BANK below SHUFFLES each question's
// options at module load so the correct answer is in a random position
// (A/B/C/D) — not always B. This prevents the "every answer is B" feeling.
const MCQ_RAW: Omit<MCQ, "options" | "correctIndex"> & { correct: string }[] = [
  // DSA
  { id: "mcq-1", category: "DSA", question: "Which pattern is best for 'find longest substring without repeating characters'?", correct: "Sliding Window", wrong: ["Two Pointers", "Dynamic Programming", "Cyclic Sort"], explanation: "Sliding Window with a Map tracking last-seen positions. Right pointer expands, left jumps past duplicates." },
  { id: "mcq-2", category: "DSA", question: "Two Sum on a SORTED array — what's the optimal approach?", correct: "Two pointers O(n)", wrong: ["Hash map O(n)", "Binary search O(n log n)", "Brute force O(n²)"], explanation: "Sorted array + O(n) time → two pointers from both ends. Move pointer based on whether sum is too big or too small." },
  { id: "mcq-3", category: "DSA", question: "Linked list cycle detection — what technique?", correct: "Two pointers (fast/slow)", wrong: ["Hash set", "DFS", "Binary search"], explanation: "Floyd's tortoise & hare. If they meet, there's a cycle. O(1) space." },
  { id: "mcq-4", category: "DSA", question: "Merge overlapping intervals — first step?", correct: "Sort by start time", wrong: ["Use a min-heap", "Use a stack", "Build a graph"], explanation: "Sort by start. Then sweep: if current.start ≤ last.end, overlap and merge; else push new interval." },
  { id: "mcq-5", category: "DSA", question: "Missing number in [0, n] — best technique?", correct: "Both cyclic sort AND sum formula work", wrong: ["Hash set", "Cyclic sort", "Sum formula (n*(n+1)/2)"], explanation: "Cyclic sort is O(n) time O(1) space. Sum formula is also O(n) O(1). Both work — interviewer accepts either." },
  { id: "mcq-6", category: "DSA", question: "Validate BST — what's the bug in 'check parent > left and parent < right'?", correct: "Doesn't catch ancestor constraints", wrong: ["It works fine", "Wrong time complexity", "Not a bug, just slow"], explanation: "Each node must be within (min, max) range inherited from ALL ancestors. A node deep in tree might violate a higher ancestor's constraint." },
  { id: "mcq-7", category: "DSA", question: "Kth largest in unsorted array — best structure?", correct: "Min-heap of size K", wrong: ["Max-heap", "Sorted array", "Hash map"], explanation: "Min-heap of size K keeps the K largest. Top is the smallest of those K. New bigger element evicts. O(n log k)." },
  { id: "mcq-8", category: "DSA", question: "Longest Increasing Subsequence — what's the O(n log n) trick?", correct: "Patience sorting (tail array)", wrong: ["Binary search", "Hash map", "DP only"], explanation: "Maintain sorted 'tails' array. For each num, binary search position to replace. Length of tails = LIS length." },
  { id: "mcq-9", category: "DSA", question: "Course schedule (prerequisites) — algorithm?", correct: "Topological sort (Kahn's)", wrong: ["DFS", "Dijkstra", "Union find"], explanation: "Build in-degree. Process in-degree-0 nodes. If you can't process all, there's a cycle. O(V+E)." },
  { id: "mcq-10", category: "DSA", question: "Trie is best for…", correct: "Prefix matching / autocomplete", wrong: ["Sorting numbers", "Finding shortest path", "Cycle detection"], explanation: "Trie gives O(L) lookup for words, perfect for autocomplete, IP routing, word search in a grid." },

  // System Design
  { id: "mcq-sd-1", category: "System Design", question: "In a system design interview, what's the FIRST 5 minutes for?", correct: "Clarifying requirements", wrong: ["Drawing boxes", "Estimating scale (QPS, storage)", "Choosing the database"], explanation: "Always clarify scope FIRST. 'Twitter for who? How many users? What features?' This prevents solving the wrong problem." },
  { id: "mcq-sd-2", category: "System Design", question: "What's fan-out on write vs read?", correct: "How to compute timelines (push vs pull)", wrong: ["Database choice", "CDN vs origin", "Sync vs async"], explanation: "Push (fan-out on write): timeline pre-computed into followers' feeds. Pull (fan-out on read): fetched when user opens. Hybrid for celebrity problem." },
  { id: "mcq-sd-3", category: "System Design", question: "When do you need a message queue?", correct: "When producer and consumer rates differ, or to buffer spikes", wrong: ["Always", "Only for events", "Never, use DB"], explanation: "Queue decouples producer from consumer. Handles burst traffic. Kafka/RabbitMQ between services." },
  { id: "mcq-sd-4", category: "System Design", question: "CDN is best for…", correct: "Static + cacheable content, edge delivery", wrong: ["Database queries", "Internal RPC", "Search"], explanation: "CDN caches at edge globally. Reduces latency for static assets, videos, etc. Internal traffic doesn't need CDN." },

  // Behavioral
  { id: "mcq-bh-1", category: "Behavioral", question: "What's STAR?", correct: "Situation, Task, Action, Result", wrong: ["Start, Try, Ask, Rest", "Story, Truth, Analysis, Reaction", "Subject, Theme, Arc, Resolution"], explanation: "STAR = Situation (context) + Task (your responsibility) + Action (what YOU did, 3-5 bullets) + Result (metrics + learning)." },
  { id: "mcq-bh-2", category: "Behavioral", question: "When asked about a failure, you should…", correct: "Take ownership + show what you learned", wrong: ["Blame external factors", "Deflect to a success", "Say it wasn't your fault"], explanation: "Ownership + growth. Google values 'Doing the Right Thing' and learning from mistakes. Blaming others is a red flag." },
  { id: "mcq-bh-3", category: "Behavioral", question: "How many stories should you have ready for L4?", correct: "5-8 covering 6 Googleyness attributes", wrong: ["1-2", "20+", "Just one good one"], explanation: "Have 5-8 strong stories mapped to the 6 Googleyness attributes. Each story can answer multiple questions when reframed." },
];

/**
 * Build the final MCQ_BANK by shuffling each question's options
 * (including the correct one) so the answer position is random per question.
 */
export const MCQ_BANK: MCQ[] = MCQ_RAW.map((q) => {
  const all = [q.correct, ...q.wrong];
  // Shuffle (Fisher-Yates)
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return {
    id: q.id,
    category: q.category,
    question: q.question,
    explanation: q.explanation,
    options: all,
    correctIndex: all.indexOf(q.correct),
  };
});

/** Cheat sheet content per pattern — quick reference. */
export const CHEAT_SHEETS: Array<{ pattern: string; emoji: string; title: string; when: string; template: string; pitfalls: string[] }> = [
  { pattern: "01-sliding-window", emoji: "🪟", title: "Sliding Window", when: "Contiguous subarray/substring with constraint, max/min within window", template: "left=0; for right=0..n:\n  add arr[right] to window\n  while window invalid:\n    remove arr[left]; left++\n  update answer", pitfalls: ["Forgetting to shrink when window becomes invalid", "Off-by-one when comparing right-left+1"] },
  { pattern: "02-two-pointers", emoji: "👉", title: "Two Pointers", when: "Sorted array, find pairs, in-place from both ends", template: "left=0, right=n-1\nwhile left<right:\n  if sum === target: answer\n  if sum < target: left++\n  else: right--", pitfalls: ["Same direction (slow/fast) for in-place; opposite for sorted pairs — don't confuse"] },
  { pattern: "03-fast-slow-pointers", emoji: "🐢", title: "Fast & Slow", when: "Linked list cycle detection, middle of list", template: "slow=head, fast=head\nwhile fast?.next:\n  slow = slow.next\n  fast = fast.next.next\n  if slow === fast: cycle", pitfalls: ["Forgetting to set fast=head initially for cycle-start problem"] },
  { pattern: "04-merge-intervals", emoji: "📅", title: "Merge Intervals", when: "Overlapping intervals, meeting rooms", template: "Sort by start\nmerged = [first]\nfor next in rest:\n  if next.start ≤ merged.last.end: extend\n  else: push new", pitfalls: ["Using > instead of >= for non-overlapping"] },
  { pattern: "05-cyclic-sort", emoji: "🔄", title: "Cyclic Sort", when: "Numbers in [1, n], find missing/duplicate", template: "i=0\nwhile i<n:\n  correct = arr[i]-1\n  if arr[i] !== arr[correct]: swap\n  else: i++\nreturn first wrong index", pitfalls: ["Cycle logic, not selection sort"] },
  { pattern: "06-linkedlist-reversal", emoji: "↩️", title: "LinkedList Reversal", when: "Reverse sublist, k-group", template: "prev=null, curr=head\nwhile curr:\n  next = curr.next\n  curr.next = prev\n  prev = curr\n  curr = next\nreturn prev", pitfalls: ["Save next before breaking the link"] },
  { pattern: "07-tree-bfs", emoji: "🌲", title: "Tree BFS", when: "Level order, min depth, zigzag", template: "queue=[root]\nwhile queue.length:\n  size = queue.length  // level snapshot\n  loop size times: process + enqueue children\n  level++", pitfalls: ["Using while(queue.length) without size snapshot merges levels"] },
  { pattern: "08-tree-dfs", emoji: "🌳", title: "Tree DFS", when: "Path sum, validate BST, all paths", template: "helper(node, state):\n  if !node: return base\n  update state\n  if leaf: process\n  helper(node.left, state)\n  helper(node.right, state)\n  backtrack state", pitfalls: ["Forgetting to backtrack the state in path problems"] },
  { pattern: "09-two-heaps", emoji: "⚖️", title: "Two Heaps", when: "Median of stream, partition", template: "maxHeap = smaller half\nminHeap = larger half\nmaxHeap.size() >= minHeap.size()\ntop of maxHeap = median (or avg)", pitfalls: ["No built-in heap in JS — use library or implement"] },
  { pattern: "10-subsets-backtracking", emoji: "🧩", title: "Backtracking", when: "All combinations, permutations", template: "backtrack(path, choices):\n  if done: push(path)\n  for choice in choices:\n    push choice\n    backtrack(rest)\n    pop choice", pitfalls: ["Forgetting to pop (un-choose) after recursion"] },
  { pattern: "11-binary-search", emoji: "🔍", title: "Binary Search", when: "Sorted/rotated array, find boundary", template: "lo=0, hi=n-1\nwhile lo<=hi:\n  mid = (lo+hi)>>1\n  if arr[mid]===target: return mid\n  if arr[mid]<target: lo=mid+1\n  else: hi=mid-1", pitfalls: ["Use (lo+hi)>>1 not (lo+hi)/2 (overflow safety)"] },
  { pattern: "12-top-k-elements", emoji: "🏆", title: "Top K", when: "Kth largest, top K frequent", template: "minHeap of size K\nfor x in stream:\n  heap.push(x)\n  if heap.size()>K: heap.pop()\nreturn heap.top()", pitfalls: ["Min-heap for K largest (smallest of top-K at top)"] },
  { pattern: "13-k-way-merge", emoji: "🔀", title: "K-way Merge", when: "Merge K sorted lists", template: "minHeap of (value, listId)\nwhile heap not empty:\n  pop, take value\n  push next from same list", pitfalls: ["Heap comparator to break ties between lists"] },
  { pattern: "14-dynamic-programming", emoji: "🧠", title: "DP", when: "Count ways, min/max cost, optimal substructure", template: "1. Identify state\n2. Find recurrence\n3. Base case\n4. Memoize (top-down) or tabulate (bottom-up)", pitfalls: ["Missing state transitions, wrong base case"] },
  { pattern: "15-greedy", emoji: "💰", title: "Greedy", when: "Activity selection, intervals", template: "Sort, then make locally optimal choice\nverify with counter-example", pitfalls: ["Greedy fails when local ≠ global — fall back to DP"] },
  { pattern: "16-graphs-topological-sort", emoji: "📊", title: "Topological Sort", when: "Dependencies, course schedule", template: "in-degree array\nqueue all 0 in-degree\nprocess, decrement neighbors", pitfalls: ["Cycle = can't process all"] },
  { pattern: "17-union-find", emoji: "🌐", title: "Union Find", when: "Connected components, MST", template: "parent[i]=i, rank[i]=0\nfind(x): if parent[x]!==x: parent[x]=find(parent[x])\nunion(x,y): link smaller rank", pitfalls: ["Without path compression it's slow"] },
  { pattern: "18-trie", emoji: "🔤", title: "Trie", when: "Autocomplete, prefix matching", template: "class TrieNode:\n  children = Map()\n  isWord = false\ninsert: walk chars, create if needed\nsearch: walk + check isWord", pitfalls: ["No built-in in JS — implement"] },
];

/** Get cheat sheet by pattern slug. */
export function getCheatSheet(pattern: string) {
  return CHEAT_SHEETS.find((c) => c.pattern === pattern);
}