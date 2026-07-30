# Language Fundamentals — JavaScript / TypeScript

> **My choice:** JavaScript/TypeScript full-stack (React + Vite + Bun for UI, Bun/Hono/Express for backend).
> One language across UI, backend, and DSA problems.

## Why this choice
- Already familiar with React + Vite + Bun (UI/UX strength)
- One language = faster iteration, more projects shipped
- Node.js / Bun backend is real and production-grade
- TypeScript is industry standard — strong resume signal
- DSA in JS is perfectly fine for Google L4

## Mastery Checklist

### JavaScript Core (must be reflex)
- [ ] Variables (let, const, var — and the difference)
- [ ] Arrays: `.map`, `.filter`, `.reduce`, `.find`, `.sort`, spread, destructuring
- [ ] Objects: property access, dynamic keys, destructuring, `Object.entries/keys/values`
- [ ] Strings: methods, template literals, immutability
- [ ] Loops: for, for...of, for...in, while
- [ ] Functions: arrow vs regular, closures, higher-order
- [ ] Promises & async/await — know Promise.all / Promise.race
- [ ] Error handling: try/catch, throwing
- [ ] Modules: import/export, ESM vs CJS
- [ ] `this` keyword — when it matters (and when it doesn't)

### TypeScript (interview-grade)
- [ ] Basic types: string, number, boolean, array, tuple
- [ ] Interfaces & type aliases
- [ ] Generics
- [ ] Union & intersection types
- [ ] Type narrowing (typeof, in, instanceof)
- [ ] Utility types: `Partial`, `Pick`, `Omit`, `Record`
- [ ] `unknown` vs `any` (know the difference)

### DSA-friendly features (must know cold)
- [ ] `Map` (O(1) ops) — preferred over plain objects for non-string keys
- [ ] `Set` (O(1) lookup)
- [ ] Custom sort with comparator: `arr.sort((a, b) => a - b)`
- [ ] No built-in heap, but easy to implement with array
- [ ] No built-in deque, but shift/unshift or use array with two-pointer trick
- [ ] Template literals instead of StringBuilder (fast enough in V8)
- [ ] BigInt for large numbers: `123n`

### DSA Templates I'll memorize
- [ ] Read input: stdin (competitive coding)
- [ ] BFS with queue
- [ ] DFS recursive + iterative
- [ ] Binary search template (lo <= hi)
- [ ] Sliding window template
- [ ] DP memoization + tabulation patterns

### Runtime (Bun vs Node)
- [ ] `bun run` for everything (tests, scripts, server)
- [ ] Bun built-in test runner
- [ ] Bun HTTP server basics

## DSA Resources (JS-friendly)
- NeetCode 150 (solutions in JS available)
- LeetCode (filter by language: JavaScript)
- "ThePrimeagen" DSA course (JS)

## Interview Coding Tips for JS
- Use `const` by default
- Prefer `Map`/`Set` over objects for hash structures
- Be careful with deep copies vs shallow (interviewers notice)
- `===` not `==`
- Watch out for closure pitfalls in loops (var vs let)

## Daily practice template
```ts
// Before solving: pick problem, set 25-min timer
// After solving: write 2-line takeaway in my notes
// Pattern library: maintain by-pattern (sliding-window/, two-pointer/, etc.)
```

## Goal
- [ ] Solve 50+ LeetCode problems in JS/TS → syntax muscle memory
- [ ] Build 1 full-stack project end-to-end (URL shortener)
- [ ] Can whiteboard any standard algo in TS without docs