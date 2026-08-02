# Pattern 12: Top K Elements

## When to use
- Find K largest/smallest
- Kth largest element
- Top K frequent
- K closest points to origin

## Template (TypeScript)

```ts
import { MinHeap } from "some-heap-lib";

function topK(nums: number[], k: number): number[] {
  const minHeap = new MinHeap();

  for (const num of nums) {
    minHeap.push(num);
    if (minHeap.size() > k) minHeap.pop();
  }

  return minHeap.toArray();
}
```

## Variations
- **K largest**: min-heap of size K (smallest of top-K at top, evicted when bigger comes)
- **K smallest**: max-heap of size K
- **K frequent**: hashmap count → heap with custom comparator
- **K closest**: custom comparator on distance

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Kth Largest Element | 215 | Medium | ☐ |
| 2 | Top K Frequent Elements | 347 | Medium | ☐ |
| 3 | Kth Largest in Stream | 703 | Easy | ☐ |
| 4 | K Closest Points to Origin | 973 | Medium | ☐ |
| 5 | Task Scheduler | 621 | Medium | ☐ |

## My key takeaways
_Fill after solving_