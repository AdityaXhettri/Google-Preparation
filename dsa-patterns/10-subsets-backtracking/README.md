# Pattern 10: Subsets / Backtracking

## When to use
- All combinations / permutations
- Generate all valid states
- Constraint satisfaction (N-Queens, Sudoku)
- Word search in grid

## Template (TypeScript)

```ts
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const backtrack = (start: number, path: number[]) => {
    result.push([...path]); // every state is a valid answer
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop(); // backtrack
    }
  };
  backtrack(0, []);
  return result;
}
```

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Subsets | 78 | Medium | ☐ |
| 2 | Subsets II (with duplicates) | 90 | Medium | ☐ |
| 3 | Permutations | 46 | Medium | ☐ |
| 4 | Combination Sum | 39 | Medium | ☐ |
| 5 | Word Search | 79 | Medium | ☐ |

## My key takeaways
_Fill after solving_

**Pattern:** Choose → Explore → Unchoose. Always copy the path before pushing to result.