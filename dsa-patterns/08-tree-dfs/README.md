# Pattern 8: Tree DFS (Depth-First Search)

## When to use
- Path sum problems
- All paths from root to leaf
- Subtree problems
- Validate BST
- Serialize/deserialize

## Template (TypeScript)

```ts
// Recursive DFS
function dfs(root: TreeNode | null, path: number[] = []): number {
  if (!root) return 0;

  path.push(root.val);

  if (!root.left && !root.right) {
    // Leaf — process path
    return path.reduce((a, b) => a + b, 0);
  }

  const left = dfs(root.left, path);
  path.pop(); // backtrack
  const right = dfs(root.right, path);
  path.pop();

  return left + right;
}
```

## Variations
- **Preorder** (root, left, right): copy tree, serialize
- **Inorder** (left, root, right): BST sorted order
- **Postorder** (left, right, root): delete tree, compute aggregates

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Path Sum | 112 | Easy | ☐ |
| 2 | Sum Root to Leaf | 129 | Medium | ☐ |
| 3 | Validate BST | 98 | Medium | ☐ |
| 4 | Construct Tree from Preorder + Inorder | 105 | Medium | ☐ |
| 5 | Serialize and Deserialize | 297 | Hard | ☐ |

## My key takeaways
_Fill after solving_