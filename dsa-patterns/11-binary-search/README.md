# Pattern 11: Modified Binary Search

## When to use
- Sorted array (or rotated sorted)
- Find boundary / first/last occurrence
- Search in infinite sorted array
- Bitonic array maximum

## Template (TypeScript)

```ts
function binarySearch(arr: number[], target: number): number {
  let lo = 0;
  let hi = arr.length - 1;

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1); // avoid overflow
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

## Variations
- **Classic**: as above
- **Rotated sorted**: check which half is sorted, then decide
- **First/last occurrence**: don't return immediately, shrink window
- **Find boundary**: search for first true / last false

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Binary Search | 704 | Easy | ☐ |
| 2 | Search in Rotated Sorted Array | 33 | Medium | ☐ |
| 3 | First Bad Version | 278 | Easy | ☐ |
| 4 | Find First and Last Position | 34 | Medium | ☐ |
| 5 | Search in Rotated Sorted Array II | 81 | Medium | ☐ |

## My key takeaways
_Fill after solving_

**Memorize:** `lo + (hi - lo) / 2` not `(lo + hi) / 2` (overflow safety).