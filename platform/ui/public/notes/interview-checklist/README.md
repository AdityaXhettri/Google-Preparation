# Interview Day Checklist

> Review this 1-2 days before each interview round. Don't cram new content day-of.

## DSA Round (45-60 min)

### Day before
- [ ] Can solve medium in 25 min cold
- [ ] Can solve hard in 40 min cold
- [ ] Pattern-recognition ready (problem → template in 30 sec)
- [ ] Reviewed [all 18 patterns](../dsa-patterns/README.md)
- [ ] Re-solved recent mistakes from cheat sheets

### Day of
- [ ] Easy warm-up problem (just to wake up)
- [ ] Light breakfast
- [ ] Water bottle ready
- [ ] Bathroom break 5 min before

### During the interview
- [ ] Restate problem in my own words (1 min)
- [ ] Ask clarifying questions: edge cases? input size? sorted?
- [ ] Mention the pattern out loud ("This looks like sliding window")
- [ ] Discuss brute force first, then optimize
- [ ] Time/speak while coding
- [ ] Test with edge cases (empty, 1 elem, duplicates, all same)
- [ ] Discuss time/space at the end

## Coding Fundamentals (memorize)

### HashMap/Set
- O(1) avg insert/lookup/delete
- Use for: counting, deduplication, fast lookup

### Sort with custom comparator
```ts
arr.sort((a, b) => a.priority - b.priority);  // ascending
arr.sort((a, b) => b.age - a.age);            // descending
```

### BFS template
```ts
const queue = [start];
const visited = new Set([start]);
while (queue.length) {
  const node = queue.shift();
  for (const next of adj[node]) {
    if (!visited.has(next)) {
      visited.add(next);
      queue.push(next);
    }
  }
}
```

### DFS template
```ts
function dfs(node, visited, path) {
  visited.add(node);
  path.push(node);
  if (isGoal(node)) result.push([...path]);
  for (const next of adj[node] ?? []) {
    if (!visited.has(next)) dfs(next, visited, path);
  }
  path.pop();  // backtrack
}
```

### Big O cheat sheet
- O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n) < O(n!)

### Always ask edge cases
- Empty input
- 1 element
- All duplicates
- Negative numbers
- Overflow (in other languages)

## System Design Round (45 min)

### Day before
- [ ] Read [system design overview](../system-design/README.md)
- [ ] Reviewed 3 most recent problem write-ups
- [ ] Can articulate: SQL vs NoSQL, caching strategies, message queues, CAP
- [ ] Know scale estimation (QPS = DAU × actions / 86400)

### Day of
- [ ] Pen and paper for diagrams
- [ ] Glass of water

### Format (memorize)
1. **Clarify (5 min)** — 3-5 questions
2. **Estimate (2 min)** — QPS, storage, bandwidth
3. **High-level (10 min)** — boxes and arrows
4. **Deep dive (15 min)** — 2-3 components
5. **Bottlenecks (8 min)** — what breaks, how to fix
6. **Wrap up (5 min)** — summary, future work

### Opening questions to ask
- Who are the users? DAU?
- Read-heavy or write-heavy?
- Real-time or batch?
- Single region or global?
- MVP scope?

## Googleyness Round (45 min)

### Day before
- [ ] All 6 stories rehearsed <2 min each (record yourself)
- [ ] Each story has 3+ metrics/numbers
- [ ] Can answer 3-4 follow-ups per story
- [ ] Reviewed [googleyness-stories](../googleyness-stories/)
- [ ] Rehearsed at least 5 times each

### Day of
- [ ] All 6 stories fresh in mind
- [ ] STAR framework remembered (Situation, Task, Action, Result)

### Story structure (STAR)
- **S**ituation — context, who, what, when (15 sec)
- **T**ask — your specific responsibility (10 sec)
- **A**ction — what YOU did, 3-5 bullets (60 sec)
- **R**esult — outcome with metrics + what you learned (30 sec)

### What to highlight
- "I" not "we" — show what YOU specifically did
- Quantify: %, $, time, people, scale
- Growth signal: what did you learn?
- Decisions: why did you choose X?

### What NOT to do
- Don't use stories you weren't the primary owner of
- Don't fabricate metrics
- Don't use stories >3 years old
- Don't deflect failures

## Logistics (any round)

- [ ] Quiet room, good lighting
- [ ] Stable internet (virtual)
- [ ] Headphones + mic tested
- [ ] Phone silenced
- [ ] Water bottle
- [ ] Pen + paper
- [ ] Resume printed (or second screen)
- [ ] 10 min buffer before interview
- [ ] Bathroom break before

## Morning routine

1. Wake up 2 hours before interview
2. Light breakfast (no heavy food, no alcohol)
3. 5-min pattern cheatsheet review
4. 1 easy warm-up problem
5. Read your 6 STAR stories once (out loud)
6. Deep breath — you prepared

## If you go blank during coding

1. **Stop and restate the problem** — sometimes just hearing it again triggers recall
2. **Think about input/output shape** — what does the function take, what does it return?
3. **Brute force first** — even O(n²) is better than nothing
4. **Talk out loud** — "I think this is sliding window because..."
5. **Ask for a hint** — interviewers want you to succeed
6. **Use a simpler example** — walk through input by hand

## If you go blank during system design

1. **Start with clarifying questions** — even obvious ones
2. **Pick a similar known system** — "Twitter-like feed" gives structure
3. **High-level first** — boxes for client, server, DB, cache, queue
4. **Drill into the hardest part** — usually the one with most ambiguity

## If you go blank during behavioral

1. **Use any story that loosely fits** — better than silence
2. **STAR framework** — fill each section
3. **Be honest** — "Let me think of a good example..." is OK
4. **Pivot** — "Actually, a better example is..."

## Emergency phrases

- "Let me think out loud for a moment"
- "I'm going to start with a brute force, then optimize"
- "What if I tried X?"
- "Could you clarify the constraint on Y?"
- "Let me trace through an example"
- "I think I missed an edge case — let me check"
- "That's the best I have — what would you look for?"

## After the interview

- [ ] Write down what you struggled with (within 30 min, while fresh)
- [ ] Note any problems you didn't solve
- [ ] Plan to re-solve them next week
- [ ] If you bombed, ask for feedback (sometimes they share)