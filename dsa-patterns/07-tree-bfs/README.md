# 07. Tree BFS (Breadth-First Search)

## When to use

Traverse or process a tree **level by level** (top to bottom, left to right). Uses a queue.

## When to recognize

- "Level order traversal"
- "Min/max depth"
- "Zigzag/spiral order"
- "Connect nodes at same level"
- "Right side view of binary tree"
- "Average of levels"

## How it works

Queue holds nodes to process. For each level, process all nodes currently in queue (snapshot length), enqueue their children. Repeat until queue empty.

## Template

```ts
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;  // snapshot at level start
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

## Key insight

**`levelSize = queue.length` at start of each iteration** is what makes it level-by-level. Without it, all nodes end up in one big array.

## Variations

| Variation | Description |
|---|---|
| **Standard level order** | Left to right each level |
| **Zigzag** | Alternate L-R and R-L between levels |
| **Connect siblings** | Use next pointers within level |
| **Vertical order** | Group by column instead of level |
| **Min depth** | BFS — first leaf reached is min depth |
| **Max depth** | Could be BFS or DFS |

## Common pitfalls

1. **Forgetting levelSize snapshot** — all nodes end up in one level.
2. **Using `.shift()` in JS** — O(n) per shift. For huge inputs, use an index pointer or a deque.
3. **Empty tree** — always check `if (!root) return []`.

## Practice problems

1. **Easy:** LC 104 — Maximum Depth of Binary Tree
2. **Easy:** LC 111 — Minimum Depth of Binary Tree
3. **Medium:** LC 102 — Binary Tree Level Order Traversal
4. **Medium:** LC 107 — Binary Tree Level Order Traversal II
5. **Medium:** LC 103 — Binary Tree Zigzag Level Order
6. **Medium:** LC 199 — Binary Tree Right Side View
7. **Medium:** LC 116 — Populating Next Right Pointers