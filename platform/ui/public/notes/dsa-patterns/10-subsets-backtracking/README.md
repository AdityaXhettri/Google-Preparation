# 10. Subsets / Backtracking

## When to use

Generate **all combinations** or **all permutations** that satisfy constraints. General "explore all possibilities" pattern.

## When to recognize

- "All subsets"
- "All permutations"
- "All valid combinations"
- "N-Queens"
- "Word search"
- "Generate parentheses"

## The pattern: choose → explore → unchoose

```ts
function backtrack(state, choices) {
  if (isGoal(state)) {
    result.push([...state]);  // COPY before adding!
    return;
  }
  for (choice of choices) {
    if (isValid(choice, state)) {
      state.push(choice);          // choose
      backtrack(state, nextChoices);  // explore
      state.pop();                 // UNCHOOSE (backtrack!)
    }
  }
}
```

## Template — subsets

```ts
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const backtrack = (start: number, path: number[]) => {
    result.push([...path]); // every state is a valid subset
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  };
  backtrack(0, []);
  return result;
}
```

## Template — permutations

```ts
function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const backtrack = (path: number[], used: boolean[]) => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack(path, used);
      path.pop();
      used[i] = false;
    }
  };
  backtrack([], new Array(nums.length).fill(false));
  return result;
}
```

## Variations

| Variation | Description |
|---|---|
| **Subsets** | Every subset of input |
| **Permutations** | Every ordering |
| **Combination Sum** | Sum to target, reuse numbers |
| **Generate parens** | Valid n-paren strings |
| **Word search** | Find word in grid (DFS + backtrack) |
| **N-Queens** | Place N queens, no attacks |

## Key insight: COPY before adding

Always `result.push([...state])`, never `result.push(state)`. Otherwise the array mutates later when you backtrack.

## Common pitfalls

1. **Forgetting to unchoose** → state stays corrupted.
2. **Pushing state directly** → all results point to same array (becomes final state).
3. **Missing `start` parameter** in subsets → generates duplicates.

## Practice problems

1. **Medium:** LC 78 — Subsets
2. **Medium:** LC 46 — Permutations
3. **Medium:** LC 47 — Permutations II (with duplicates)
4. **Medium:** LC 39 — Combination Sum
5. **Medium:** LC 22 — Generate Parentheses
6. **Medium:** LC 79 — Word Search
7. **Hard:** LC 51 — N-Queens