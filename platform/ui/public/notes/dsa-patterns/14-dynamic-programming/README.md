# 14. Dynamic Programming

## When to use

Problems with **overlapping subproblems** and **optimal substructure**: solve small, reuse for big.

## When to recognize

- "Count number of ways"
- "Min/max cost to do X"
- "Find longest/shortest ... that satisfies..."
- "Is it possible to..."
- Recursion that solves same subproblems multiple times

## How to think about it

1. **Identify the state** — what changes between subproblems? (index, remaining amount, etc.)
2. **Find the recurrence** — `dp[i] = f(dp[i-1], dp[i-2], ...)`
3. **Base case** — what's the smallest problem?
4. **Memoize or tabulate** — top-down with memo, or bottom-up with table

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

### 0/1 Knapsack
Choose each item **once**:
```ts
// dp[i][w] = max value using first i items with weight limit w
for (let i = 1; i <= n; i++) {
  for (let w = 0; w <= W; w++) {
    if (weights[i-1] <= w) {
      dp[i][w] = Math.max(dp[i-1][w], dp[i-1][w-weights[i-1]] + values[i-1]);
    } else {
      dp[i][w] = dp[i-1][w];
    }
  }
}
```

### Unbounded Knapsack
Choose each item **any number of times** (coin change):
```ts
// dp[amount] = min coins to make amount
dp[0] = 0;
for (let i = 1; i <= amount; i++) {
  for (const coin of coins) {
    if (coin <= i) dp[i] = Math.min(dp[i], dp[i-coin] + 1);
  }
}
```

### Longest Increasing Subsequence (LIS)
O(n²) DP or **O(n log n) with patience sorting**:
```ts
function lengthOfLIS(nums: number[]): number {
  const tails: number[] = [];  // smallest ending value of LIS of length i+1
  for (const num of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = num;
  }
  return tails.length;
}
```

### Edit Distance (LCS variant)
```ts
// dp[i][j] = min ops to convert word1[0..i] to word2[0..j]
for (let i = 0; i <= m; i++) {
  for (let j = 0; j <= n; j++) {
    if (i === 0) dp[i][j] = j;
    else if (j === 0) dp[i][j] = i;
    else if (word1[i-1] === word2[j-1]) dp[i][j] = dp[i-1][j-1];
    else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  }
}
```

## How to choose approach

| Sub-pattern | Common problem |
|---|---|
| **Fibonacci-like** | Climbing stairs, house robber |
| **0/1 knapsack** | Subset sum, partition equal subset |
| **Unbounded knapsack** | Coin change, rod cutting |
| **LIS** | Longest increasing subsequence, Russian doll |
| **LCS / Edit distance** | Edit distance, longest common subsequence |
| **Grid paths** | Unique paths, min path sum |
| **Word break** | Word break, concatenated words |

## Common pitfalls

1. **Wrong base case** — off-by-one leads to wrong answer.
2. **State dimensions wrong** — missing one variable = wrong answer.
3. **Not memoizing** — TLE on recursive solution.
4. **Wrong recurrence direction** — think top-down: what does my answer depend on?

## Practice problems

1. **Easy:** LC 70 — Climbing Stairs
2. **Easy:** LC 198 — House Robber
3. **Medium:** LC 322 — Coin Change
4. **Medium:** LC 300 — Longest Increasing Subsequence
5. **Medium:** LC 1143 — Longest Common Subsequence
6. **Medium:** LC 139 — Word Break
7. **Hard:** LC 72 — Edit Distance
8. **Hard:** LC 10 — Regular Expression Matching