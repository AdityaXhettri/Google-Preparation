# Pattern 13: K-way Merge

## When to use
- Merge K sorted lists/arrays
- Find smallest K pairs from K sorted arrays
- Kth smallest in sorted matrix

## Template (TypeScript)

```ts
import { MinHeap } from "some-heap-lib";

class ListNode { val: number; next: ListNode | null; constructor(v: number) { this.val = v; this.next = null; } }

function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  const heap = new MinHeap<number>();
  for (const l of lists) {
    let curr = l;
    while (curr) {
      heap.push(curr.val);
      curr = curr.next;
    }
  }
  const dummy = new ListNode(0);
  let tail = dummy;
  while (heap.size()) {
    tail.next = new ListNode(heap.pop());
    tail = tail.next;
  }
  return dummy.next;
}
```

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Merge K Sorted Lists | 23 | Hard | ☐ |
| 2 | Kth Smallest Element in Sorted Matrix | 378 | Medium | ☐ |
| 3 | Smallest Number Range From K Lists | 632 | Hard | ☐ |

## My key takeaways
_Fill after solving_