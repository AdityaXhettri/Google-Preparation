# Pattern 5: Cyclic Sort

## When to use
- Numbers in range [1, n] or [0, n-1]
- Find missing/duplicate/first missing positive
- O(1) space, O(n) time on array of integers

## Template (TypeScript)

```ts
function cyclicSort(nums: number[]): number[] {
  let i = 0;
  while (i < nums.length) {
    const correctIdx = nums[i] - 1; // for [1, n] range
    if (nums[i] !== nums[correctIdx]) {
      // Swap
      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
    } else {
      i++;
    }
  }
  return nums;
}
```

## Key insight
Each number belongs at index `num - 1`. Swap until each number is in its correct spot. Any deviation = missing or duplicate.

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Missing Number | 268 | Easy | ☐ |
| 2 | Find All Numbers Disappeared | 448 | Easy | ☐ |
| 3 | Find the Duplicate Number | 287 | Medium | ☐ |
| 4 | First Missing Positive | 41 | Hard | ☐ |

## My key takeaways
_Fill after solving_