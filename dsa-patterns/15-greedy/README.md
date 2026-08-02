# Pattern 15: Greedy

## When to use
- Local optimal → global optimal
- Sorting + choice
- Activity selection / interval scheduling
- When DP works but greedy is simpler

## Template (TypeScript)

```ts
function jumpGame(nums: number[]): boolean {
  let furthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > furthest) return false; // can't reach
    furthest = Math.max(furthest, i + nums[i]);
  }
  return true;
}
```

## When greedy works vs DP
- Greedy works when local choice doesn't block future better solutions
- When in doubt, try greedy. If counter-example, fall back to DP.

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Jump Game | 55 | Medium | ☐ |
| 2 | Gas Station | 134 | Medium | ☐ |
| 3 | Two City Scheduling | 1029 | Medium | ☐ |
| 4 | Merge Triplets to Form Target | 1899 | Medium | ☐ |

## My key takeaways
_Fill after solving_