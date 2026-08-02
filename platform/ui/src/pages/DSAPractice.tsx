import { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PATTERNS, randomProblem, getProblem, type Problem } from "../lib/problems";
import { storage } from "../lib/storage";

const Editor = lazy(() => import("@monaco-editor/react").then((m) => ({ default: m.default })));

const TIME_LIMITS: Record<Problem["difficulty"], number> = { easy: 15, medium: 25, hard: 40 };

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function DSAPractice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<{ pass: boolean; got: unknown; want: unknown; input: unknown[] }[]>([]);
  const [done, setDone] = useState(false);
  const [startedAt, setStartedAt] = useState(0);

  useEffect(() => {
    const patternParam = searchParams.get("pattern") ?? undefined;
    const problemParam = searchParams.get("problem");
    const p = problemParam ? getProblem(problemParam) ?? randomProblem(patternParam) : randomProblem(patternParam);
    setProblem(p);
    setCode(p.starterCode);
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

  const runTests = () => {
    const out: typeof results = [];
    try {
      const fnName = problem.signature.match(/function (\w+)/)?.[1];
      const userFn = new Function(`
        ${code}
        return { ${fnName ?? "fn"} };
      `)();

      for (const t of problem.tests) {
        try {
          let got: unknown;
          if (fnName && userFn[fnName]) {
            got = userFn[fnName](...t.input);
          } else {
            out.push({ pass: false, got: "no function found", want: t.output, input: t.input });
            continue;
          }
          const pass = JSON.stringify(got) === JSON.stringify(t.output);
          out.push({ pass, got, want: t.output, input: t.input });
        } catch (err) {
          out.push({ pass: false, got: String(err), want: t.output, input: t.input });
        }
      }
    } catch (err) {
      out.push({ pass: false, got: `Compile error: ${String(err)}`, want: null, input: [] });
    }
    setResults(out);
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
    });
    storage.recordActivity();
  };

  const allPassed = results.length > 0 && results.every((r) => r.pass);

  return (
    <div className="h-screen flex flex-col">
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
        <div className="overflow-auto p-6 border-r border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold mb-2">Problem</h2>
          <p className="text-sm whitespace-pre-wrap mb-4">{problem.description}</p>
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded p-3 mb-4">
            <div className="text-xs text-zinc-500 mb-1">Signature</div>
            <code className="text-xs">{problem.signature}</code>
          </div>
          {problem.hints && (
            <details className="mb-4">
              <summary className="cursor-pointer text-sm text-zinc-500">Hints</summary>
              <ul className="mt-2 text-sm space-y-1 list-disc list-inside">
                {problem.hints.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </details>
          )}
          <h3 className="font-semibold mb-2 mt-6">Test Cases</h3>
          <div className="space-y-2">
            {problem.tests.map((t, i) => {
              const r = results[i];
              return (
                <div key={i} className={`p-2 rounded text-xs font-mono ${
                  r ? (r.pass ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950") : "bg-zinc-100 dark:bg-zinc-800"
                }`}>
                  <div>Input: {JSON.stringify(t.input)}</div>
                  <div>Expected: {JSON.stringify(t.output)}</div>
                  {r && <div>Got: {JSON.stringify(r.got)}</div>}
                </div>
              );
            })}
          </div>
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

        <div className="flex flex-col overflow-hidden">
          <div className="flex-1">
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
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-900 flex gap-2">
            <button onClick={runTests} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded font-medium">Run tests</button>
            <button onClick={() => setCode(problem.starterCode)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded">Reset code</button>
          </div>
        </div>
      </div>
    </div>
  );
}