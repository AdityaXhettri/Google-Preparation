import { useEffect, useState } from "react";
import { SYSTEM_DESIGN, type SystemDesignProblem, randomDesignProblem } from "../lib/system-design";
import { storage } from "../lib/storage";

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function SystemDesignPractice() {
  const [problem, setProblem] = useState<SystemDesignProblem | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [running, setRunning] = useState(false);
  const [notes, setNotes] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const [startedAt, setStartedAt] = useState(0);

  useEffect(() => { setProblem(randomDesignProblem()); }, []);
  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, secondsLeft]);
  useEffect(() => {
    if (running && secondsLeft === 0) { setRunning(false); setDone(true); }
  }, [secondsLeft, running]);

  if (!problem) return <div className="p-8 text-zinc-500">Loading…</div>;

  const newProblem = () => {
    setProblem(randomDesignProblem());
    setSecondsLeft(45 * 60);
    setRunning(false);
    setNotes("");
    setChecked({});
    setDone(false);
  };

  const start = () => {
    setSecondsLeft(45 * 60);
    setStartedAt(Date.now());
    setRunning(true);
    setDone(false);
  };

  const submit = () => {
    setRunning(false);
    setDone(true);
    storage.addSystemDesign({
      id: crypto.randomUUID(),
      problemId: problem.id,
      startedAt,
      durationSec: 45 * 60 - secondsLeft,
      notes,
      checklistScore: Object.values(checked).filter(Boolean).length,
    });
    storage.recordActivity();
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex justify-between items-center">
        <div>
          <div className="text-xs text-zinc-500 uppercase">system design</div>
          <h1 className="text-xl font-bold">{problem.title}</h1>
          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
            problem.difficulty === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
          }`}>{problem.difficulty.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`font-mono text-lg ${secondsLeft < 300 && running ? "text-red-600" : "text-zinc-700 dark:text-zinc-300"}`}>{fmt(secondsLeft)}</div>
          {!running && !done && <button onClick={start} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded font-medium">Start (45 min)</button>}
          {done && <button onClick={newProblem} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded font-medium">Next problem</button>}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <div className="overflow-auto p-6 border-r border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold mb-2">Problem</h2>
          <p className="text-sm whitespace-pre-wrap mb-6">{problem.description}</p>
          <h3 className="font-semibold mb-2">Key Requirements</h3>
          <ul className="text-sm space-y-1 list-disc list-inside mb-6">
            {problem.keyRequirements.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <h3 className="font-semibold mb-2">Self-Review Checklist</h3>
          <p className="text-xs text-zinc-500 mb-2">Check off as you cover each point:</p>
          <div className="space-y-1">
            {problem.checklist.map((c) => (
              <label key={c.id} className="flex items-start gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!checked[c.id]} onChange={(e) => setChecked({ ...checked, [c.id]: e.target.checked })} className="mt-0.5" />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
          {!running && !done && (
            <button onClick={start} className="mt-6 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded font-medium w-full">▶ Start 45-min mock</button>
          )}
          {running && (
            <button onClick={submit} className="mt-6 px-4 py-2 bg-green-600 text-white rounded font-medium w-full">✓ Submit & save</button>
          )}
        </div>

        <div className="flex flex-col p-6 overflow-hidden">
          <h3 className="font-semibold mb-2">Your Notes</h3>
          <p className="text-xs text-zinc-500 mb-3">Sketch boxes & arrows. Note scale estimates. List trade-offs.</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="┌─────────┐     ┌─────────┐&#10;│ Client  │────▶│   API   │&#10;└─────────┘     └────┬────┘&#10;                     ▼&#10;                ┌─────────┐&#10;                │  Cache  │&#10;                └─────────┘"
            className="flex-1 p-4 border border-zinc-300 dark:border-zinc-700 rounded font-mono text-sm bg-white dark:bg-zinc-900 resize-none"
          />
        </div>
      </div>
    </div>
  );
}