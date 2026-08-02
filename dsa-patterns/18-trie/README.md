# 18. Trie (Prefix Tree)

## When to use

**Prefix-based** operations on a set of strings: insert, search, autocomplete, prefix matching. Each operation is O(L) where L = word length.

## When to recognize

- "Autocomplete"
- "Word search in grid"
- "Longest common prefix"
- "Implement a dictionary"
- "IP routing (longest prefix match)"

## When NOT to use

If you just need to store and look up words, use a **HashSet** — simpler. Trie wins when you need **prefix queries**.

## Template

```ts
class TrieNode {
  children = new Map<string, TrieNode>();
  isWord = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.isWord = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return node.isWord;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return true;
  }
}
```

## Variations

| Variation | Description |
|---|---|
| **Standard trie** | Insert, search, startsWith |
| **Word search II** | Multiple words in grid — build trie, DFS grid |
| **Add and search word** | Words with `.` wildcard |
| **Longest common prefix** | Walk trie, stop at branching |
| **Replace words** | Find shortest prefix in dictionary |

## Common pitfalls

1. **No built-in trie in JS** — implement with class + Map.
2. **Missing `isWord` flag** — every node is a prefix, only some are words.
3. **Trie uses more memory than hash** — but supports prefix queries.

## Practice problems

1. **Medium:** LC 208 — Implement Trie
2. **Medium:** LC 211 — Design Add and Search Words
3. **Hard:** LC 212 — Word Search II