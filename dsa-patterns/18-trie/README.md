# Pattern 18: Trie (Prefix Tree)

## When to use
- Prefix matching / autocomplete
- Word search / dictionary
- Count words with prefix
- IP routing (longest prefix match)

## Template (TypeScript)

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

## Problem list

| # | Problem | LeetCode # | Difficulty | Status |
|---|---|---|---|---|
| 1 | Implement Trie | 208 | Medium | ☐ |
| 2 | Word Search II | 212 | Hard | ☐ |
| 3 | Design Add and Search Words | 211 | Medium | ☐ |

## My key takeaways
_Fill after solving_

**When NOT to use:** Just storing words → use Set. Trie wins when you need prefix queries.