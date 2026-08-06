# 02. Two Pointers

## When to use

Two pointers is for problems on **arrays, strings, or linked lists** where two pointers traverse the data in a coordinated way. Most commonly: sorted arrays, in-place operations, palindromes, finding pairs/triplets.

Recognize it when you see:
- "Sorted array + find pair/triplet that sums to X"
- "In-place removal of duplicates/zeros"
- "Palindrome check"
- "Container/trapping water (greedy two-pointer)"

## How it works

Two pointers move through the data. They can move:
- **Opposite directions** (one from start, one from end) — for sorted pairs
- **Same direction at different speeds** (slow/fast) — for in-place or cycle
- **Same direction at same speed** — for partition (Dutch National Flag)

## Template — opposite direction

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

## Template — same direction (slow/fast)

```ts
function removeDuplicates(arr: number[]): number {
  let slow = 0;
  for (let fast = 1; fast < arr.length; fast++) {
    if (arr[fast] !== arr[slow]) {
      slow++;
      arr[slow] = arr[fast];
    }
  }
  return slow + 1; // length of unique prefix
}
```

## Variations

| Variation | Use case | Example |
|---|---|---|
| Opposite ends | Sorted array, find pair | Two Sum II |
| Slow/fast same dir | In-place, O(1) space | Remove duplicates |
| Three pointers | Find triplets | 3Sum, 3Sum closest |
| Greedy | Container problems | Container with most water |

## Key insight

For sorted arrays: the comparison tells you which pointer to move. Sum too small → move left up. Sum too big → move right down. This is what makes it O(n) instead of O(n²).



## Practice problems (in order)

1. **Easy:** LC 167 — Two Sum II (sorted)
2. **Easy:** LC 26 — Remove Duplicates from Sorted Array
3. **Easy:** LC 125 — Valid Palindrome
4. **Easy:** LC 283 — Move Zeroes
5. **Medium:** LC 15 — 3Sum
6. **Medium:** LC 11 — Container With Most Water
7. **Medium:** LC 16 — 3Sum Closest
8. **Hard:** LC 42 — Trapping Rain Water
