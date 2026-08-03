# 06. In-place Linked List Reversal

## When to use

Reversing a linked list (or part of it) in place. O(1) extra space.

## When to recognize

- "Reverse a linked list"
- "Reverse sublist from m to n"
- "Swap nodes in pairs"
- "Reverse in k-group"

## The core technique: prev/curr/next

```ts
function reverse(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;

  while (curr) {
    const next = curr.next;  // save before breaking
    curr.next = prev;        // reverse pointer
    prev = curr;             // move prev
    curr = next;             // move curr
  }
  return prev;
}
```

## Why this works

- **next = curr.next**: save the rest of the list before we break the link.
- **curr.next = prev**: reverse the pointer.
- **prev = curr**: prev advances to current.
- **curr = next**: curr advances to saved next.

When the loop ends, `prev` is the new head (the last non-null node we processed).

## Variations

| Variation | Approach |
|---|---|
| **Reverse entire list** | Standard prev/curr/next |
| **Reverse sublist [m, n]** | Walk to m-1, reverse m..n, reattach |
| **Reverse k-group** | Reverse each group, link to next group's head |
| **Swap pairs** | Special case of k-group with k=2 |

## Reverse sublist template

```ts
function reverseBetween(head: ListNode | null, m: number, n: number): ListNode | null {
  if (!head || m === n) return head;

  const dummy = new ListNode(0);
  dummy.next = head;
  let pre: ListNode = dummy;

  // Walk to m-1
  for (let i = 1; i < m; i++) pre = pre.next!;

  // Reverse m..n
  let curr = pre.next!;
  for (let i = 0; i < n - m; i++) {
    const next = curr.next!;
    curr.next = next.next;
    next.next = pre.next;
    pre.next = next;
  }
  return dummy.next;
}
```

## Common pitfalls

1. **Forgetting to save `next`** — once you set `curr.next = prev`, you can't recover the rest.
2. **Wrong return value** — return `prev`, not the original head (which is now the tail).
3. **Off-by-one on sublist boundaries** — count carefully; usually 1-indexed.

## Practice problems

1. **Easy:** LC 206 — Reverse Linked List
2. **Easy:** LC 24 — Swap Nodes in Pairs
3. **Medium:** LC 92 — Reverse Linked List II
4. **Medium:** LC 328 — Odd Even Linked List
5. **Hard:** LC 25 — Reverse Nodes in K-Group