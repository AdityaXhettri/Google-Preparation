# Pattern 7: Tree BFS (Breadth-First Search)

## When to use
- Level-order traversal
- Find min depth / max depth
- Connect nodes at same level
- Zigzag / vertical order
- Any "process by level" problem

## Template (TypeScript)

```ts
function bfs(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length) {
    const levelSize = queue.length;
    const level: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Binary Tree Level Order Traversal | 102 | Medium | ☐ |
| 2 | Min Depth of Binary Tree | 111 | Easy | ☐ |
| 3 | Maximum Depth | 104 | Easy | ☐ |
| 4 | Binary Tree Zigzag Level Order | 103 | Medium | ☐ |
| 5 | Populating Next Right Pointers | 116 | Medium | ☐ |

## My key takeaways
_Fill after solving_

**Tip:** Use `levelSize = queue.length` snapshot to know when a level ends.