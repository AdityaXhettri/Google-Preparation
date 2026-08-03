# 03. Fast & Slow Pointers (Floyd's Tortoise & Hare)

## When to use

Two pointers moving through a **sequence** (usually linked list) at different speeds. Used for cycle detection and finding middle elements.

## How it works

- **Slow pointer** moves 1 step at a time
- **Fast pointer** moves 2 steps at a time
- If they ever meet → cycle exists (in linked list)
- If fast reaches end → no cycle

## Template — cycle detection

```ts
function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast?.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

## Template — cycle start

After meeting, reset one pointer to head. Move both 1 step. They meet at cycle start.

```ts
function detectCycleStart(head: ListNode | null): ListNode | null {
  let slow = head, fast = head;
  while (fast?.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) break;
  }
  if (!fast?.next) return null; // no cycle
  slow = head;
  while (slow !== fast) {
    slow = slow!.next;
    fast = fast!.next;
  }
  return slow;
}
```

## Why it works

In a cycle of length L: after slow has traveled d steps inside the cycle, fast has traveled 2d steps. So fast is `2d - d = d` ahead. They meet when `d % L === 0`.

## Other use cases

- **Find middle of linked list**: when fast reaches end, slow is at middle.
- **Happy Number**: sum of squares of digits. Sequence either reaches 1 (happy) or cycles. Use fast/slow to detect cycle.
- **Palindrome Linked List**: find middle (fast/slow), reverse second half, compare.

## Practice problems

1. **Easy:** LC 141 — Linked List Cycle
2. **Easy:** LC 876 — Middle of Linked List
3. **Easy:** LC 202 — Happy Number
4. **Medium:** LC 142 — Linked List Cycle II
5. **Medium:** LC 234 — Palindrome Linked List