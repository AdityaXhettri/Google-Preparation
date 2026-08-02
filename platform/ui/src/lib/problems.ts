/**
 * Seed DSA problem bank.
 * Each problem has 3 progressive hints: [subtle, medium, pseudocode].
 */

export type TestCase = { input: unknown[]; output: unknown };
export type Problem = {
  id: string;
  title: string;
  pattern: string;
  difficulty: "easy" | "medium" | "hard";
  leetcode?: number;
  description: string;
  signature: string;
  starterCode: string;
  tests: TestCase[];
  hints?: [string, string, string];
  tags?: string[];
  optimalTime?: string;
  optimalSpace?: string;
};

export const PROBLEMS: Problem[] = [
  // ---- Sliding Window ----
  { id: "sw-1", title: "Maximum Sum Subarray of Size K", pattern: "01-sliding-window", difficulty: "easy", leetcode: 643, description: "Find the maximum sum of any contiguous subarray of size K.", signature: "function maxSum(nums: number[], k: number): number", starterCode: `function maxSum(nums: number[], k: number): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [[2, 1, 5, 1, 3, 2], 3], output: 9 }, { input: [[2, 3, 4, 1, 5], 2], output: 7 }, { input: [[1, 2], 1], output: 2 }], hints: [
    "If you had to sum the first K elements, then move one step right, would you re-sum everything or just adjust?",
    "Don't re-add the whole window. When you slide, you remove one element and add one element.",
    "Compute first window sum → store as max. Loop from i=k to n: windowSum += nums[i] - nums[i-k]; update max.",
  ], tags: ["array", "sliding-window"], optimalTime: "O(n)", optimalSpace: "O(1)" },

  { id: "sw-2", title: "Longest Substring Without Repeating Characters", pattern: "01-sliding-window", difficulty: "medium", leetcode: 3, description: "Given a string, find the length of the longest substring without repeating characters.", signature: "function lengthOfLongestSubstring(s: string): number", starterCode: `function lengthOfLongestSubstring(s: string): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: ["abcabcbb"], output: 3 }, { input: ["bbbbb"], output: 1 }, { input: ["pwwkew"], output: 3 }, { input: [""], output: 0 }], hints: [
    "What happens when you see a character you already have? Can you 'jump' over duplicates?",
    "Track the last position you saw each character. When you see a repeat, move your left pointer past the old one.",
    "Maintain a Map<char, lastIndex>. For each char, if seen and index >= left, set left = lastIndex + 1. Track max length.",
  ], tags: ["string", "sliding-window", "hash-map"], optimalTime: "O(n)", optimalSpace: "O(min(n, alphabet))" },

  { id: "sw-3", title: "Minimum Window Substring", pattern: "01-sliding-window", difficulty: "hard", leetcode: 76, description: "Find the minimum window in s that contains all characters of t.", signature: "function minWindow(s: string, t: string): string", starterCode: `function minWindow(s: string, t: string): string {\n  // your code here\n  return "";\n}`, tests: [{ input: ["ADOBECODEBANC", "ABC"], output: "BANC" }, { input: ["a", "a"], output: "a" }, { input: ["a", "aa"], output: "" }], hints: [
    "You need to track which characters from t you've 'satisfied' in your current window. How do you know when all are satisfied?",
    "Use a count map for chars in t, and a 'have' counter of how many are satisfied. Expand right, then shrink left when have == need.",
    "Count map, have=0, need=t.length. Expand right: decrement count; if count >= 0, have++. While have==need: update answer, shrink left, increment count back.",
  ], tags: ["string", "sliding-window", "hash-map"], optimalTime: "O(n)", optimalSpace: "O(|t|)" },

  // ---- Two Pointers ----
  { id: "tp-1", title: "Two Sum II (Sorted Array)", pattern: "02-two-pointers", difficulty: "easy", leetcode: 167, description: "Find two numbers that add to target. Return 1-indexed positions.", signature: "function twoSum(nums: number[], target: number): number[]", starterCode: `function twoSum(nums: number[], target: number): number[] {\n  // your code here\n  return [-1, -1];\n}`, tests: [{ input: [[2, 7, 11, 15], 9], output: [1, 2] }, { input: [[2, 3, 4], 6], output: [1, 3] }, { input: [[-1, 0], -1], output: [1, 2] }], hints: [
    "The array is sorted. If you start at both ends, what does the sum tell you about which pointer to move?",
    "If sum < target, you need a bigger number — move left right. If sum > target, you need a smaller number — move right left.",
    "left=0, right=n-1. While left<right: sum=nums[left]+nums[right]. If sum===target return. If < target, left++. Else right--.",
  ], tags: ["array", "two-pointers", "binary-search"], optimalTime: "O(n)", optimalSpace: "O(1)" },

  { id: "tp-2", title: "3Sum", pattern: "02-two-pointers", difficulty: "medium", leetcode: 15, description: "Find all unique triplets that sum to zero.", signature: "function threeSum(nums: number[]): number[][]", starterCode: `function threeSum(nums: number[]): number[][] {\n  // your code here\n  return [];\n}`, tests: [{ input: [[-1, 0, 1, 2, -1, -4]], output: [[-1, -1, 2], [-1, 0, 1]] }, { input: [[0, 1, 1]], output: [] }, { input: [[0, 0, 0]], output: [[0, 0, 0]] }], hints: [
    "Can you reduce this to 'Two Sum' by fixing one element? What's left?",
    "Sort the array. For each i, find two numbers after i that sum to -nums[i]. Skip duplicates.",
    "Sort nums. For i from 0 to n-3, skip i if duplicate. Set left=i+1, right=n-1. While left<right: compute sum, if zero add, move both skipping duplicates.",
  ], tags: ["array", "two-pointers", "sorting"], optimalTime: "O(n²)", optimalSpace: "O(1) or O(n) for output" },

  { id: "tp-3", title: "Container With Most Water", pattern: "02-two-pointers", difficulty: "medium", leetcode: 11, description: "Find two lines that form a container holding the most water.", signature: "function maxArea(height: number[]): number", starterCode: `function maxArea(height: number[]): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], output: 49 }, { input: [[1, 1]], output: 1 }], hints: [
    "Width matters but the SHORTER line limits height. If you move the shorter line, you might find a taller one.",
    "Greedy: start with max width (left=0, right=n-1). Move the pointer with the SHORTER line inward.",
    "left=0, right=n-1, max=0. While left<right: max = max(max, (right-left)*min(height[left], height[right])); move the smaller height.",
  ], tags: ["array", "two-pointers", "greedy"], optimalTime: "O(n)", optimalSpace: "O(1)" },

  // ---- Fast & Slow ----
  { id: "fs-1", title: "Happy Number", pattern: "03-fast-slow-pointers", difficulty: "easy", leetcode: 202, description: "Determine if a number is happy (sum of squares of digits eventually reaches 1).", signature: "function isHappy(n: number): boolean", starterCode: `function isHappy(n: number): boolean {\n  // your code here\n  return false;\n}`, tests: [{ input: [19], output: true }, { input: [2], output: false }, { input: [1], output: true }], hints: [
    "If a number is not happy, what eventually happens? Trace 2 → 4 → 16 → 37 → ... it cycles. How do you detect a cycle?",
    "Two runners: slow does 1 step (sum of squares), fast does 2 steps. If they're ever equal, you're in a cycle. Cycle means not happy.",
    "Define next(x) = sum of squares of digits. slow=n, fast=n. While slow!==fast: slow=next(slow), fast=next(next(fast)). Return slow===1.",
  ], tags: ["math", "two-pointers", "hash-set"], optimalTime: "O(log n)", optimalSpace: "O(1)" },

  // ---- Merge Intervals ----
  { id: "mi-1", title: "Merge Intervals", pattern: "04-merge-intervals", difficulty: "medium", leetcode: 56, description: "Merge all overlapping intervals.", signature: "function merge(intervals: number[][]): number[][]", starterCode: `function merge(intervals: number[][]): number[][] {\n  // your code here\n  return [];\n}`, tests: [{ input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], output: [[1, 6], [8, 10], [15, 18]] }, { input: [[[1, 4], [4, 5]]], output: [[1, 5]] }], hints: [
    "If intervals are sorted by start time, can you tell if two are overlapping just by looking at the end of the previous and start of the next?",
    "Sort by start. Walk through: if current.start <= last.end, they overlap — extend last.end. Otherwise, push current as a new interval.",
    "Sort intervals by [0]. Init merged=[intervals[0]]. For each next: if next[0]<=merged[last][1], merged[last][1]=max(merged[last][1], next[1]). Else push.",
  ], tags: ["array", "sorting", "intervals"], optimalTime: "O(n log n)", optimalSpace: "O(n)" },

  // ---- Cyclic Sort ----
  { id: "cs-1", title: "Missing Number", pattern: "05-cyclic-sort", difficulty: "easy", leetcode: 268, description: "Find the missing number in [0, n].", signature: "function missingNumber(nums: number[]): number", starterCode: `function missingNumber(nums: number[]): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [[3, 0, 1]], output: 2 }, { input: [[0, 1]], output: 2 }, { input: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], output: 8 }], hints: [
    "Each number from 0 to n belongs at index = that number. After sorting to that pattern, where is the missing one?",
    "Walk through the array. While nums[i] is in [0,n] and nums[i] !== i, swap nums[i] to its correct position. The first index where nums[i] !== i is the answer.",
    "i=0. While i<n: correct=nums[i]; if correct<n && nums[correct]!==correct, swap(nums, i, correct). Else i++. Return index where nums[i] !== i, or n if all match.",
  ], tags: ["array", "cyclic-sort"], optimalTime: "O(n)", optimalSpace: "O(1)" },

  { id: "cs-2", title: "First Missing Positive", pattern: "05-cyclic-sort", difficulty: "hard", leetcode: 41, description: "Find the smallest missing positive integer in O(n) time, O(1) space.", signature: "function firstMissingPositive(nums: number[]): number", starterCode: `function firstMissingPositive(nums: number[]): number {\n  // your code here\n  return 1;\n}`, tests: [{ input: [[1, 2, 0]], output: 3 }, { input: [[3, 4, -1, 1]], output: 2 }, { input: [[7, 8, 9, 11, 12]], output: 1 }], hints: [
    "For each position i, where should the number i+1 ideally go? Use the array itself as a hash table by swapping.",
    "Each positive number x (1 <= x <= n) should be at index x-1. Swap nums[i] to its place. After this, the first wrong index is the answer.",
    "For each i: while nums[i] is in [1,n] and nums[nums[i]-1] !== nums[i], swap. Then iterate to find first i where nums[i] !== i+1. Return i+1 (or n+1 if all match).",
  ], tags: ["array", "cyclic-sort", "hash-set"], optimalTime: "O(n)", optimalSpace: "O(1)" },

  // ---- Tree BFS ----
  { id: "tb-1", title: "Maximum Depth of Binary Tree", pattern: "07-tree-bfs", difficulty: "easy", leetcode: 104, description: "Find the maximum depth of a binary tree.", signature: "function maxDepth(root: any): number", starterCode: `function maxDepth(root) {\n  // your code here\n  return 0;\n}`, tests: [{ input: [{ val: 3, left: { val: 9 }, right: { val: 20, left: { val: 15 }, right: { val: 7 } } }], output: 3 }], hints: [
    "BFS levels: process one level at a time. How do you know when a level ends?",
    "Take a snapshot of queue.length at the start of each level. Process that many nodes, then move to the next level.",
    "If !root return 0. queue=[root], depth=0. While queue.length: size=queue.length; loop size times: shift node, push children. depth++.",
  ], tags: ["tree", "bfs", "binary-tree"], optimalTime: "O(n)", optimalSpace: "O(n)" },

  // ---- Tree DFS ----
  { id: "td-1", title: "Validate Binary Search Tree", pattern: "08-tree-dfs", difficulty: "medium", leetcode: 98, description: "Determine if a binary tree is a valid BST.", signature: "function isValidBST(root: any): boolean", starterCode: `function isValidBST(root) {\n  // your code here\n  return true;\n}`, tests: [{ input: [{ val: 2, left: { val: 1 }, right: { val: 3 } }], output: true }, { input: [{ val: 5, left: { val: 1 }, right: { val: 4, left: { val: 3 }, right: { val: 6 } } }], output: false }], hints: [
    "Just checking parent > left and parent < right isn't enough. Why? Think about a node deep in the tree.",
    "Each node must be within a (min, max) range inherited from its ancestors. Pass the allowed range down the recursion.",
    "Helper(root, min, max): if !root return true. If root.val <= min || root.val >= max return false. Recurse on left with (min, root.val) and right with (root.val, max).",
  ], tags: ["tree", "dfs", "bst"], optimalTime: "O(n)", optimalSpace: "O(h)" },

  // ---- Subsets ----
  { id: "sb-1", title: "Subsets", pattern: "10-subsets-backtracking", difficulty: "medium", leetcode: 78, description: "Return all subsets of a set of distinct integers.", signature: "function subsets(nums: number[]): number[][]", starterCode: `function subsets(nums: number[]): number[][] {\n  // your code here\n  return [];\n}`, tests: [{ input: [[1, 2, 3]], output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] }, { input: [[0]], output: [[], [0]] }], hints: [
    "For each element, you have 2 choices: include it or skip it. How do you enumerate all combinations?",
    "Backtracking: at each step, decide to include or skip. Push current subset to result, then recurse.",
    "Backtrack(start, path): result.push([...path]). For i from start to n: path.push(nums[i]); backtrack(i+1, path); path.pop().",
  ], tags: ["array", "backtracking"], optimalTime: "O(2^n)", optimalSpace: "O(n)" },

  // ---- Binary Search ----
  { id: "bs-1", title: "Binary Search", pattern: "11-binary-search", difficulty: "easy", leetcode: 704, description: "Classic binary search. Return index of target, or -1.", signature: "function search(nums: number[], target: number): number", starterCode: `function search(nums: number[], target: number): number {\n  // your code here\n  return -1;\n}`, tests: [{ input: [[-1, 0, 3, 5, 9, 12], 9], output: 4 }, { input: [[-1, 0, 3, 5, 9, 12], 2], output: -1 }], hints: [
    "Each comparison eliminates half the array. What's the middle? How do you decide which half to keep?",
    "Compare target with nums[mid]. If equal, done. If target < nums[mid], search left half. Else right half.",
    "lo=0, hi=n-1. While lo<=hi: mid=(lo+hi)>>1. If nums[mid]===target return mid. If target<nums[mid] hi=mid-1. Else lo=mid+1. Return -1.",
  ], tags: ["array", "binary-search"], optimalTime: "O(log n)", optimalSpace: "O(1)" },

  { id: "bs-2", title: "Search in Rotated Sorted Array", pattern: "11-binary-search", difficulty: "medium", leetcode: 33, description: "Search target in rotated sorted array. O(log n).", signature: "function search(nums: number[], target: number): number", starterCode: `function search(nums: number[], target: number): number {\n  // your code here\n  return -1;\n}`, tests: [{ input: [[4, 5, 6, 7, 0, 1, 2], 0], output: 4 }, { input: [[4, 5, 6, 7, 0, 1, 2], 3], output: -1 }], hints: [
    "In a rotated array, one half is always sorted. Which one — left or right?",
    "Check if nums[mid] >= nums[lo]. If yes, left half is sorted. If target is in [nums[lo], nums[mid]], search left; else right.",
    "lo, hi. While lo<=hi: mid=(lo+hi)>>1. If nums[mid]===target return mid. If nums[lo]<=nums[mid]: if nums[lo]<=target<nums[mid] hi=mid-1 else lo=mid+1. Else (right sorted): if nums[mid]<target<=nums[hi] lo=mid+1 else hi=mid-1.",
  ], tags: ["array", "binary-search"], optimalTime: "O(log n)", optimalSpace: "O(1)" },

  // ---- Top K ----
  { id: "tk-1", title: "Kth Largest Element", pattern: "12-top-k-elements", difficulty: "medium", leetcode: 215, description: "Find the kth largest element in an unsorted array.", signature: "function findKthLargest(nums: number[], k: number): number", starterCode: `function findKthLargest(nums: number[], k: number): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [[3, 2, 1, 5, 6, 4], 2], output: 5 }, { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], output: 4 }], hints: [
    "What's the simplest data structure for tracking the K largest items you've seen?",
    "Use a min-heap of size K. The smallest of the K largest is at the top. When a new number is bigger, pop and push.",
    "Build min-heap from first k. For i from k to n-1: if nums[i]>heap.top(), heap.pop() then heap.push(nums[i]). Return heap.top().",
  ], tags: ["heap", "top-k", "sorting"], optimalTime: "O(n log k)", optimalSpace: "O(k)" },

  // ---- DP ----
  { id: "dp-1", title: "Climbing Stairs", pattern: "14-dynamic-programming", difficulty: "easy", leetcode: 70, description: "Ways to climb n stairs if you can take 1 or 2 at a time.", signature: "function climbStairs(n: number): number", starterCode: `function climbStairs(n: number): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [2], output: 2 }, { input: [3], output: 3 }, { input: [10], output: 89 }], hints: [
    "How many ways to reach step n? It depends on n-1 and n-2. Why?",
    "f(n) = f(n-1) + f(n-2). What does this look like?",
    "Two variables: prev2=1 (for n=1), prev1=2 (for n=2). Loop from 3 to n: curr=prev1+prev2, shift. Return prev1.",
  ], tags: ["dp", "fibonacci"], optimalTime: "O(n)", optimalSpace: "O(1)" },

  { id: "dp-2", title: "Coin Change", pattern: "14-dynamic-programming", difficulty: "medium", leetcode: 322, description: "Fewest coins to make amount. Return -1 if impossible.", signature: "function coinChange(coins: number[], amount: number): number", starterCode: `function coinChange(coins: number[], amount: number): number {\n  // your code here\n  return -1;\n}`, tests: [{ input: [[1, 5, 10, 25], 30], output: 2 }, { input: [[2], 3], output: -1 }, { input: [[1], 0], output: 0 }], hints: [
    "What's the fewest coins for amount N? Think about which coin you use last.",
    "dp[i] = min(dp[i], dp[i-coin]+1) for each coin. Base: dp[0]=0.",
    "dp = [Infinity]*(amount+1); dp[0]=0. For i=1..amount: for coin in coins: if coin<=i dp[i]=min(dp[i], dp[i-coin]+1). Return dp[amount] if finite else -1.",
  ], tags: ["dp", "array"], optimalTime: "O(n*amount)", optimalSpace: "O(amount)" },

  { id: "dp-3", title: "Longest Increasing Subsequence", pattern: "14-dynamic-programming", difficulty: "medium", leetcode: 300, description: "Length of longest strictly increasing subsequence.", signature: "function lengthOfLIS(nums: number[]): number", starterCode: `function lengthOfLIS(nums: number[]): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [[10, 9, 2, 5, 3, 7, 101, 18]], output: 4 }, { input: [[0, 1, 0, 3, 2, 3]], output: 4 }], hints: [
    "For each number, what's the LIS ending at that position? It depends on previous smaller numbers.",
    "DP: dp[i] = 1 + max(dp[j]) for all j<i where nums[j]<nums[i]. Final answer is max of all dp[i].",
    "Tail array (patience sort O(n log n)): maintain sorted tail of smallest endings. For each x, binary search position to replace. Length of tail is answer.",
  ], tags: ["dp", "binary-search"], optimalTime: "O(n log n) with patience sort", optimalSpace: "O(n)" },

  // ---- Greedy ----
  { id: "gr-1", title: "Jump Game", pattern: "15-greedy", difficulty: "medium", leetcode: 55, description: "Can you reach the last index? Each nums[i] = max jump.", signature: "function canJump(nums: number[]): boolean", starterCode: `function canJump(nums: number[]): boolean {\n  // your code here\n  return false;\n}`, tests: [{ input: [[2, 3, 1, 1, 4]], output: true }, { input: [[3, 2, 1, 0, 4]], output: false }], hints: [
    "At each index, you can reach anywhere from i to i+nums[i]. What's the FURTHEST you can reach at any point?",
    "Track the furthest index reachable so far. If at any i, i > furthest, you can't reach here. Update furthest = max(furthest, i + nums[i]).",
    "furthest=0. For i from 0 to n-1: if i>furthest return false. furthest = max(furthest, i+nums[i]). Return true.",
  ], tags: ["array", "greedy"], optimalTime: "O(n)", optimalSpace: "O(1)" },

  // ---- Topological Sort ----
  { id: "ts-1", title: "Course Schedule", pattern: "16-graphs-topological-sort", difficulty: "medium", leetcode: 207, description: "Can you finish all courses given prerequisites?", signature: "function canFinish(numCourses: number, prerequisites: number[][]): boolean", starterCode: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n  // your code here\n  return true;\n}`, tests: [{ input: [2, [[1, 0]]], output: true }, { input: [2, [[1, 0], [0, 1]]], output: false }], hints: [
    "If there's a cycle in the prerequisite graph, you can't finish. How do you detect a cycle in a directed graph?",
    "Topological sort: process nodes with in-degree 0, then remove their edges. If you can't process all nodes, there's a cycle.",
    "Build in-degree array and graph. Queue all in-degree 0. Process: for each, decrement neighbors' in-degree, enqueue new zeros. Return count==numCourses.",
  ], tags: ["graph", "bfs", "topological-sort"], optimalTime: "O(V+E)", optimalSpace: "O(V+E)" },
];

export const PATTERNS = Array.from(new Set(PROBLEMS.map((p) => p.pattern))).sort();

export function problemsByPattern(pattern: string): Problem[] {
  return PROBLEMS.filter((p) => p.pattern === pattern);
}

export function getProblem(id: string): Problem | undefined {
  return PROBLEMS.find((p) => p.id === id);
}

export function randomProblem(pattern?: string, difficulty?: Problem["difficulty"]): Problem {
  let pool = PROBLEMS;
  if (pattern) pool = pool.filter((p) => p.pattern === pattern);
  if (difficulty) pool = pool.filter((p) => p.difficulty === difficulty);
  if (pool.length === 0) pool = PROBLEMS;
  return pool[Math.floor(Math.random() * pool.length)];
}