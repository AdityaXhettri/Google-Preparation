# Pattern 4: Merge Intervals

## When to use
- Overlapping intervals
- Meeting room scheduling
- Range merging
- Any problem involving [start, end] ranges

## Template (TypeScript)

```ts
function mergeIntervals(intervals: number[][]): number[][] {
  // 1. Sort by start
  intervals.sort((a, b) => a[0] - b[0]);

  const merged: number[][] = [];
  let current = intervals[0];

  for (const next of intervals.slice(1)) {
    if (next[0] <= current[1]) {
      // Overlap — extend current
      current[1] = Math.max(current[1], next[1]);
    } else {
      // No overlap — push current, start new
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);
  return merged;
}
```

## Variations
- **Merge overlapping** → combined result
- **Insert interval** → add new interval into sorted list, then merge
- **Intersect two lists** → common intervals
- **Conflict detection** → can attend all meetings?

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Merge Intervals | 56 | Medium | ☐ |
| 2 | Insert Interval | 57 | Medium | ☐ |
| 3 | Interval List Intersections | 986 | Medium | ☐ |
| 4 | Meeting Rooms II | 253 | Medium | ☐ |
| 5 | Non-overlapping Intervals | 435 | Medium | ☐ |

## My key takeaways
_Fill after solving_