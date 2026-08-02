# 05. Cyclic Sort

## When to use

Numbers are in a **known range** like `[1, n]` or `[0, n]`. Find missing, duplicate, or smallest missing positive.

## When to recognize

- "Numbers from 1 to n"
- "Find missing number"
- "Find all duplicates"
- "First missing positive"

## How it works

Each number `x` belongs at index `x - 1` (for 1-indexed range). Walk through the array. If `arr[i]` isn't at its correct index, swap it into place. After one pass, each position has either the right number or the wrong one (which is the missing/duplicate).

## Template

```ts
function cyclicSort(nums: number[]): number[] {
  let i = 0;
  while (i < nums.length) {
    const correctIdx = nums[i] - 1;
    if (nums[i] !== nums[correctIdx] && nums[i] >= 1 && nums[i] <= nums.length) {
      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
    } else {
      i++;
    }
  }
  return nums;
}
```

## Variations

| Variation | Description |
|---|---|
| **Find missing** | After sort, first i where `arr[i] !== i+1` is the answer |
| **Find duplicates** | During sort, if `arr[i] === arr[correctIdx]`, dup found |
| **Find all disappeared** | Iterate, add indices where `arr[i] !== i+1` |
| **First missing positive** | Cyclic sort ignoring out-of-range, then scan for first wrong |

## Key insight

Cyclic sort is O(n) time, O(1) space — uses the array itself as a hash table. Faster than using a Set for finding missing/duplicate.

## Common pitfalls

1. **Out-of-range values** — guard with `nums[i] >= 1 && nums[i] <= n` to avoid infinite loops on bad input.
2. **Don't increment `i` if you swapped** — only move on when current position is correct.
3. **Edge case: n=1** — return appropriate default.

## Practice problems

1. **Easy:** LC 268 — Missing Number
2. **Easy:** LC 448 — Find All Numbers Disappeared in Array
3. **Easy:** LC 442 — Find All Duplicates
4. **Medium:** LC 287 — Find the Duplicate Number
5. **Hard:** LC 41 — First Missing Positive