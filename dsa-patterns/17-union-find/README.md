# Pattern 17: Union Find (Disjoint Set)

## When to use
- Connected components in undirected graph
- Cycle detection in undirected graph
- Kruskal's MST
- Number of islands variants

## Template (TypeScript)

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
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rx = this.find(x), ry = this.find(y);
    if (rx === ry) return false; // already same set
    // union by rank
    if (this.rank[rx] < this.rank[ry]) this.parent[rx] = ry;
    else if (this.rank[rx] > this.rank[ry]) this.parent[ry] = rx;
    else { this.parent[ry] = rx; this.rank[rx]++; }
    return true;
  }
}
```

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Number of Connected Components | 323 | Medium | ☐ |
| 2 | Redundant Connection | 684 | Medium | ☐ |
| 3 | Accounts Merge | 721 | Medium | ☐ |

## My key takeaways
_Fill after solving_

**Two optimizations:** Path compression + union by rank → nearly O(1) per op.