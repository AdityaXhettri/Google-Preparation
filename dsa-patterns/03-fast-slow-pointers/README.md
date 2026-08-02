# Pattern 3: Fast & Slow Pointers (Floyd's Tortoise & Hare)

## When to use
- Linked list cycle detection
- Finding middle of linked list
- Palindrome linked list
- Cycle length, cycle start

## Template (TypeScript)

```ts
// Detect cycle
function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast?.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true; // they met → cycle
  }
  return false;
}
```

## Variations
- **Cycle detection**: just check if they meet
- **Cycle start**: after meeting, reset one to head, both move 1 step
- **Middle of list**: when fast reaches end, slow is at middle

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Linked List Cycle | 141 | Easy | ☐ |
| 2 | Happy Number | 202 | Easy | ☐ |
| 3 | Middle of Linked List | 876 | Easy | ☐ |
| 4 | Linked List Cycle II | 142 | Medium | ☐ |
| 5 | Palindrome Linked List | 234 | Medium | ☐ |

## My key takeaways
_Fill after solving_