# 13. K-way Merge

## When to use

Merge **K sorted** inputs into one sorted output. Common with linked lists, sorted arrays.

## When to recognize

- "Merge K sorted lists"
- "Kth smallest in sorted matrix"
- "Smallest number range from K lists"

## How it works

Use a **min-heap** of size K holding the next element from each list. Pop smallest, push the next from that list. Repeat.

## Template — Merge K Lists

```ts
import { MinHeap } from "heap-js";

function mergeKLists(lists: ListNode[]): ListNode | null {
  const heap = new MinHeap<number>();
  for (const list of lists) {
    let curr = list;
    while (curr) {
      heap.push(curr.val);
      curr = curr.next;
    }
  }
  const dummy = new ListNode(0);
  let tail = dummy;
  while (heap.size() > 0) {
    tail.next = new ListNode(heap.pop());
    tail = tail.next;
  }
  return dummy.next;
}
```

## More efficient: push only the head of each list

```ts
function mergeKListsEfficient(lists: ListNode[]): ListNode | null {
  const heap = new MinHeap<{ val: number; node: ListNode }>(
    (a, b) => a.val - b.val
  );
  for (const head of lists) {
    if (head) heap.push({ val: head.val, node: head });
  }

  const dummy = new ListNode(0);
  let tail = dummy;
  while (heap.size() > 0) {
    const { val, node } = heap.pop();
    tail.next = new ListNode(val);
    tail = tail.next;
    if (node.next) heap.push({ val: node.next.val, node: node.next });
  }
  return dummy.next;
}
```

## Variations

| Variation | Description |
|---|---|
| **Merge K sorted lists** | Heap with heads, push next from popped list |
| **Kth smallest in matrix** | Each row is sorted; binary search or heap |
| **Smallest range** | Find min range covering at least one element from each list |

## Common pitfalls

1. **Pushing entire lists vs just heads** — pushing all is O(N log N), pushing heads is O(N log K). Latter is better.
2. **Heap comparator for ListNodes** — Node objects don't have natural ordering; need custom comparator.
3. **Empty lists in input** — skip them when building heap.

## Practice problems

1. **Hard:** LC 23 — Merge K Sorted Lists
2. **Medium:** LC 378 — Kth Smallest Element in Sorted Matrix
3. **Hard:** LC 632 — Smallest Range Covering Elements from K Lists