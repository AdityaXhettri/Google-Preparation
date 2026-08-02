# Pattern 14: Dynamic Programming

## When to use
- Overlapping subproblems
- Optimal substructure
- Count ways, min/max cost, true/false reachability
- Strings, grids, sequences

## Two approaches

### Top-down (memoization)

```ts
function climbStairs(n: number): number {
  const memo = new Map<number, number>();
  function dp(i: number): number {
    if (i <= 2) return i;
    if (memo.has(i)) return memo.get(i)!;
    const result = dp(i - 1) + dp(i - 2);
    memo.set(i, result);
    return result;
  }
  return dp(n);
}
```

### Bottom-up (tabulation)

```ts
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}
```

## Sub-patterns
- **0/1 Knapsack**: choose each item once
- **Unbounded Knapsack**: choose each item many times (coin change)
- **LIS (Longest Increasing Subsequence)**: patience sort or DP
- **LCS / Edit Distance**: 2D DP on strings
- **Grid paths**: 2D DP with right/down moves
- **Bitmask DP**: state = subset (n ≤ 20)

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Climbing Stairs | 70 | Easy | ☐ |
| 2 | Coin Change | 322 | Medium | ☐ |
| 3 | Longest Increasing Subsequence | 300 | Medium | ☐ |
| 4 | 0/1 Knapsack | — | Medium | ☐ |
| 5 | Longest Common Subsequence | 1143 | Medium | ☐ |
| 6 | Edit Distance | 72 | Hard | ☐ |
| 7 | Word Break | 139 | Medium | ☐ |
| 8 | House Robber II | 213 | Medium | ☐ |

## My key takeaways
_Fill after solving_

**Key insight:** Identify the state (what changes between subproblems), then the recurrence.