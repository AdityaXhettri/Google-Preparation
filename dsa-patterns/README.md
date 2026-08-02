# DSA Patterns — Overview

## Why learn patterns, not problems?

There are 3,000+ LeetCode problems. You can't memorize all of them. But there are only **~18 patterns**. Master the patterns and you can solve any problem.

## The 18 patterns

### Core (master these first)

| # | Pattern | When | Complexity |
|---|---|---|---|
| 1 | [Sliding Window](01-sliding-window/README.md) | Contiguous subarray/substring with constraint | O(n) |
| 2 | [Two Pointers](02-two-pointers/README.md) | Sorted array, find pairs, in-place | O(n) |
| 3 | [Fast & Slow Pointers](03-fast-slow-pointers/README.md) | Linked list cycle, middle of list | O(n) |
| 4 | [Merge Intervals](04-merge-intervals/README.md) | Overlapping intervals | O(n log n) |
| 5 | [Cyclic Sort](05-cyclic-sort/README.md) | Numbers in [1, n] | O(n) |
| 6 | [LinkedList Reversal](06-linkedlist-reversal/README.md) | Reverse list/sublist in-place | O(n) |
| 7 | [Tree BFS](07-tree-bfs/README.md) | Level-by-level traversal | O(n) |
| 8 | [Tree DFS](08-tree-dfs/README.md) | Path problems, validate BST | O(n) |
| 10 | [Subsets / Backtracking](10-subsets-backtracking/README.md) | All combinations/permutations | O(2^n) or O(n!) |

### Advanced (L4+ expectation)

| # | Pattern | When | Complexity |
|---|---|---|---|
| 9 | [Two Heaps](09-two-heaps/README.md) | Median of stream, partition | O(log n) per op |
| 11 | [Binary Search](11-binary-search/README.md) | Sorted/rotated array | O(log n) |
| 12 | [Top K Elements](12-top-k-elements/README.md) | K largest/smallest | O(n log k) |
| 13 | [K-way Merge](13-k-way-merge/README.md) | Merge K sorted inputs | O(n log k) |
| 14 | [Dynamic Programming](14-dynamic-programming/README.md) | Overlapping subproblems | varies |
| 15 | [Greedy](15-greedy/README.md) | Local → global optimum | varies |

### Specialized (less common but show up)

| # | Pattern | When | Complexity |
|---|---|---|---|
| 16 | [Topological Sort](16-graphs-topological-sort/README.md) | Dependencies, course schedule | O(V+E) |
| 17 | [Union Find](17-union-find/README.md) | Connected components, MST | ~O(1) per op |
| 18 | [Trie](18-trie/README.md) | Prefix matching, autocomplete | O(L) |

## How to study

1. **Pick a pattern** (start with Core, your weakest first)
2. **Read the README** — understand when to use, template, pitfalls
3. **Solve problems in order** — start easy, build to hard
4. **Time yourself** — medium in 25 min, hard in 40 min
5. **Review mistakes** — write what you got wrong, why
6. **Spaced repetition** — re-solve problems after 3, 7, 30 days

## Study plan (12 weeks)

- **Weeks 1-6:** Patterns 1-10 (Core), 2-3 problems each = 20-30 problems
- **Weeks 7-10:** Patterns 11-15 (Advanced), 1-2 problems each = 8-10 problems
- **Weeks 11-12:** Mock interviews, weak patterns, full review

## Resources

- **NeetCode 150** — best curated list, organized by pattern
- **LeetCode** — filter by topic, sort by frequency
- **Striver's SDE Sheet** — Indian alternative, top problems
- **Blind 75** — minimum viable list

## Progress tracker

| Pattern | Easy | Medium | Hard | Status |
|---|---|---|---|---|
| Sliding Window | ☐ | ☐ | ☐ | ☐ |
| Two Pointers | ☐ | ☐ | ☐ | ☐ |
| Fast & Slow | ☐ | ☐ | ☐ | ☐ |
| Merge Intervals | ☐ | ☐ | ☐ | ☐ |
| Cyclic Sort | ☐ | ☐ | ☐ | ☐ |
| LinkedList Reversal | ☐ | ☐ | ☐ | ☐ |
| Tree BFS | ☐ | ☐ | ☐ | ☐ |
| Tree DFS | ☐ | ☐ | ☐ | ☐ |
| Two Heaps | ☐ | ☐ | ☐ | ☐ |
| Subsets/Backtrack | ☐ | ☐ | ☐ | ☐ |
| Binary Search | ☐ | ☐ | ☐ | ☐ |
| Top K | ☐ | ☐ | ☐ | ☐ |
| K-way Merge | ☐ | ☐ | ☐ | ☐ |
| DP | ☐ | ☐ | ☐ | ☐ |
| Greedy | ☐ | ☐ | ☐ | ☐ |
| Topological Sort | ☐ | ☐ | ☐ | ☐ |
| Union Find | ☐ | ☐ | ☐ | ☐ |
| Trie | ☐ | ☐ | ☐ | ☐ |

## Interview tips

- **First 2 min:** restate problem, ask clarifying questions
- **3-5 min:** discuss approach out loud, mention pattern
- **5-20 min:** code
- **Last 5 min:** test with edge cases, discuss complexity
- **If stuck 10+ min:** say what you've tried, ask for hint

## Common interview mistakes

1. Jumping to code without thinking
2. Not testing edge cases (empty, 1 elem, duplicates)
3. Silent coding — interviewer can't help if they don't know what you're doing
4. Giving up — say what you've considered
5. Not discussing time/space at the end