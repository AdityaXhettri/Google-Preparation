import { useEffect, useRef, useState } from "react";
import { BEHAVIORAL, ATTRIBUTE_LABELS, randomBehavioral, type BehavioralQuestion } from "../lib/behavioral";
import { storage } from "../lib/storage";

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function BehavioralPractice() {
  const [question, setQuestion] = useState<BehavioralQuestion | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [running, setRunning] = useState(false);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [startedAt, setStartedAt] = useState(0);

  useEffect(() => { setQuestion(randomBehavioral()); }, []);
  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, secondsLeft]);
  useEffect(() => {
    if (running && secondsLeft === 0) {
      setRunning(false);
      stopRecording();
    }
  }, [secondsLeft, running]);

  if (!question) return <div className="p-8 text-zinc-500">Loading…</div>;

  const nextQuestion = () => {
    setQuestion(randomBehavioral());
    setSecondsLeft(120);
    setRunning(false);
    setNotes("");
    setRating(null);
    setAudioUrl(null);
  };

  const start = () => {
    setSecondsLeft(120);
    setStartedAt(Date.now());
    setRunning(true);
    setRating(null);
    setNotes("");
    setAudioUrl(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
      setRecording(false);
    }
  };

  const submit = () => {
    setRunning(false);
    stopRecording();
    storage.addBehavioral({
      id: question.id,
      question: question.question,
      startedAt,
      durationSec: 120 - secondsLeft,
      audioBlobUrl: audioUrl ?? undefined,
      selfRating: rating ?? undefined,
      notes,
    });
    storage.recordActivity();
  };

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <header className="mb-6">
        <div className="text-xs text-zinc-500 uppercase">{ATTRIBUTE_LABELS[question.attribute]}</div>
        <h1 className="text-2xl font-bold mt-1">{question.question}</h1>
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className={`font-mono text-3xl ${secondsLeft < 30 && running ? "text-red-600" : "text-zinc-700 dark:text-zinc-300"}`}>{fmt(secondsLeft)}</div>
          <div className="flex gap-2">
            {!running && !audioUrl && (
              <button onClick={start} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded font-medium">Start 2-min answer</button>
            )}
            {running && !recording && (
              <button onClick={startRecording} className="px-4 py-2 bg-red-600 text-white rounded font-medium">🎤 Record</button>
            )}
            {running && recording && (
              <button onClick={stopRecording} className="px-4 py-2 bg-red-700 text-white rounded font-medium">⏹ Stop recording</button>
            )}
            {audioUrl && (
              <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded font-medium">✓ Save attempt</button>
            )}
            {audioUrl && (
              <button onClick={nextQuestion} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded">Next →</button>
            )}
          </div>
        </div>

        {audioUrl && (
          <div className="mt-4">
            <div className="text-xs text-zinc-500 mb-1">Your recording</div>
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}

        <div className="mt-4">
          <label className="text-xs text-zinc-500">Self-rating</label>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n as 1 | 2 | 3 | 4 | 5)} className={`w-10 h-10 rounded ${rating === n ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>{n}</button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-zinc-500">Notes (STAR outline)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Situation: ...&#10;Task: ...&#10;Action: ...&#10;Result: ..." className="w-full mt-1 p-3 border border-zinc-300 dark:border-zinc-700 rounded text-sm bg-white dark:bg-zinc-900 resize-none h-32 font-mono" />
        </div>
      </div>

      <details className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
        <summary className="cursor-pointer font-medium">STAR Framework Reminder</summary>
        <div className="mt-3 text-sm space-y-2">
          <div><strong>S</strong>ituation — Set context. Who, what, when.</div>
          <div><strong>T</strong>ask — What was YOUR specific responsibility?</div>
          <div><strong>A</strong>ction — What did YOU do? (3-5 bullets)</div>
          <div><strong>R</strong>esult — Outcome with metrics. What did you learn?</div>
        </div>
      </details>
    </div>
  );
}