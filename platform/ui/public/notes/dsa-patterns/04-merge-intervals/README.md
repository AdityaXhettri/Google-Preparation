# 04. Merge Intervals

## When to use

Problems on **intervals** `[start, end]`. Common: merging overlapping intervals, scheduling, finding conflicts.

## When to recognize

- "Merge all overlapping intervals"
- "Insert interval"
- "Meeting rooms" (min number needed)
- "Non-overlapping intervals" (max count after removing overlaps)

## The key insight

**Sort by start time**. Once sorted, overlapping intervals are adjacent. Sweep left to right.

## Template — merge all overlapping

```ts
function merge(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);

  const merged: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr[0] <= last[1]) {
      // Overlap: extend end to max of both
      last[1] = Math.max(last[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}
```

## Variations

| Variation | Description |
|---|---|
| **Merge overlapping** | Combine into minimum non-overlapping set |
| **Insert interval** | Add new interval into sorted list, then merge |
| **Intersect two lists** | Find common overlap between two interval lists |
| **Conflict detection** | Can attend all meetings? (sort + check adjacent) |
| **Min meeting rooms** | Sweep line + max concurrent intervals |
| **Non-overlapping** | Greedy: sort by end time, keep compatible intervals |

## Common pitfalls

1. **Off-by-one on overlap check**: `curr[0] <= last[1]` is overlap (not `<`). Two intervals `[1,3]` and `[3,4]` overlap at point 3.
2. **Forget to sort** — without sorting, adjacent pairs in input aren't necessarily adjacent in time.
3. **Mutating input vs creating new array** — be explicit. Best to create new arrays to avoid surprises.

## Practice problems

1. **Easy:** LC 252 — Meeting Rooms
2. **Easy:** LC 228 — Summary Ranges
3. **Medium:** LC 56 — Merge Intervals
4. **Medium:** LC 57 — Insert Interval
5. **Medium:** LC 435 — Non-overlapping Intervals
6. **Medium:** LC 986 — Interval List Intersections
7. **Medium:** LC 253 — Meeting Rooms II