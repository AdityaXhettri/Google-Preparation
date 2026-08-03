# 17. Union Find (Disjoint Set Union)

## When to use

Track and merge **disjoint sets** of elements. Two operations: **union** (merge two sets) and **find** (which set is this element in?). Detect cycles in undirected graphs.

## When to recognize

- "Connected components"
- "Number of islands" (alt solution)
- "Redundant edge / connection"
- "Accounts merge"
- "Kruskal's MST"

## The key optimizations

- **Path compression**: in `find`, point every node directly to the root.
- **Union by rank**: in `union`, attach smaller tree under root of larger.

Both together make operations effectively O(1) (amortized α(n)).

## Template

```ts
class UnionFind {
  parent: number[];
  rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);  // path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return false;  // already in same set (cycle!)

    if (this.rank[rx] < this.rank[ry]) {
      this.parent[rx] = ry;
    } else if (this.rank[rx] > this.rank[ry]) {
      this.parent[ry] = rx;
    } else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
    return true;
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}
```

## Variations

| Variation | Description |
|---|---|
| **Cycle detection in undirected graph** | For each edge, if endpoints already connected → cycle |
| **Count connected components** | Count roots after all unions |
| **Largest component** | Track size during union |
| **Kruskal's MST** | Sort edges, union if not already connected |

## Common pitfalls

1. **Forgetting path compression** — without it, tree can be deep, find becomes O(n).
2. **Union without rank** — leads to unbalanced trees.
3. **Off-by-one** — index mapping (e.g., for "ACCOUNT MERGE", emails → user id).

## Practice problems

1. **Medium:** LC 323 — Number of Connected Components
2. **Medium:** LC 684 — Redundant Connection
3. **Medium:** LC 721 — Accounts Merge
4. **Medium:** LC 1319 — Number of Operations to Make Network Connected