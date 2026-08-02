import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../lib/storage";
import { randomProblem, type Problem } from "../lib/problems";
import { randomDesignProblem, type SystemDesignProblem } from "../lib/system-design";
import { randomBehavioral, type BehavioralQuestion, ATTRIBUTE_LABELS } from "../lib/behavioral";

type Phase = "intro" | "dsa" | "design" | "behavioral" | "summary";
const PHASE_DURATIONS: Record<Phase, number> = {
  intro: 5 * 60,
  dsa: 35 * 60,
  design: 25 * 60,
  behavioral: 10 * 60,
  summary: 0,
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function MockInterview() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATIONS.intro);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(0);

  const [dsaProblem, setDsaProblem] = useState<Problem | null>(null);
  const [sdProblem, setSdProblem] = useState<SystemDesignProblem | null>(null);
  const [bhQuestion, setBhQuestion] = useState<BehavioralQuestion | null>(null);

  const [dsaNotes, setDsaNotes] = useState("");
  const [sdNotes, setSdNotes] = useState("");
  const [bhNotes, setBhNotes] = useState("");
  const [bhRating, setBhRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);

  // Timer
  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, secondsLeft]);

  const start = () => {
    setDsaProblem(randomProblem(undefined, "medium"));
    setSdProblem(randomDesignProblem());
    setBhQuestion(randomBehavioral());
    setStartedAt(Date.now());
    setRunning(true);
    setPhase("intro");
    setSecondsLeft(PHASE_DURATIONS.intro);
  };

  const nextPhase = () => {
    if (phase === "intro") { setPhase("dsa"); setSecondsLeft(PHASE_DURATIONS.dsa); }
    else if (phase === "dsa") { setPhase("design"); setSecondsLeft(PHASE_DURATIONS.design); }
    else if (phase === "design") { setPhase("behavioral"); setSecondsLeft(PHASE_DURATIONS.behavioral); }
    else if (phase === "behavioral") { setPhase("summary"); setRunning(false); saveResults(); }
  };

  const saveResults = () => {
    // Save the mock as a single attempt + practice sessions
    storage.addAttempt({
      id: crypto.randomUUID(),
      problemId: dsaProblem?.id ?? "mock",
      pattern: dsaProblem?.pattern ?? "mock",
      difficulty: "medium",
      startedAt,
      finishedAt: Date.now(),
      solved: dsaNotes.length > 50, // heuristic
      retries: 0,
      hintsUsed: 0,
    });
    storage.addSystemDesign({
      id: crypto.randomUUID(),
      problemId: sdProblem?.id ?? "mock",
      startedAt,
      durationSec: 25 * 60,
      notes: sdNotes,
    });
    if (bhQuestion) {
      storage.addBehavioral({
        id: crypto.randomUUID(),
        question: bhQuestion.question,
        startedAt,
        durationSec: 10 * 60,
        notes: bhNotes,
        selfRating: bhRating ?? undefined,
      });
    }
    storage.recordActivity();
  };

  if (phase === "intro" && !running) {
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🎤 Mock Interview</h1>
        <p className="text-zinc-500 mb-8">Full Google L4 simulation. 75 minutes total. Pick a random medium, a system design, and a behavioral. Talk out loud.</p>

        <div className="space-y-3 mb-8">
          <Phase label="Introduction & small talk" min={5} />
          <Phase label="DSA — medium problem" min={35} />
          <Phase label="System design" min={25} />
          <Phase label="Behavioral (STAR)" min={10} />
        </div>

        <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">📋 Mock rules</h3>
          <ul className="text-sm space-y-1 list-disc list-inside text-zinc-700 dark:text-zinc-300">
            <li>One tab only. No Google. No solutions. Talk out loud.</li>
            <li>You can take notes in each phase, but the timer doesn't pause.</li>
            <li>When time's up, you'll get a summary of how you did.</li>
          </ul>
        </div>

        <button onClick={start} className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium text-lg hover:bg-red-700">
          ▶ Start 75-min mock
        </button>
      </div>
    );
  }

  if (phase === "summary") {
    const totalTime = 75 * 60 - secondsLeft;
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📊 Mock complete!</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Stat label="Total time" value={fmt(totalTime)} />
          <Stat label="DSA notes" value={`${dsaNotes.length} chars`} />
          <Stat label="SD notes" value={`${sdNotes.length} chars`} />
          <Stat label="BH rating" value={bhRating ? `${bhRating}/5` : "—"} />
        </div>
        <div className="space-y-4">
          <Section title="DSA — what to review">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{dsaProblem?.title} ({dsaProblem?.pattern})</p>
            <p className="text-xs text-zinc-500 mt-1">Look up optimal solution. Compare to your approach.</p>
          </Section>
          <Section title="System design — coverage check">
            <ul className="text-xs space-y-1">
              {sdProblem?.checklist.map((c) => (
                <li key={c.id}>□ {c.label}</li>
              ))}
            </ul>
          </Section>
          <Section title="Behavioral — was it a STAR?">
            <p className="text-sm">{bhQuestion?.question}</p>
            {bhNotes && <p className="text-xs text-zinc-500 mt-2">Your notes: {bhNotes.slice(0, 200)}...</p>}
          </Section>
        </div>
        <div className="mt-8 flex gap-2">
          <button onClick={() => { setPhase("intro"); setRunning(false); setSecondsLeft(PHASE_DURATIONS.intro); }} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded">
            New mock
          </button>
        </div>
      </div>
    );
  }

  // Active phase: header + content
  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex justify-between items-center">
        <div>
          <div className="text-xs text-zinc-500 uppercase">phase {phase === "intro" ? "1/4" : phase === "dsa" ? "2/4" : phase === "design" ? "3/4" : "4/4"}</div>
          <h1 className="text-xl font-bold">
            {phase === "intro" && "👋 Introduction"}
            {phase === "dsa" && `💻 DSA: ${dsaProblem?.title}`}
            {phase === "design" && `🏗️ System Design: ${sdProblem?.title}`}
            {phase === "behavioral" && `🎤 Behavioral: ${bhQuestion && ATTRIBUTE_LABELS[bhQuestion.attribute]}`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className={`font-mono text-2xl ${secondsLeft < 60 && running ? "text-red-600" : "text-zinc-700 dark:text-zinc-300"}`}>
            {fmt(secondsLeft)}
          </div>
          <button onClick={nextPhase} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded font-medium">
            Next phase →
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        {phase === "intro" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Tell me about yourself</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Walk me through your background, your current role, and what brings you here.
              Aim for 90-120 seconds. Practice talking out loud.
            </p>
            <textarea
              value={dsaNotes}
              onChange={(e) => setDsaNotes(e.target.value)}
              placeholder="Notes on what you said… (optional)"
              className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded text-sm bg-white dark:bg-zinc-900 h-40"
            />
          </div>
        )}

        {phase === "dsa" && dsaProblem && (
          <div className="max-w-3xl mx-auto">
            <p className="text-zinc-700 dark:text-zinc-300 mb-4 whitespace-pre-wrap">{dsaProblem.description}</p>
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded p-3 mb-4">
              <code className="text-xs">{dsaProblem.signature}</code>
            </div>
            <p className="text-sm text-zinc-500 mb-2">Take notes on your approach:</p>
            <textarea
              value={dsaNotes}
              onChange={(e) => setDsaNotes(e.target.value)}
              placeholder="Approach, edge cases, complexity…"
              className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded text-sm bg-white dark:bg-zinc-900 h-64 font-mono"
            />
          </div>
        )}

        {phase === "design" && sdProblem && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-2">{sdProblem.title}</h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4 whitespace-pre-wrap">{sdProblem.description}</p>
            <p className="text-sm text-zinc-500 mb-2">Sketch + notes:</p>
            <textarea
              value={sdNotes}
              onChange={(e) => setSdNotes(e.target.value)}
              placeholder="Components, scale estimates, trade-offs, bottlenecks…"
              className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded text-sm bg-white dark:bg-zinc-900 h-64 font-mono"
            />
          </div>
        )}

        {phase === "behavioral" && bhQuestion && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">{bhQuestion.question}</h2>
            <p className="text-zinc-500 mb-6">Answer out loud. Use STAR. 2 minutes.</p>
            <textarea
              value={bhNotes}
              onChange={(e) => setBhNotes(e.target.value)}
              placeholder="STAR outline of what you said…"
              className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded text-sm bg-white dark:bg-zinc-900 h-48 font-mono mb-4"
            />
            <div>
              <p className="text-sm text-zinc-500 mb-1">Self-rate (1=weak, 5=strong):</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setBhRating(n as 1 | 2 | 3 | 4 | 5)} className={`w-10 h-10 rounded ${bhRating === n ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "border border-zinc-300 dark:border-zinc-700"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Phase({ label, min }: { label: string; min: number }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
      <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-sm font-bold">{min}</div>
      <div className="text-sm">{label}</div>
      <div className="ml-auto text-xs text-zinc-500">min</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
      <div className="text-xs text-zinc-500 uppercase">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}