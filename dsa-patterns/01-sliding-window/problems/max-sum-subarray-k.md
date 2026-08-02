# Maximum Sum Subarray of Size K (LC 643)

> **Difficulty:** Easy
> **Pattern:** Sliding Window (fixed)
> **Solved:** _date_ | **Time taken:** _min_

## Problem

Given array of positive integers and a number K, find the maximum sum of any contiguous subarray of size K.

```
Input:  [2, 1, 5, 1, 3, 2], k = 3
Output: 9   (subarray [5, 1, 3])
```

## Brute force (O(n*k))

```ts
function maxSum(arr: number[], k: number): number {
  let max = 0;
  for (let i = 0; i <= arr.length - k; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) sum += arr[j];
    max = Math.max(max, sum);
  }
  return max;
}
```

## Optimal (O(n)) — sliding window

```ts
function maxSum(arr: number[], k: number): number {
  let windowSum = 0;
  // First window
  for (let i = 0; i < k; i++) windowSum += arr[i];
  let max = windowSum;

  // Slide: remove leftmost, add next
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    max = Math.max(max, windowSum);
  }
  return max;
}
```

## Edge cases I tested
- [ ] k === arr.length → return sum of all
- [ ] k === 1 → return max element
- [ ] Empty array → 0 (or throw)
- [ ] Negative numbers → still works (doesn't require positives in optimal)

## Takeaway
> **Fixed-size sliding window** = compute first window, then slide by removing leftmost and adding rightmost. Don't recompute the whole window.

**Time:** O(n) | **Space:** O(1)

**Related problems to try next:**
- LC 239 — Sliding Window Maximum (uses deque)
- LC 1052 — Grumpy Bookstore Owner
