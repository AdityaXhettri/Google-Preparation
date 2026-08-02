# 09. Two Heaps

## When to use

Problems where you need to **maintain two halves** of a dataset: a smaller half and a larger half. The boundary element (median) is what's tracked.

## When to recognize

- "Median of a data stream"
- "Sliding window median"
- "IPO (capital deployment)"
- "Find largest K elements while seeing stream"

## How it works

- **Max-heap** for the smaller half (top is the largest of small)
- **Min-heap** for the larger half (top is the smallest of large)
- Always keep sizes balanced: `maxHeap.size() >= minHeap.size()` and `maxHeap.size() <= minHeap.size() + 1`
- Median = `maxHeap.top()` (odd count) or avg of both tops (even count)

## Template

```ts
import { MinHeap, MaxHeap } from "heap-js";

class MedianFinder {
  maxHeap = new MaxHeap();  // smaller half
  minHeap = new MinHeap();  // larger half

  addNum(num: number): void {
    this.maxHeap.push(num);
    // Rebalance: ensure every element in maxHeap <= every in minHeap
    if (this.maxHeap.size() > this.minHeap.size() + 1) {
      this.minHeap.push(this.maxHeap.pop());
    }
    if (this.minHeap.size() && this.maxHeap.peek() > this.minHeap.peek()) {
      const a = this.maxHeap.pop(), b = this.minHeap.pop();
      this.maxHeap.push(b);
      this.minHeap.push(a);
    }
  }

  findMedian(): number {
    if (this.maxHeap.size() > this.minHeap.size()) return this.maxHeap.peek();
    return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
  }
}
```

## Variations

| Variation | Description |
|---|---|
| **Median from stream** | Insert into max-heap, rebalance |
| **Sliding window median** | Add right, remove left (lazy deletion) |
| **IPO** | Two heaps for available/unavailable projects |
| **Kth largest** | Top K — simpler, just min-heap of size K |

## Common pitfalls

1. **Wrong heap choice**: Kth largest uses MIN-heap of size K (smallest of top-K at top).
2. **JavaScript has no built-in heap** — use a library like `heap-js` or implement.
3. **Lazy deletion in sliding window**: mark old elements as invalid; skip on pop.

## Practice problems

1. **Hard:** LC 295 — Find Median from Data Stream
2. **Hard:** LC 480 — Sliding Window Median
3. **Hard:** LC 502 — IPO