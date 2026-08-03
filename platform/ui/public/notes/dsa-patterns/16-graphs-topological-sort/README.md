# 16. Graphs — Topological Sort

## When to use

Find a valid **ordering** of nodes in a directed graph where every edge `u → v` has `u` before `v`. Used for dependencies, build order, course schedule.

## When to recognize

- "Course schedule / prerequisites"
- "Build order / compile order"
- "Alien dictionary"
- "Project dependencies"

## When it's impossible

If there's a **cycle** in the dependencies, no valid ordering exists. Top sort detects this.

## Two approaches

### Kahn's algorithm (BFS)

```ts
function canFinish(numCourses: number, prereqs: number[][]): boolean {
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

  let processed = 0;
  while (queue.length > 0) {
    const node = queue.shift()!;
    processed++;
    for (const next of graph.get(node) ?? []) {
      if (--inDegree[next] === 0) queue.push(next);
    }
  }

  return processed === numCourses;  // false if cycle
}
```

### DFS-based (reverse postorder)

```ts
function topologicalSort(n: number, edges: number[][]): number[] {
  const graph = new Map<number, number[]>();
  for (const [u, v] of edges) {
    if (!graph.has(u)) graph.set(u, []);
    graph.get(u)!.push(v);
  }

  const visited = new Set<number>();
  const onStack = new Set<number>();  // cycle detection
  const order: number[] = [];

  function dfs(node: number) {
    if (onStack.has(node)) throw new Error("cycle");
    if (visited.has(node)) return;
    visited.add(node);
    onStack.add(node);
    for (const next of graph.get(node) ?? []) dfs(next);
    onStack.delete(node);
    order.push(node);  // postorder = topological order reversed
  }

  for (let i = 0; i < n; i++) dfs(i);
  return order.reverse();
}
```

## Variations

| Variation | Description |
|---|---|
| **Course schedule (yes/no)** | Kahn's algorithm, check if all processed |
| **Course schedule (return order)** | Kahn's, return order |
| **Alien dictionary** | Build graph from word pairs, top sort |
| **Min height trees** | Roots that minimize tree height |
| **All topological sorts** | Recursive, try each in-degree-0 node |

## Common pitfalls

1. **Wrong direction of edge**: if "to take B you need A first", edge is `B → A` (B depends on A) or `A → B` (A is prereq of B). Pick convention carefully.
2. **Cycle detection**: Kahn's fails when not all nodes processed. DFS uses onStack set.
3. **Self-loop**: counts as cycle.

## Practice problems

1. **Medium:** LC 207 — Course Schedule
2. **Medium:** LC 210 — Course Schedule II
3. **Hard:** LC 269 — Alien Dictionary
4. **Hard:** LC 310 — Minimum Height Trees