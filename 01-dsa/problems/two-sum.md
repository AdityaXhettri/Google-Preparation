# Two Sum — Pattern: Hash Map Lookup

> **LeetCode #1.** First problem in any DSA list. The pattern here (hash map for O(1) lookup) repeats in ~30% of interview problems.

## Problem

Given an array `nums` and a `target`, return indices of two numbers that add up to target. Each input has exactly one solution. Can't reuse the same element twice.

```
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]   (because nums[0] + nums[1] = 9)
```

## Approach 1 — Brute Force (O(n²))

```ts
function twoSum(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}
```

Two nested loops. Try every pair. **Time: O(n²), Space: O(1).**

## Approach 2 — Hash Map (O(n)) ✅

**Insight:** For each number `nums[i]`, I need to know if `target - nums[i]` appeared earlier. A hash map gives O(1) lookup.

```ts
function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
```

**Time: O(n), Space: O(n).**

## Why this works
- One pass: each number is looked up once, stored once.
- Map lookup is O(1) amortized.
- We can return immediately when we find the complement because each input has exactly one solution.

## Edge cases to test
- [x] Negative numbers: `nums = [-3, 4, 3, 90], target = 0` → `[0, 2]`
- [x] Duplicates: `nums = [3, 3], target = 6` → `[0, 1]`
- [x] Two-element array: `nums = [1, 2], target = 3` → `[0, 1]`
- [x] Larger/smaller numbers: works for any int range

## Pattern Library — when to use this
- "Find pair / triplet / subset that matches a target"
- "Two-pass with hash map for O(n) lookup"

**Variants to practice next:**
- 3Sum (LeetCode #15) — sort + two pointers
- 4Sum (LeetCode #18) — recursion
- Two Sum II (sorted array) — two pointers instead of map
- Subarray Sum Equals K (#560) — prefix sum + map

## Takeaway
> Hash map is the go-to when you need **"have I seen this before?"** in O(1).