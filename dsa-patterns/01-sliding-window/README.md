# Pattern 1: Sliding Window

## When to use
- Contiguous subarray/substring problems
- "Find longest/shortest subarray/substring with condition X"
- Often involves: sum, count, distinct chars, max/min

## Template (TypeScript)

```ts
function slidingWindow(arr: number[], k: number): number {
  let left = 0;
  let result = 0;
  let windowState = 0; // sum, count, map, etc.

  for (let right = 0; right < arr.length; right++) {
    // 1. Add arr[right] to window
    windowState += arr[right];

    // 2. Shrink window while condition violated
    while (windowConditionViolated(windowState, k)) {
      windowState -= arr[left];
      left++;
    }

    // 3. Update result
    result = Math.max(result, right - left + 1);
  }

  return result;
}
```

## Variations
- **Fixed window** (size k): shrink when `right - left + 1 > k`
- **Variable window** (dynamic): shrink while condition violated
- **With hashmap**: e.g., longest substring with K distinct chars

## Problem list (fill as I solve)

| # | Problem | LeetCode # | Difficulty | Status | My file |
|---|---|---|---|---|---|
| 1 | Maximum Sum Subarray of Size K | 643 | Easy | ☐ | [problems/](./problems/) |
| 2 | Longest Substring Without Repeating | 3 | Medium | ☐ | |
| 3 | Longest Repeating Character Replacement | 424 | Medium | ☐ | |
| 4 | Permutation in String | 567 | Medium | ☐ | |
| 5 | Minimum Window Substring | 76 | Hard | ☐ | |
| 6 | Sliding Window Maximum | 239 | Hard | ☐ | |
| 7 | Substring with Concatenation of All Words | 30 | Hard | ☐ | |

## My key takeaways
_Fill after solving first few_