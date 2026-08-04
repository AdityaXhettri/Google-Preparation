/**
 * Pre-written Q&A bank for common DSA problems.
 * Used when API is unavailable. Each entry has a question type and a Socratic hint.
 */

export type HintEntry = {
  question: string;
  answer: string;
};

// Generic hints applicable to all problems
export const GENERIC_HINTS: HintEntry[] = [
  {
    question: "I'm stuck, where do I start?",
    answer:
      "Start with the brute force: any solution that works, even O(n²) or O(n³).\n\n" +
      "Then ask yourself:\n" +
      "1. Can I memoize the result of repeated sub-computations? (DP / cache)\n" +
      "2. Can I avoid nested loops with a hash map? (O(n) lookup)\n" +
      "3. Is the input sorted, or can I sort it? (enables two pointers, binary search)\n\n" +
      "Pick the right data structure first, the algorithm follows.",
  },
  {
    question: "What data structure should I use?",
    answer:
      "It depends on the operations:\n\n" +
      "• Fast lookup by value → HashMap/Set (O(1))\n" +
      "• Fast lookup by sorted key → Binary search tree or array + binary search (O(log n))\n" +
      "• Need order, prefix matching → Trie\n" +
      "• Frequent max/min → Heap / priority queue\n" +
      "• Range queries + updates → Segment tree / Fenwick tree (BIT)\n" +
      "• BFS/DFS on graph → Queue / Stack + adjacency list\n\n" +
      "Once you pick the DS, the algorithm becomes obvious.",
  },
  {
    question: "Is my brute force O(n²) too slow?",
    answer:
      "O(n²) is fine for n ≤ 10,000. For larger:\n\n" +
      "• O(n log n) — sort + linear, or heap\n" +
      "• O(n) — hash map, two pointers, sliding window\n" +
      "• O(log n) — binary search\n\n" +
      "Common upgrades:\n" +
      "1. Replace inner loop with hash lookup → O(n²) → O(n)\n" +
      "2. Sort first, then two pointers → O(n²) → O(n log n)\n" +
      "3. Use a heap for top-K → O(n log k) instead of O(n log n)\n\n" +
      "What's the constraint on n in your problem?",
  },
  {
    question: "What pattern is this problem?",
    answer:
      "Read the problem carefully and look for these signals:\n\n" +
      "• 'subarray' or 'substring' → Sliding Window\n" +
      "• 'sorted array' or 'in-place' → Two Pointers\n" +
      "• 'cycle' or 'linked list loop' → Fast & Slow Pointers\n" +
      "• 'overlapping intervals' → Merge Intervals\n" +
      "• 'all combinations' or 'all permutations' → Backtracking\n" +
      "• 'shortest path' → BFS (unweighted) or Dijkstra (weighted)\n" +
      "• 'all paths' or 'cycle detection' → DFS\n" +
      "• 'top K' or 'kth largest' → Heap\n" +
      "• 'word prefix' or 'autocomplete' → Trie\n" +
      "• 'minimum/maximum with constraints' → DP\n" +
      "• 'make choice to minimize/maximize' → Greedy\n\n" +
      "Which signals do you see in your problem?",
  },
  {
    question: "How do I know if my solution is correct?",
    answer:
      "Test these cases:\n\n" +
      "1. Empty input\n" +
      "2. Single element\n" +
      "3. Two elements (smallest non-trivial)\n" +
      "4. All same values (e.g., [5,5,5,5])\n" +
      "5. Already sorted (best case)\n" +
      "6. Reverse sorted (worst case)\n" +
      "7. With duplicates\n" +
      "8. Very large input (performance)\n\n" +
      "If your code passes all 8, you're 95% there.",
  },
  {
    question: "How do I optimize for time complexity?",
    answer:
      "Common upgrades (in order of impact):\n\n" +
      "• O(n²) → O(n log n): sort first, then linear\n" +
      "• O(n²) → O(n): hash map for O(1) lookup\n" +
      "• O(n log n) → O(n): two pointers on sorted array\n" +
      "• O(n log n) → O(n): heap for top-K (only scan once)\n" +
      "• O(2^n) → O(n): DP with memoization\n\n" +
      "Which upgrade applies to your problem?",
  },
  {
    question: "How do I optimize for space complexity?",
    answer:
      "Three common tricks:\n\n" +
      "1. **In-place modification**: Use the input array itself (e.g., cyclic sort)\n" +
      "2. **Iterative instead of recursive**: Saves stack space (O(log n) instead of O(n))\n" +
      "3. **Two pointers instead of hash map**: Saves O(n) space\n\n" +
      "If the problem says 'in-place' or 'O(1) extra space', you must modify the input.",
  },
  {
    question: "I keep getting wrong answer. How do I debug?",
    answer:
      "Don't stare at the code. Try this:\n\n" +
      "1. **Add print statements** at key points (loop iterations, comparisons)\n" +
      "2. **Trace by hand** on a small failing input — write out what each variable should be\n" +
      "3. **Find a simpler failing case** — if [1,2,3] works but [1,2,3,4] fails, the bug is in the 4th iteration\n" +
      "4. **Check edge cases first**: empty, 1 element, all same\n" +
      "5. **Reverse the algorithm**: starting from output, can you reconstruct the input?\n\n" +
      "Most bugs are off-by-one or wrong base case.",
  },
];

// Pattern-specific hints
export const PATTERN_HINTS: Record<string, HintEntry[]> = {
  "sliding-window": [
    { question: "Sliding window", answer: "Right pointer expands, left pointer shrinks when constraint breaks. Track window state in a Map or counter." },
    { question: "Window doesn't shrink?", answer: "You're not updating the constraint properly. After moving right, check if window is still valid. If not, move left until valid." },
  ],
  "two-pointers": [
    { question: "Two pointers approach", answer: "For sorted arrays: left at 0, right at n-1. Move based on comparison. For unsorted: use hash map instead." },
    { question: "When to use two pointers?", answer: "Sorted array, looking for pairs/triplets, or removing duplicates in-place." },
  ],
  "binary-search": [
    { question: "Binary search template", answer: "lo=0, hi=n-1. while lo <= hi: mid = lo + (hi-lo)/2. If arr[mid] == target, return mid. Else if arr[mid] < target, lo = mid+1. Else hi = mid-1." },
    { question: "Off-by-one in binary search", answer: "Use lo <= hi (not <). Always use mid = lo + (hi-lo)/2 to avoid overflow. Update lo=mid+1 or hi=mid-1, not mid itself." },
  ],
  "dynamic-programming": [
    { question: "DP template", answer: "1. Define state (what changes between subproblems)\n2. Write recurrence (how smaller subproblem → bigger)\n3. Initialize base case\n4. Iterate in topological order (small → big)\n5. Return the answer state" },
    { question: "Memoization vs tabulation", answer: "Memoization = top-down recursion + cache. Tabulation = bottom-up iterative. Both work. Memoization is easier to write, tabulation uses less stack." },
  ],
  "graph": [
    { question: "BFS vs DFS?", answer: "BFS for shortest path in unweighted graph, level-order, or when target is close. DFS for cycle detection, connected components, or exploring all paths." },
    { question: "How to represent graph?", answer: "Adjacency list (Map<Node, Node[]>) for sparse graphs. Adjacency matrix (boolean[][]) for dense graphs. Almost always use adjacency list." },
  ],
  "heap": [
    { question: "When to use heap?", answer: "Top-K, kth largest/smallest, streaming median, or any 'always need the smallest/largest among N' scenario." },
    { question: "Min-heap vs max-heap?", answer: "In JS/Python, you often invert the values to use a single min-heap for both. Or use a custom comparator." },
  ],
  "backtracking": [
    { question: "Backtracking template", answer: "1. Base case: when to add to result\n2. Choose: pick an option\n3. Explore: recurse\n4. Un-choose: undo the choice (backtrack)\n\nThis 4-step pattern is universal." },
  ],
  "trie": [
    { question: "When to use trie?", answer: "Word search, autocomplete, prefix matching, IP routing. O(L) lookup where L = word length." },
    { question: "Trie structure", answer: "Each node has up to 26 children (one per letter) + isWord boolean. Walk down the word, creating nodes as needed." },
  ],
};

export function getRelevantHints(problemCategory: string): HintEntry[] {
  const key = (problemCategory ?? "").toLowerCase();
  const specific = PATTERN_HINTS[key] || [];
  return [...GENERIC_HINTS, ...specific];
}

export function getBestAnswer(question: string, problemCategory: string): string {
  const all = getRelevantHints(problemCategory);
  const q = question.toLowerCase().trim();

  // Find best matching hint by keyword overlap
  const keywords = q.split(/\s+/).filter((w) => w.length > 3);
  let best: HintEntry | null = null;
  let bestScore = 0;

  for (const hint of all) {
    const hq = hint.question.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (hq.includes(kw)) score++;
    }
    // Direct match bonus
    if (q === hq.slice(0, q.length)) score += 5;
    if (score > bestScore) {
      bestScore = score;
      best = hint;
    }
  }

  if (best && bestScore > 0) {
    return best.answer;
  }

  // No match — return a summary of all generic hints
  return GENERIC_HINTS
    .filter((h) => h.question.startsWith("I") || h.question.startsWith("What") || h.question.startsWith("Is") || h.question.startsWith("How"))
    .slice(0, 4)
    .map((h) => `**${h.question}**\n${h.answer}`)
    .join("\n\n---\n\n");
}