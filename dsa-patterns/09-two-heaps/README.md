# Pattern 9: Two Heaps

## When to use
- Median of a data stream
- Sliding window median
- Partition into two halves
- Anything needing min/max from both ends

## Template (TypeScript)

```ts
import { MinHeap, MaxHeap } from "some-heap-lib";

class MedianFinder {
  private maxHeap = new MaxHeap(); // smaller half
  private minHeap = new MinHeap(); // larger half

  addNum(num: number): void {
    this.maxHeap.push(num);
    if (this.maxHeap.size() > this.minHeap.size() + 1) {
      this.minHeap.push(this.maxHeap.pop());
    }
    // Rebalance
    if (this.minHeap.size() && this.maxHeap.peek() > this.minHeap.peek()) {
      this.minHeap.push(this.maxHeap.pop());
      this.maxHeap.push(this.minHeap.pop());
    }
  }

  findMedian(): number {
    if (this.maxHeap.size() > this.minHeap.size()) return this.maxHeap.peek();
    return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
  }
}
```

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Find Median from Data Stream | 295 | Hard | ☐ |
| 2 | Sliding Window Median | 480 | Hard | ☐ |
| 3 | IPO (capital deployment) | 502 | Hard | ☐ |

## My key takeaways
_Fill after solving_

**Heaps in JS/TS:** No built-in. Use `mnemonist` or implement yourself with array + heapify.