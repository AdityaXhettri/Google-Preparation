# Pattern 2: Two Pointers

## When to use
- Sorted array/string, finding pairs/triplets
- In-place array manipulation
- Palindrome checks
- Comparing sequences from both ends

## Template (TypeScript)

```ts
function twoPointers(arr: number[], target: number): number[] {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}
```

## Variations
- **Opposite ends** (left/right moving inward): palindrome, pair sum
- **Same direction** (slow/fast): remove duplicates, move zeros
- **Three pointers**: 3Sum, triangle count

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Two Sum II (sorted) | 167 | Easy | ☐ |
| 2 | Remove Duplicates from Sorted Array | 26 | Easy | ☐ |
| 3 | Valid Palindrome | 125 | Easy | ☐ |
| 4 | 3Sum | 15 | Medium | ☐ |
| 5 | Container With Most Water | 11 | Medium | ☐ |
| 6 | Trapping Rain Water | 42 | Hard | ☐ |

## My key takeaways
_Fill after solving first few_