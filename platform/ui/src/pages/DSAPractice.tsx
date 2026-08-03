import { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PATTERNS, randomProblem, getProblem, type Problem } from "../lib/problems";
import { storage } from "../lib/storage";
import { runCodeInWorker, type RunResult } from "../lib/codeRunner";

const Editor = lazy(() => import("@monaco-editor/react").then((m) => ({ default: m.default })));

const TIME_LIMITS: Record<Problem["difficulty"], number> = { easy: 15, medium: 25, hard: 40 };

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const LEVEL_LABELS = ["Subtle hint", "Bigger hint", "Pseudocode"];
const LEVEL_EMOJI = ["💭", "💡", "📝"];

export function DSAPractice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<{ pass: boolean; got: unknown; want: unknown; input: unknown[]; error?: string; consoleOutput?: string[]; durationMs?: number }[]>([]);
  const [done, setDone] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    const patternParam = searchParams.get("pattern") ?? undefined;
    const problemParam = searchParams.get("problem");
    const p = problemParam ? getProblem(problemParam) ?? randomProblem(patternParam) : randomProblem(patternParam);
    setProblem(p);
    setCode(p.starterCode);
    setHintLevel(0);
    setHintsUsed(0);
  }, [searchParams]);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, secondsLeft]);

  useEffect(() => {
    if (running && secondsLeft === 0) {
      setRunning(false);
      setDone(true);
    }
  }, [secondsLeft, running]);

  if (!problem) return <div className="p-8 text-zinc-500">Loading problem…</div>;

  const pickNew = (pattern?: string, difficulty?: Problem["difficulty"]) => {
    const p = randomProblem(pattern, difficulty);
    setProblem(p);
    setCode(p.starterCode);
    setResults([]);
    setDone(false);
    setSecondsLeft(0);
    setRunning(false);
    setHintLevel(0);
    setHintsUsed(0);
    const params = new URLSearchParams();
    if (p.pattern) params.set("pattern", p.pattern);
    params.set("problem", p.id);
    setSearchParams(params);
  };

  const start = () => {
    setSecondsLeft(TIME_LIMITS[problem.difficulty] * 60);
    setStartedAt(Date.now());
    setRunning(true);
    setDone(false);
    setResults([]);
  };

  const runTests = async () => {
    if (running) return;
    setRunning(true);
    setResults([]);
    setGlobalError(null);
    setConsoleLogs([]);

    const fnName = problem.signature.match(/function (\w+)/)?.[1] ?? "fn";
    const result: RunResult = await runCodeInWorker(code, fnName, problem.tests);

    if (result.globalError) {
      setGlobalError(result.globalError);
      setConsoleLogs((result.results[0]?.consoleOutput as string[]) || []);
    } else {
      setResults(result.results);
      // Collect console output from all tests
      const allLogs: string[] = [];
      for (const r of result.results) {
        if (r.consoleOutput && r.consoleOutput.length > 0) {
          allLogs.push(`--- Test input ${JSON.stringify(r.input)} ---`);
          allLogs.push(...(r.consoleOutput as string[]));
        }
      }
      if (allLogs.length > 0) setShowConsole(true);
      setConsoleLogs(allLogs);
    }
    setRunning(false);
  };

  const submit = (solved: boolean) => {
    setRunning(false);
    setDone(true);
    storage.addAttempt({
      id: crypto.randomUUID(),
      problemId: problem.id,
      pattern: problem.pattern,
      difficulty: problem.difficulty,
      startedAt,
      finishedAt: Date.now(),
      solved,
      retries: 0,
      hintsUsed,
    });
    if (solved) storage.scheduleSR(problem.id);
    storage.recordActivity();
  };

  const revealNextHint = () => {
    if (hintLevel < 2) {
      setHintLevel((l) => (l + 1) as 0 | 1 | 2);
      setHintsUsed((n) => n + 1);
      storage.bumpHint(problem.id);
    }
  };

  const allPassed = results.length > 0 && results.every((r) => r.pass);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex justify-between items-center">
        <div>
          <div className="text-xs text-zinc-500 uppercase">{problem.pattern}</div>
          <h1 className="text-xl font-bold">{problem.title}</h1>
          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
            problem.difficulty === "easy" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" :
            problem.difficulty === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200" :
            "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
          }`}>{problem.difficulty.toUpperCase()}</span>
          {problem.leetcode && <span className="ml-2 text-xs text-zinc-500">LC #{problem.leetcode}</span>}
          {problem.optimalTime && <span className="ml-2 text-xs text-zinc-500">⏱ {problem.optimalTime}</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className={`font-mono text-lg ${secondsLeft < 60 && running ? "text-red-600" : "text-zinc-700 dark:text-zinc-300"}`}>
            {secondsLeft > 0 ? fmt(secondsLeft) : `${TIME_LIMITS[problem.difficulty]}:00`}
          </div>
          {!running && !done && (
            <button onClick={start} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded font-medium">Start ({TIME_LIMITS[problem.difficulty]} min)</button>
          )}
          {done && (
            <button onClick={() => pickNew()} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded font-medium">Next problem</button>
          )}
          <select value={problem.pattern} onChange={(e) => pickNew(e.target.value)} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-sm bg-white dark:bg-zinc-900">
            <option value="">All patterns</option>
            {PATTERNS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left: Problem + Hints */}
        <div className="overflow-auto p-6 border-r border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold mb-2">Problem</h2>
          <p className="text-sm whitespace-pre-wrap mb-4">{problem.description}</p>

          <div className="bg-zinc-100 dark:bg-zinc-800 rounded p-3 mb-4">
            <div className="text-xs text-zinc-500 mb-1">Signature</div>
            <code className="text-xs">{problem.signature}</code>
          </div>

          {problem.tags && problem.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {problem.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">#{t}</span>
              ))}
            </div>
          )}

          {/* Progressive Hints */}
          {problem.hints && (
            <div className="mb-4 p-4 border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">💡 Stuck? Reveal a hint</h3>
                <span className="text-xs text-amber-700 dark:text-amber-300">{hintsUsed}/3 used</span>
              </div>
              {hintLevel === 0 ? (
                <button
                  onClick={revealNextHint}
                  className="w-full px-3 py-2 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded text-sm font-medium hover:bg-amber-300"
                >
                  {LEVEL_EMOJI[0]} Reveal {LEVEL_LABELS[0]}
                </button>
              ) : (
                <div className="space-y-2">
                  {problem.hints.slice(0, hintLevel + 1).map((h, i) => (
                    <div key={i} className="text-sm text-amber-900 dark:text-amber-200 bg-white dark:bg-amber-950/50 p-3 rounded">
                      <div className="font-semibold text-xs mb-1">{LEVEL_EMOJI[i]} {LEVEL_LABELS[i]}</div>
                      {h}
                    </div>
                  ))}
                  {hintLevel < 2 && (
                    <button onClick={revealNextHint} className="w-full px-3 py-2 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded text-sm font-medium">
                      {LEVEL_EMOJI[hintLevel + 1]} Reveal {LEVEL_LABELS[hintLevel + 1]}
                    </button>
                  )}
                </div>
              )}
              {hintsUsed > 0 && (
                <button
                  onClick={() => setChatOpen(true)}
                  className="mt-2 w-full px-3 py-2 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-950"
                >
                  💬 Ask the hint bot for more
                </button>
              )}
            </div>
          )}

          {!problem.hints && (
            <button onClick={() => setChatOpen(true)} className="mb-4 w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">
              💬 Stuck? Chat with hint bot
            </button>
          )}

          <h3 className="font-semibold mb-2 mt-6">Test Cases</h3>

          {globalError && (
            <div className="mb-3 p-3 rounded border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/50 text-sm">
              <div className="font-semibold text-red-700 dark:text-red-300 mb-1">⚠️ {globalError}</div>
              {globalError.includes("not found") && (
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Make sure your function name matches the signature: <code className="bg-zinc-200 dark:bg-zinc-800 px-1 rounded">{problem.signature}</code>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            {problem.tests.map((t, i) => {
              const r = results[i];
              return (
                <div key={i} className={`p-2 rounded text-xs font-mono ${
                  r ? (r.pass ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950") : "bg-zinc-100 dark:bg-zinc-800"
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div>Input: {JSON.stringify(t.input)}</div>
                      <div>Expected: {JSON.stringify(t.output)}</div>
                      {r && (
                        <div>
                          {r.error ? (
                            <span className="text-red-600 dark:text-red-400">Error: {r.error}</span>
                          ) : (
                            <span>Got: {JSON.stringify(r.got)}</span>
                          )}
                        </div>
                      )}
                    </div>
                    {r && (
                      <div className="text-zinc-500 ml-2">
                        {r.pass ? "✓" : "✗"} {r.durationMs?.toFixed(2)}ms
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Console output panel */}
          {consoleLogs.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowConsole((v) => !v)}
                className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {showConsole ? "▼" : "▶"} Console output ({consoleLogs.length} lines)
              </button>
              {showConsole && (
                <pre className="mt-1 p-2 bg-zinc-900 dark:bg-black text-green-400 rounded text-xs font-mono overflow-x-auto max-h-40 overflow-y-auto">
                  {consoleLogs.join("\n")}
                </pre>
              )}
            </div>
          )}
          {results.length > 0 && (
            <div className="mt-4 flex gap-2">
              {allPassed ? (
                <button onClick={() => submit(true)} className="px-4 py-2 bg-green-600 text-white rounded">✅ Mark solved</button>
              ) : (
                <button onClick={() => submit(false)} className="px-4 py-2 bg-red-600 text-white rounded">❌ Give up</button>
              )}
            </div>
          )}
        </div>

        {/* Right: Editor + optional chat panel */}
        <div className="flex flex-col overflow-hidden">
          <div className="flex-1 grid grid-cols-1" style={{ gridTemplateColumns: chatOpen ? "1fr 320px" : "1fr" }}>
            <div className="flex flex-col overflow-hidden">
              <Suspense fallback={<div className="h-full flex items-center justify-center text-zinc-500">Loading editor…</div>}>
                <Editor
                  height="100%"
                  defaultLanguage="typescript"
                  value={code}
                  onChange={(v) => setCode(v ?? "")}
                  theme="vs-dark"
                  options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false }}
                />
              </Suspense>
              <div className="border-t border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-900 flex gap-2">
            <button
              onClick={runTests}
              disabled={running}
              className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded font-medium disabled:opacity-50"
            >
              {running ? "Running..." : "Run tests"}
            </button>
            <button onClick={() => setCode(problem.starterCode)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded">Reset code</button>
                <button
                  onClick={() => setChatOpen((v) => !v)}
                  className={`ml-auto px-3 py-2 rounded text-sm ${chatOpen ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200" : "border border-zinc-300 dark:border-zinc-700"}`}
                >
                  {chatOpen ? "✕ Close chat" : "💬 Chat"}
                </button>
              </div>
            </div>
            {chatOpen && <HintChat problem={problem} onClose={() => setChatOpen(false)} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Hint chat panel (Socratic tutor via /api/hint) ----
function HintChat({ problem, onClose }: { problem: Problem; onClose: () => void }) {
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string; ts: number }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = storage.getHints(problem.id);
    if (stored.length === 0) {
      setMsgs([{
        role: "assistant",
        ts: Date.now(),
        content: `Hi! I'm your hint tutor for **${problem.title}**. I'll help you think through it — but I won't give you the answer. Try me:\n\n• "I'm stuck, where do I start?"\n• "What data structure should I use?"\n• "Is my brute force O(n²) too slow?"`,
      }]);
    } else {
      setMsgs(stored);
    }
  }, [problem.id, problem.title]);

  useEffect(() => {
    storage.saveHints(problem.id, msgs);
  }, [msgs, problem.id]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: "user" as const, content: text, ts: Date.now() };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemDescription: problem.description,
          pattern: problem.pattern,
          difficulty: problem.difficulty,
          userQuestion: text,
          history: msgs,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setMsgs((m) => [...m, { role: "assistant", content: data.hint, ts: Date.now() }]);
      storage.bumpHint(problem.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-l border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <div>
          <div className="font-semibold text-sm">💬 Hint Tutor</div>
          <div className="text-xs text-zinc-500">Socratic, no spoilers</div>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 text-sm">✕</button>
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={`text-sm p-2 rounded whitespace-pre-wrap ${
            m.role === "user" ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 ml-6" : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 mr-6"
          }`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="text-xs text-zinc-500 italic">tutor is thinking…</div>}
        {error && <div className="text-xs text-red-600">Error: {error}. Make sure Bun API is running on port 3001 with GEMINI_API_KEY set.</div>}
      </div>
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="What have you tried? Ask for a hint…"
          rows={2}
          className="w-full text-sm p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 resize-none"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="mt-1 w-full px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}