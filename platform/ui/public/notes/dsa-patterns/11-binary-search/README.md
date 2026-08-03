# 11. Modified Binary Search

## When to use

Search in a **sorted** (or partially sorted) structure for a target, boundary, or condition. O(log n) time.

## When to recognize

- "Sorted array"
- "Find target in O(log n)"
- "Rotated sorted array"
- "Find first/last occurrence"
- "Find minimum in rotated array"
- "Search in infinite sorted array"

## Template — classic

```ts
function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);  // (lo+hi)/2 but overflow-safe
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

## Template — find boundary

For "find first true" problems, don't return immediately — keep shrinking:

```ts
function firstBadVersion(n: number, isBad: (v: number) => boolean): number {
  let lo = 1, hi = n;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (isBad(mid)) hi = mid;       // found bad — but check earlier
    else lo = mid + 1;
  }
  return lo;
}
```

## Rotated sorted array

In a rotated array, **one half is always sorted**. Check which, then decide:

```ts
function searchRotated(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    // Left half is sorted
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
```

## Variations

| Variation | Description |
|---|---|
| **Classic search** | Standard, return index |
| **First/last occurrence** | Don't return immediately, keep shrinking |
| **Find boundary** | Find first/last true |
| **Rotated array** | Check which half is sorted |
| **Bitonic array** | Find peak, then binary search each side |
| **Infinite array** | Find bounds first, then binary search |

## Key insight: mid calculation

Use `lo + ((hi - lo) >> 1)` not `(lo + hi) / 2` — overflow safety in other languages. In JS not critical but good habit.

## Common pitfalls

1. **`mid` off-by-one**: `mid = (lo + hi) >> 1` (inclusive) vs `mid = (lo + hi + 1) >> 1`.
2. **Returning immediately**: for first/last occurrence, must continue shrinking.
3. **Wrong half identification**: in rotated arrays, double-check which half is sorted.

## Practice problems

1. **Easy:** LC 704 — Binary Search
2. **Easy:** LC 278 — First Bad Version
3. **Medium:** LC 33 — Search in Rotated Sorted Array
4. **Medium:** LC 34 — Find First and Last Position
5. **Medium:** LC 153 — Find Minimum in Rotated Sorted Array
6. **Hard:** LC 4 — Median of Two Sorted Arrays