# Pattern 6: In-place Reversal of Linked List

## When to use
- Reverse sub-list
- Reverse every K-group
- Reverse in-place (no extra memory)

## Template (TypeScript)

```ts
function reverse(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;

  while (curr) {
    const next = curr.next;  // save
    curr.next = prev;        // reverse pointer
    prev = curr;             // move prev
    curr = next;             // move curr
  }
  return prev; // new head
}
```

## Variations
- **Full reverse**: as above
- **Reverse sublist [m, n]**: walk to m-1, reverse, reattach
- **Reverse K-group**: reverse each group, reattach

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Reverse Linked List | 206 | Easy | ☐ |
| 2 | Reverse Linked List II | 92 | Medium | ☐ |
| 3 | Swap Nodes in Pairs | 24 | Medium | ☐ |
| 4 | Reverse Nodes in K-Group | 25 | Hard | ☐ |

## My key takeaways
_Fill after solving_

**Memorize:** prev, curr, next. Three pointers. Always save next before breaking the link.