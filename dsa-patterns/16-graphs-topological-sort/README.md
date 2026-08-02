# Pattern 16: Graph Topological Sort

## When to use
- Dependencies, ordering
- Course schedule (prerequisites)
- Build systems (compile order)
- Alien dictionary

## Template (TypeScript) — Kahn's algorithm (BFS)

```ts
function findOrder(numCourses: number, prereqs: number[][]): number[] {
  const inDegree = new Array(numCourses).fill(0);
  const graph = new Map<number, number[]>();

  for (const [a, b] of prereqs) {
    if (!graph.has(b)) graph.set(b, []);
    graph.get(b)!.push(a);
    inDegree[a]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order: number[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of graph.get(node) ?? []) {
      if (--inDegree[next] === 0) queue.push(next);
    }
  }

  return order.length === numCourses ? order : []; // empty if cycle
}
```

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Course Schedule | 207 | Medium | ☐ |
| 2 | Course Schedule II | 210 | Medium | ☐ |
| 3 | Alien Dictionary | 269 | Hard | ☐ |
| 4 | Minimum Height Trees | 310 | Hard | ☐ |

## My key takeaways
_Fill after solving_