# DSA Patterns — Complete Reference (50 Patterns)

> **Why learn patterns, not problems?**
> 3,000+ LeetCode problems. You can't memorize all of them. But there are only ~50 patterns. Master the patterns and you can solve any problem.

## Quick Start

| Priority | Pattern Range | Time |
|---|---|---|
| 1 | Core 1-31 (master these first) | 8-10 weeks |
| 2 | Advanced 32-50 (L4+ expectation) | 4-6 weeks |
| 3 | Mock interviews, weak patterns | 2-4 weeks |

---

## ⚡ Core Problem-Solving Patterns (1-31)

| # | Pattern | Description | Key Idea | Example Problems |
|---|---|---|---|---|
| 1 | **Sliding Window** | Subarrays or substrings | Slide a window to optimize O(n²) → O(n) | LC 3 Longest Substring Without Repeating, LC 209 Minimum Size Subarray Sum |
| 2 | **Two Pointers** | Sorted arrays, linked lists, strings | Two pointers moving towards/away | LC 167 Two Sum II, LC 42 Trapping Rain Water |
| 3 | **Fast and Slow Pointers** | Cyclic problems, linked list loops | Two pointers at different speeds | LC 141 Linked List Cycle, LC 876 Middle of Linked List |
| 4 | **Merge Intervals** | Overlapping intervals | Sort and merge based on conditions | LC 56 Merge Intervals, LC 57 Insert Interval |
| 5 | **Cyclic Sort** | Numbers in range 1 to n | Place each number at correct index | LC 268 Missing Number, LC 442 Find All Duplicates |
| 6 | **Subsets** | All combinations/subsets | BFS, recursion, or bitmasking | LC 78 Subsets, LC 46 Permutations |
| 7 | **Binary Search** | Sorted arrays, answer-based problems | Divide and conquer, halve search space | LC 33 Search in Rotated Sorted Array, LC 704 Binary Search |
| 8 | **Backtracking** | Constraint-based problems | Try all possibilities, backtrack on failure | LC 51 N-Queens, LC 79 Word Search |
| 9 | **Breadth-First Search (BFS)** | Shortest path, level-order traversal | Explore all neighbors before next level | LC 102 Binary Tree Level Order, LC 127 Word Ladder |
| 10 | **Depth-First Search (DFS)** | Pathfinding, tree/graph traversal | Recursively explore each path fully | LC 797 All Paths From Source to Target, LC 200 Number of Islands |
| 11 | **Topological Sort** | DAG dependencies | BFS or DFS based on prerequisites | LC 207 Course Schedule, LC 210 Course Schedule II |
| 12 | **Union-Find (Disjoint Set)** | Connectivity in graphs | Union and find operations | LC 547 Number of Provinces, LC 684 Redundant Connection |
| 13 | **Greedy** | Optimization (min/max) | Locally optimal choice at each step | LC 435 Non-overlapping Intervals, LC 621 Task Scheduler |
| 14 | **Dynamic Programming (DP)** | Optimization, decision-based | Break into overlapping subproblems | LC 300 Longest Increasing Subsequence, LC 416 Partition Equal Subset Sum |
| 15 | **Bit Manipulation** | Binary-related problems | Bitwise operators for efficiency | LC 136 Single Number, LC 231 Power of Two |
| 16 | **Matrix Traversal** | Grid traversal problems | BFS, DFS, or DP on grid | LC 62 Unique Paths, LC 994 Rotting Oranges |
| 17 | **Heap / Priority Queue** | Frequent max/min operations | Efficient insertion and extraction | LC 215 Kth Largest Element, LC 23 Merge K Sorted Lists |
| 18 | **Divide and Conquer** | Partitioning problems | Break into smaller subproblems | LC 912 Sort an Array, LC 4 Median of Two Sorted Arrays |
| 19 | **Prefix Sum** | Range sum queries | Precompute cumulative sums | LC 560 Subarray Sum Equals K, LC 303 Range Sum Query - Immutable |
| 20 | **Sliding Window Maximum** | Maximum/minimum in sliding windows | Deque to maintain window max | LC 239 Sliding Window Maximum, LC 1425 Constrained Subsequence Sum |
| 21 | **Kadane's Algorithm** | Maximum subarray problems | Running sum, update max sum | LC 53 Maximum Subarray, LC 918 Maximum Sum Circular Subarray |
| 22 | **Trie (Prefix Tree)** | Word-related problems | Tree structure for fast prefix lookups | LC 208 Implement Trie, LC 212 Word Search II |
| 23 | **Segment Trees** | Range query problems | Tree structure for efficient range queries | LC 307 Range Sum Query - Mutable, LC 315 Count of Smaller Numbers |
| 24 | **Graph Traversal** | Shortest paths, connected components | DFS, BFS, or Dijkstra's | LC 743 Network Delay Time, LC 1584 Min Cost to Connect All Points |
| 25 | **Flood Fill** | Grid-based coloring, connected regions | DFS or BFS to visit components | LC 733 Flood Fill, LC 1020 Number of Enclaves |
| 26 | **Monotonic Stack** | Nearest larger/smaller elements | Stack to maintain monotonic sequence | LC 496 Next Greater Element, LC 84 Largest Rectangle in Histogram |
| 27 | **String Matching (KMP, Rabin-Karp)** | Substring search | Efficient string matching algorithms | LC 28 Find Index of First Occurrence, LC 214 Shortest Palindrome |
| 28 | **Binary Indexed Tree (Fenwick Tree)** | Dynamic range sum/updates | Tree structure for prefix sums | LC 307 Range Sum Query - Mutable, LC 315 Count of Smaller Numbers |
| 29 | **Reservoir Sampling** | Random sampling | Track k items from stream | LC 382 Linked List Random Node, LC 398 Random Pick Index |
| 30 | **LRU Cache** | Caching problems | Hashmap + doubly linked list | LC 146 LRU Cache, LC 460 LFU Cache |
| 31 | **Fibonacci Sequence** | DP problems | Compute iteratively or matrix exponentiation | LC 70 Climbing Stairs, LC 198 House Robber |

---

## 🚀 Advanced Patterns (32-50)

| # | Pattern | Description | Key Idea | Example Problems |
|---|---|---|---|---|
| 32 | **Morris Traversal** | Tree traversal without extra space | Threading without recursion/stack | LC 94 Binary Tree Inorder, LC 144 Binary Tree Preorder |
| 33 | **Boyer-Moore Majority Vote** | Finding majority elements | Voting algorithm in O(n) | LC 169 Majority Element, LC 229 Majority Element II |
| 34 | **Rolling Hash** | String/array comparison | Polynomial rolling hash for efficiency | LC 187 Repeated DNA Sequences, LC 1044 Longest Duplicate Substring |
| 35 | **Manacher's Algorithm** | Palindrome problems | Find all palindromes in linear time | LC 5 Longest Palindromic Substring, LC 647 Palindromic Substrings |
| 36 | **Catalan Numbers** | Counting nested structures | Count valid combinations | LC 22 Generate Parentheses, LC 96 Unique Binary Search Trees |
| 37 | **Game Theory (Minimax)** | Game-playing problems | Minimax with alpha-beta pruning | LC 464 Can I Win, LC 877 Stone Game |
| 38 | **Line Sweep** | Computational geometry | Process events in sorted order | LC 253 Meeting Rooms II, LC 218 The Skyline Problem |
| 39 | **Shortest Path Algorithms** | Graph path problems | Dijkstra's, Bellman-Ford, Floyd-Warshall | LC 787 Cheapest Flights Within K Stops, LC 1334 Find City With Smallest Neighbors |
| 40 | **Meet in the Middle** | Optimization for O(2^n) brute force | Split problem space, combine results | LC 18 4Sum, LC 1755 Closest Subsequence Sum |
| 41 | **Critical Connections** | Critical nodes/edges in graphs | DFS with low-link values (Tarjan's) | LC 1192 Critical Connections in a Network, LC 1568 Minimum Days to Disconnect Island |
| 42 | **Z-Algorithm** | String matching | Find all pattern occurrences in linear time | LC 28 Find Index of First Occurrence, LC 1392 Longest Happy Prefix |
| 43 | **Coordinate Compression** | Large coordinate ranges | Map large coords to smaller range | LC 391 Perfect Rectangle, LC 850 Rectangle Area II |
| 44 | **Convex Hull** | Computational geometry | Find convex hull of point set | LC 587 Erect the Fence, LC 1453 Maximum Darts Inside Circular Dartboard |
| 45 | **Sqrt Decomposition** | Range queries with updates | Divide array into √n blocks | LC 307 Range Sum Query - Mutable, LC 327 Count of Range Sum |
| 46 | **Heavy-Light Decomposition** | Tree path queries (Advanced) | Decompose into heavy/light edges | Tree path sum queries |
| 47 | **Network Flow (Max Flow)** | Flow optimization | Find max flow through network | Maximum bipartite matching, Min-cut problems |
| 48 | **Persistent Data Structures** | Multiple versions | Keep history of modifications | Version control, Functional programming |
| 49 | **Suffix Array/Tree** | String processing | Efficient substring operations | LC 1044 Longest Duplicate Substring, Advanced string algorithms |
| 50 | **Aho-Corasick Algorithm** | Multiple string matching | Automaton for multiple patterns | LC 1032 Stream of Characters, Multiple pattern search |

---

## How to Study

1. **Pick a pattern** (start with Core 1-15)
2. **Read the README** — when to use, template, pitfalls
3. **Solve problems in order** — easy → medium → hard
4. **Time yourself** — medium in 25 min, hard in 40 min
5. **Review mistakes** — write what went wrong, why
6. **Spaced repetition** — re-solve after 3, 7, 30 days

## Study Plan (12-16 weeks)

- **Weeks 1-4:** Core patterns 1-15 (the L4 essentials)
- **Weeks 5-8:** Core patterns 16-31 (advanced core)
- **Weeks 9-12:** Advanced patterns 32-50 (show up less but impressive)
- **Weeks 13-16:** Mock interviews, weak patterns, full review

## Interview Tips

- **First 2 min:** restate problem, ask clarifying questions
- **3-5 min:** discuss approach out loud, mention pattern
- **5-20 min:** code
- **Last 5 min:** test edge cases, discuss complexity
- **If stuck 10+ min:** say what you've tried, ask for hint

## Common Interview Mistakes

1. Jumping to code without thinking
2. Not testing edge cases (empty, 1 elem, duplicates)
3. Silent coding — interviewer can't help if they don't know what you're doing
4. Giving up — say what you've considered
5. Not discussing time/space at the end