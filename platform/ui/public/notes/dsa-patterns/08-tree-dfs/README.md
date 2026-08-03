# 08. Tree DFS (Depth-First Search)

## When to use

Recursive **top-down** or **bottom-up** traversal of a tree. Used for path problems, subtrees, validation, transformations.

## When to recognize

- "Path from root to leaf"
- "Validate BST / Balanced tree"
- "Sum of all paths"
- "Lowest common ancestor"
- "Serialize / deserialize tree"
- "All paths from root to leaves that sum to X"

## The three orders

| Order | Traversal | Use case |
|---|---|---|
| **Preorder** (root, left, right) | Copy tree, serialize | Top-down problems |
| **Inorder** (left, root, right) | BST sorted order | Validation |
| **Postorder** (left, right, root) | Delete tree, compute aggregates | Bottom-up problems |

## Template — preorder (top-down)

```ts
function preorder(root: TreeNode | null, path: number[] = []): void {
  if (!root) return;
  path.push(root.val);              // process root
  if (!root.left && !root.right) {  // leaf
    console.log(path);
  }
  preorder(root.left, path);
  preorder(root.right, path);
  path.pop();                       // backtrack
}
```

## Template — postorder (bottom-up)

```ts
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  const left = maxDepth(root.left);
  const right = maxDepth(root.right);
  return 1 + Math.max(left, right);
}
```

## Key insight: backtracking

For path problems (sum of all paths from root to leaf), push before recursing, **pop after** (or use immutable copy). Forgetting this is the #1 bug.

## Variations

| Variation | Description |
|---|---|
| **Path sum** | Pass current sum down, check at leaves |
| **Validate BST** | Pass min/max range down the recursion |
| **Lowest common ancestor** | Return node if found, propagate up |
| **Construct from preorder+inorder** | Recurse with index pointers |
| **Serialize/deserialize** | Preorder + sentinel for nulls |

## BST validation (the classic gotcha)

Don't just check `left < root < right`. **Check against ancestor constraints**:

```ts
function isValidBST(root: TreeNode | null, min = -Infinity, max = Infinity): boolean {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}
```

## Common pitfalls

1. **Forgetting backtrack** in path problems → wrong counts.
2. **Wrong range on BST** validation → accepts invalid trees.
3. **Stack overflow** on very deep trees — convert to iterative if needed.

## Practice problems

1. **Easy:** LC 104 — Maximum Depth of Binary Tree
2. **Easy:** LC 112 — Path Sum
3. **Medium:** LC 236 — LCA of a Binary Tree
4. **Medium:** LC 98 — Validate Binary Search Tree
5. **Medium:** LC 124 — Binary Tree Maximum Path Sum
6. **Medium:** LC 105 — Construct from Preorder+Inorder
7. **Hard:** LC 297 — Serialize and Deserialize Binary Tree