/**
 * Seed DSA problem bank.
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
  hints?: string[];
};

export const PROBLEMS: Problem[] = [
  // ---- Sliding Window ----
  { id: "sw-1", title: "Maximum Sum Subarray of Size K", pattern: "01-sliding-window", difficulty: "easy", leetcode: 643, description: "Find the maximum sum of any contiguous subarray of size K.", signature: "function maxSum(nums: number[], k: number): number", starterCode: `function maxSum(nums: number[], k: number): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [[2, 1, 5, 1, 3, 2], 3], output: 9 }, { input: [[2, 3, 4, 1, 5], 2], output: 7 }, { input: [[1, 2], 1], output: 2 }], hints: ["First window sum, then slide"] },
  { id: "sw-2", title: "Longest Substring Without Repeating Characters", pattern: "01-sliding-window", difficulty: "medium", leetcode: 3, description: "Given a string, find the length of the longest substring without repeating characters.", signature: "function lengthOfLongestSubstring(s: string): number", starterCode: `function lengthOfLongestSubstring(s: string): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: ["abcabcbb"], output: 3 }, { input: ["bbbbb"], output: 1 }, { input: ["pwwkew"], output: 3 }, { input: [""], output: 0 }], hints: ["Use a Set/Map to track seen chars"] },
  { id: "sw-3", title: "Minimum Window Substring", pattern: "01-sliding-window", difficulty: "hard", leetcode: 76, description: "Find the minimum window in s that contains all characters of t.", signature: "function minWindow(s: string, t: string): string", starterCode: `function minWindow(s: string, t: string): string {\n  // your code here\n  return "";\n}`, tests: [{ input: ["ADOBECODEBANC", "ABC"], output: "BANC" }, { input: ["a", "a"], output: "a" }, { input: ["a", "aa"], output: "" }] },

  // ---- Two Pointers ----
  { id: "tp-1", title: "Two Sum II (Sorted Array)", pattern: "02-two-pointers", difficulty: "easy", leetcode: 167, description: "Find two numbers that add to target. Return 1-indexed positions.", signature: "function twoSum(nums: number[], target: number): number[]", starterCode: `function twoSum(nums: number[], target: number): number[] {\n  // your code here\n  return [-1, -1];\n}`, tests: [{ input: [[2, 7, 11, 15], 9], output: [1, 2] }, { input: [[2, 3, 4], 6], output: [1, 3] }, { input: [[-1, 0], -1], output: [1, 2] }] },
  { id: "tp-2", title: "3Sum", pattern: "02-two-pointers", difficulty: "medium", leetcode: 15, description: "Find all unique triplets that sum to zero.", signature: "function threeSum(nums: number[]): number[][]", starterCode: `function threeSum(nums: number[]): number[][] {\n  // your code here\n  return [];\n}`, tests: [{ input: [[-1, 0, 1, 2, -1, -4]], output: [[-1, -1, 2], [-1, 0, 1]] }, { input: [[0, 1, 1]], output: [] }, { input: [[0, 0, 0]], output: [[0, 0, 0]] }], hints: ["Sort first, then fix one and two-pointer the rest"] },
  { id: "tp-3", title: "Container With Most Water", pattern: "02-two-pointers", difficulty: "medium", leetcode: 11, description: "Find two lines that form a container holding the most water.", signature: "function maxArea(height: number[]): number", starterCode: `function maxArea(height: number[]): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], output: 49 }, { input: [[1, 1]], output: 1 }] },

  // ---- Fast & Slow ----
  { id: "fs-1", title: "Happy Number", pattern: "03-fast-slow-pointers", difficulty: "easy", leetcode: 202, description: "Determine if a number is happy (sum of squares of digits eventually reaches 1).", signature: "function isHappy(n: number): boolean", starterCode: `function isHappy(n: number): boolean {\n  // your code here\n  return false;\n}`, tests: [{ input: [19], output: true }, { input: [2], output: false }, { input: [1], output: true }], hints: ["Cycle detection with two pointers"] },

  // ---- Merge Intervals ----
  { id: "mi-1", title: "Merge Intervals", pattern: "04-merge-intervals", difficulty: "medium", leetcode: 56, description: "Merge all overlapping intervals.", signature: "function merge(intervals: number[][]): number[][]", starterCode: `function merge(intervals: number[][]): number[][] {\n  // your code here\n  return [];\n}`, tests: [{ input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], output: [[1, 6], [8, 10], [15, 18]] }, { input: [[[1, 4], [4, 5]]], output: [[1, 5]] }] },

  // ---- Cyclic Sort ----
  { id: "cs-1", title: "Missing Number", pattern: "05-cyclic-sort", difficulty: "easy", leetcode: 268, description: "Find the missing number in [0, n].", signature: "function missingNumber(nums: number[]): number", starterCode: `function missingNumber(nums: number[]): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [[3, 0, 1]], output: 2 }, { input: [[0, 1]], output: 2 }, { input: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], output: 8 }] },
  { id: "cs-2", title: "First Missing Positive", pattern: "05-cyclic-sort", difficulty: "hard", leetcode: 41, description: "Find the smallest missing positive integer in O(n) time, O(1) space.", signature: "function firstMissingPositive(nums: number[]): number", starterCode: `function firstMissingPositive(nums: number[]): number {\n  // your code here\n  return 1;\n}`, tests: [{ input: [[1, 2, 0]], output: 3 }, { input: [[3, 4, -1, 1]], output: 2 }, { input: [[7, 8, 9, 11, 12]], output: 1 }] },

  // ---- Tree BFS ----
  { id: "tb-1", title: "Maximum Depth of Binary Tree", pattern: "07-tree-bfs", difficulty: "easy", leetcode: 104, description: "Find the maximum depth of a binary tree.", signature: "function maxDepth(root: any): number", starterCode: `function maxDepth(root) {\n  // your code here\n  return 0;\n}`, tests: [{ input: [{ val: 3, left: { val: 9 }, right: { val: 20, left: { val: 15 }, right: { val: 7 } } }], output: 3 }] },

  // ---- Tree DFS ----
  { id: "td-1", title: "Validate Binary Search Tree", pattern: "08-tree-dfs", difficulty: "medium", leetcode: 98, description: "Determine if a binary tree is a valid BST.", signature: "function isValidBST(root: any): boolean", starterCode: `function isValidBST(root) {\n  // your code here\n  return true;\n}`, tests: [{ input: [{ val: 2, left: { val: 1 }, right: { val: 3 } }], output: true }, { input: [{ val: 5, left: { val: 1 }, right: { val: 4, left: { val: 3 }, right: { val: 6 } } }], output: false }] },

  // ---- Subsets ----
  { id: "sb-1", title: "Subsets", pattern: "10-subsets-backtracking", difficulty: "medium", leetcode: 78, description: "Return all subsets of a set of distinct integers.", signature: "function subsets(nums: number[]): number[][]", starterCode: `function subsets(nums: number[]): number[][] {\n  // your code here\n  return [];\n}`, tests: [{ input: [[1, 2, 3]], output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] }, { input: [[0]], output: [[], [0]] }] },

  // ---- Binary Search ----
  { id: "bs-1", title: "Binary Search", pattern: "11-binary-search", difficulty: "easy", leetcode: 704, description: "Classic binary search. Return index of target, or -1.", signature: "function search(nums: number[], target: number): number", starterCode: `function search(nums: number[], target: number): number {\n  // your code here\n  return -1;\n}`, tests: [{ input: [[-1, 0, 3, 5, 9, 12], 9], output: 4 }, { input: [[-1, 0, 3, 5, 9, 12], 2], output: -1 }] },
  { id: "bs-2", title: "Search in Rotated Sorted Array", pattern: "11-binary-search", difficulty: "medium", leetcode: 33, description: "Search target in rotated sorted array. O(log n).", signature: "function search(nums: number[], target: number): number", starterCode: `function search(nums: number[], target: number): number {\n  // your code here\n  return -1;\n}`, tests: [{ input: [[4, 5, 6, 7, 0, 1, 2], 0], output: 4 }, { input: [[4, 5, 6, 7, 0, 1, 2], 3], output: -1 }] },

  // ---- Top K ----
  { id: "tk-1", title: "Kth Largest Element", pattern: "12-top-k-elements", difficulty: "medium", leetcode: 215, description: "Find the kth largest element in an unsorted array.", signature: "function findKthLargest(nums: number[], k: number): number", starterCode: `function findKthLargest(nums: number[], k: number): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [[3, 2, 1, 5, 6, 4], 2], output: 5 }, { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], output: 4 }] },

  // ---- DP ----
  { id: "dp-1", title: "Climbing Stairs", pattern: "14-dynamic-programming", difficulty: "easy", leetcode: 70, description: "Ways to climb n stairs if you can take 1 or 2 at a time.", signature: "function climbStairs(n: number): number", starterCode: `function climbStairs(n: number): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [2], output: 2 }, { input: [3], output: 3 }, { input: [10], output: 89 }] },
  { id: "dp-2", title: "Coin Change", pattern: "14-dynamic-programming", difficulty: "medium", leetcode: 322, description: "Fewest coins to make amount. Return -1 if impossible.", signature: "function coinChange(coins: number[], amount: number): number", starterCode: `function coinChange(coins: number[], amount: number): number {\n  // your code here\n  return -1;\n}`, tests: [{ input: [[1, 5, 10, 25], 30], output: 2 }, { input: [[2], 3], output: -1 }, { input: [[1], 0], output: 0 }] },
  { id: "dp-3", title: "Longest Increasing Subsequence", pattern: "14-dynamic-programming", difficulty: "medium", leetcode: 300, description: "Length of longest strictly increasing subsequence.", signature: "function lengthOfLIS(nums: number[]): number", starterCode: `function lengthOfLIS(nums: number[]): number {\n  // your code here\n  return 0;\n}`, tests: [{ input: [[10, 9, 2, 5, 3, 7, 101, 18]], output: 4 }, { input: [[0, 1, 0, 3, 2, 3]], output: 4 }] },

  // ---- Greedy ----
  { id: "gr-1", title: "Jump Game", pattern: "15-greedy", difficulty: "medium", leetcode: 55, description: "Can you reach the last index? Each nums[i] = max jump.", signature: "function canJump(nums: number[]): boolean", starterCode: `function canJump(nums: number[]): boolean {\n  // your code here\n  return false;\n}`, tests: [{ input: [[2, 3, 1, 1, 4]], output: true }, { input: [[3, 2, 1, 0, 4]], output: false }] },

  // ---- Topological Sort ----
  { id: "ts-1", title: "Course Schedule", pattern: "16-graphs-topological-sort", difficulty: "medium", leetcode: 207, description: "Can you finish all courses given prerequisites?", signature: "function canFinish(numCourses: number, prerequisites: number[][]): boolean", starterCode: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n  // your code here\n  return true;\n}`, tests: [{ input: [2, [[1, 0]]], output: true }, { input: [2, [[1, 0], [0, 1]]], output: false }] },
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