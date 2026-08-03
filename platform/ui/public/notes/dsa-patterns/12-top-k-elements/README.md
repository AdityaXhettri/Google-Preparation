# 12. Top K Elements

## When to use

Find the **K largest/smallest/most-frequent** elements in a collection. O(n log k) instead of O(n log n) for full sort.

## When to recognize

- "Top K frequent"
- "Kth largest"
- "K closest points to origin"
- "Top K hot articles"

## The trick: heap of size K

For **Kth largest** or **top K largest**: use a **min-heap of size K**. The top of the heap is the smallest of the top K — when a bigger element comes, pop and push. O(n log k).

For **Kth smallest** or **top K smallest**: use a **max-heap of size K**.

## Template — Kth largest

```ts
import { MinHeap } from "heap-js";

function findKthLargest(nums: number[], k: number): number {
  const heap = new MinHeap();
  for (const num of nums) {
    heap.push(num);
    if (heap.size() > k) heap.pop();
  }
  return heap.peek();
}
```

## Template — top K frequent

```ts
function topKFrequent(nums: number[], k: number): number[] {
  // Count frequencies
  const counts = new Map<number, number>();
  for (const n of nums) counts.set(n, (counts.get(n) ?? 0) + 1);

  // Min-heap of size k, ordered by count
  const heap = new MinHeap<{ num: number; count: number }>(
    (a, b) => a.count - b.count
  );
  for (const [num, count] of counts) {
    heap.push({ num, count });
    if (heap.size() > k) heap.pop();
  }
  return heap.toArray().map((x) => x.num);
}
```

## Variations

| Variation | Approach |
|---|---|
| **Kth largest** | Min-heap of size K |
| **Kth smallest** | Max-heap of size K |
| **Top K frequent** | Hashmap + heap with count comparator |
| **K closest points** | Custom comparator on distance |
| **Sort characters by frequency** | Same as top K frequent with chars |
| **Task scheduler** | Heap with cooldown |

## Why not just sort?

Full sort is O(n log n). Heap of size K is O(n log k). For k << n, much faster. For k = n, sort is fine.

## Common pitfalls

1. **Wrong heap type**: Kth largest = MIN-heap (smallest of top K at top).
2. **Heap comparator**: for top K frequent, sort by count, not by value.
3. **Forgetting size limit**: without `if (heap.size() > k) heap.pop()`, heap grows unbounded.

## Practice problems

1. **Medium:** LC 215 — Kth Largest Element
2. **Medium:** LC 347 — Top K Frequent Elements
3. **Medium:** LC 451 — Sort Characters By Frequency
4. **Medium:** LC 973 — K Closest Points to Origin
5. **Medium:** LC 621 — Task Scheduler