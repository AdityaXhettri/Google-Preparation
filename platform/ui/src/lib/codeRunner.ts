/**
 * JavaScript code execution sandbox using a Web Worker.
 * - 2 second timeout (kills infinite loops)
 * - Captures console.log
 * - Returns proper errors with line numbers
 */

export type TestResult = {
  pass: boolean;
  got: unknown;
  want: unknown;
  input: unknown[];
  error?: string;
  consoleOutput?: string[];
  durationMs?: number;
};

export type RunResult = {
  ok: boolean;
  results: TestResult[];
  totalMs: number;
  globalError?: string;
};

const WORKER_SOURCE = `
self.onmessage = (e) => {
  const { code, fnName, tests } = e.data;
  const start = performance.now();
  const logs: string[] = [];

  // Capture console
  const origLog = self.console.log;
  const origErr = self.console.error;
  const origWarn = self.console.warn;
  const origInfo = self.console.info;
  const fmt = (...args) => args.map(a => {
    if (typeof a === "object") { try { return JSON.stringify(a); } catch { return String(a); } }
    return String(a);
  }).join(" ");
  self.console.log = (...args) => { logs.push(fmt(...args)); };
  self.console.error = (...args) => { logs.push("ERROR: " + fmt(...args)); };
  self.console.warn = (...args) => { logs.push("WARN: " + fmt(...args)); };
  self.console.info = (...args) => { logs.push(fmt(...args)); };

  let userFn;
  try {
    // Wrap in a function that returns the user's function
    // Use eval-like behavior: build the function from the code
    const wrapper = new Function(code + "\\n; return typeof " + fnName + " === 'function' ? " + fnName + " : null;");
    userFn = wrapper();
  } catch (err) {
    self.postMessage({
      ok: false,
      globalError: err.message,
      consoleOutput: logs,
      totalMs: performance.now() - start,
    });
    return;
  }

  if (typeof userFn !== "function") {
    self.postMessage({
      ok: false,
      globalError: "Function '" + fnName + "' not found. Did you name it correctly?",
      consoleOutput: logs,
      totalMs: performance.now() - start,
    });
    return;
  }

  const results = [];
  for (const t of tests) {
    const tStart = performance.now();
    try {
      const got = userFn(...t.input);
      const tEnd = performance.now();
      const pass = JSON.stringify(got) === JSON.stringify(t.output);
      results.push({
        pass,
        got,
        want: t.output,
        input: t.input,
        consoleOutput: [...logs], // copy at this point
        durationMs: tEnd - tStart,
      });
      logs.length = 0; // clear for next test
    } catch (err) {
      results.push({
        pass: false,
        got: undefined,
        want: t.output,
        input: t.input,
        error: err.message + (err.stack ? "\\n" + err.stack.split("\\n").slice(0, 3).join("\\n") : ""),
        consoleOutput: [...logs],
        durationMs: performance.now() - tStart,
      });
      logs.length = 0;
    }
  }

  self.postMessage({
    ok: true,
    results,
    totalMs: performance.now() - start,
  });
};
`;

/**
 * Run user code against test cases in a Web Worker sandbox.
 * Returns after 2 seconds max (kills infinite loops).
 */
export async function runCodeInWorker(
  code: string,
  fnName: string,
  tests: Array<{ input: unknown[]; output: unknown }>
): Promise<RunResult> {
  return new Promise((resolve) => {
    const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    const TIMEOUT_MS = 2000;
    const timeoutId = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve({
        ok: false,
        results: tests.map((t) => ({
          pass: false,
          got: undefined,
          want: t.output,
          input: t.input,
          error: "⏱️ Code took too long (>2s). Possible infinite loop.",
          consoleOutput: [],
        })),
        totalMs: TIMEOUT_MS,
        globalError: "Code execution timed out after 2 seconds",
      });
    }, TIMEOUT_MS);

    worker.onmessage = (e: MessageEvent<RunResult>) => {
      clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(e.data);
    };

    worker.onerror = (err) => {
      clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve({
        ok: false,
        results: tests.map((t) => ({
          pass: false,
          got: undefined,
          want: t.output,
          input: t.input,
          error: err.message || "Worker error",
          consoleOutput: [],
        })),
        totalMs: 0,
        globalError: err.message,
      });
    };

    worker.postMessage({ code, fnName, tests });
  });
}