# 01. Sliding Window

## When to use

Sliding window is for problems on **contiguous subarrays or substrings** where you need to track some condition (sum, max, distinct chars, etc.) within a window. The window expands on the right and shrinks on the left.

Recognize it when you see:
- "Find longest/shortest subarray/substring with property X"
- "Maximum sum of K consecutive elements"
- "Contains at most K distinct characters"

## How it works

Two pointers (`left` and `right`) define the current window `[left, right]`. Move `right` to expand, and `left` to shrink when the window violates a condition. The answer is tracked as you go.

## Template

```ts
function slidingWindow(arr: number[]): number {
  let left = 0;
  let windowState = 0;       // sum, count, map, etc.
  let result = 0;

  for (let right = 0; right < arr.length; right++) {
    // 1. Add arr[right] to the window
    windowState += arr[right];

    // 2. Shrink while window is invalid
    while (windowState > TARGET) {
      windowState -= arr[left];
      left++;
    }

    // 3. Update result with current window
    result = Math.max(result, right - left + 1);
  }

  return result;
}
```

## Fixed vs Variable Window

**Fixed window** (size K):
- Window size is constant. Shrink when `right - left + 1 > K`.
- Example: max sum subarray of size K.

**Variable window**:
- Window grows and shrinks based on condition.
- Example: longest substring with at most K distinct chars.

## Common patterns

| Sub-pattern | Example problem |
|---|---|
| Fixed K | LC 643 — Max sum subarray of size K |
| Longest substring with constraint | LC 3 — Longest substring without repeating |
| Counting | LC 438 — Anagram in string |
| With hashmap | LC 76 — Minimum window substring |

## Key insight

The total time is O(n) because each element is added to the window once (when `right` reaches it) and removed once (when `left` passes it). Two pointers, linear time.

## Common pitfalls

1. **Off-by-one on `right - left + 1`**: when `left` and `right` are both inclusive, length is `right - left + 1`.
2. **Forgetting to shrink**: always check if window is invalid after adding `arr[right]`.
3. **Wrong order**: add first, shrink second, then update answer. Reversing these breaks the invariant.



## Practice problems (in order of difficulty)

1. **Easy:** LC 643 — Maximum Average Subarray
2. **Easy:** LC 219 — Contains Duplicate II
3. **Medium:** LC 3 — Longest Substring Without Repeating Characters
4. **Medium:** LC 567 — Permutation in String
5. **Medium:** LC 438 — Find All Anagrams in a String
6. **Hard:** LC 76 — Minimum Window Substring
7. **Hard:** LC 239 — Sliding Window Maximum
