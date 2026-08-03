# 15. Greedy

## When to use

Make the **locally optimal choice** at each step, hoping it leads to the global optimum. Works for some problems, fails for others.

## When to recognize

- Activity selection / interval scheduling
- Jump game
- "Maximize/minimize" with no constraints that need careful ordering
- When DP works but is overkill

## When greedy works (vs when it doesn't)

**Greedy works** when local choice doesn't block a better global solution.
- Activity selection: pick earliest-ending activity first
- Jump game: track furthest reachable

**Greedy FAILS** when local choice blocks better future:
- Knapsack: greedy by value/weight ratio fails — need DP
- Shortest path with negative weights: need Bellman-Ford, not Dijkstra

**Rule of thumb:** try greedy first. If counter-example exists, fall back to DP.

## Template — Jump Game

```ts
function canJump(nums: number[]): boolean {
  let furthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > furthest) return false;  // can't reach here
    furthest = Math.max(furthest, i + nums[i]);
  }
  return true;
}
```

## Variations

| Variation | Greedy choice |
|---|---|
| **Jump game** | Track furthest reachable |
| **Gas station** | Net surplus at each stop |
| **Activity selection** | Sort by end time, pick non-conflicting |
| **Two city scheduling** | Sort by cost difference, send cheapest half |
| **Candy** | Two passes — left-to-right + right-to-left |

## Common pitfalls

1. **Assume greedy works** — verify with a counter-example. If fails, DP.
2. **Wrong sort order** — for activity selection, sort by END time, not start.
3. **Miss edge cases** — empty array, single element.

## Practice problems

1. **Medium:** LC 55 — Jump Game
2. **Medium:** LC 45 — Jump Game II
3. **Medium:** LC 134 — Gas Station
4. **Medium:** LC 1029 — Two City Scheduling
5. **Hard:** LC 135 — Candy