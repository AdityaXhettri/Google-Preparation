"""
Google L4 Interview Prep — cross-platform launcher.

Usage (Python):
    python launcher.py           # start backend + frontend + open browser
    python launcher.py stop      # stop any running servers
    python launcher.py install   # run first-time install only

Used by start.bat / stop.bat so we don't have to fight
with Windows .bat quoting around 'start "" cmd /k ...'.
"""
from __future__ import annotations

import os
import sys
import shutil
import socket
import subprocess
import time
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
UI = ROOT / "platform" / "ui"
API = ROOT / "platform" / "api"
NODE_MODULES = UI / "node_modules"

API_PORT = 3001
UI_PORT = 5173

# How long we'll wait for the *first* `npm install`.
NPM_INSTALL_TIMEOUT_S = 600  # 10 min
STARTUP_TIMEOUT_S = 60       # 60 sec to start servers


def info(msg: str) -> None:
    print(f"[launcher] {msg}", flush=True)


def warn(msg: str) -> None:
    print(f"[warn] {msg}", flush=True)


def err(msg: str) -> None:
    print(f"[error] {msg}", flush=True)


# ----- preflight ------------------------------------------------------------

def find_npm() -> str:
    """Locate npm on Windows. We need a call that handles .CMD / .bat shims."""
    candidates = [
        shutil.which("npm.cmd"),
        shutil.which("npm.bat"),
        shutil.which("npm"),
        r"C:\Program Files\nodejs\npm.cmd",
        r"C:\Program Files (x86)\nodejs\npm.cmd",
    ]
    for c in candidates:
        if c and Path(c).exists():
            return c
    sys.exit("[FATAL] Node.js (npm) not found. Install from `https://nodejs.org`")


def find_bun() -> str | None:
    """Locate bun on Windows. Optional — only needed for AI tutor."""
    candidates = [
        shutil.which("bun.cmd"),
        shutil.which("bun.bat"),
        shutil.which("bun"),
        os.path.expanduser(r"~\.bun\bin\bun.exe"),
    ]
    for c in candidates:
        if c and Path(c).exists():
            return c
    return None


# ----- setup ----------------------------------------------------------------

def setup_ui(npm: str) -> None:
    """Install npm packages if vite is not already there."""
    if (NODE_MODULES / "vite").exists():
        info("Node deps already installed (vite found).")
        return
    info("Installing UI Node deps...")
    info("(this may take 1-3 minutes the first time, instant afterwards)")
    try:
        result = subprocess.run(
            [npm, "install", "--no-audit", "--no-fund"],
            cwd=str(UI),
            timeout=NPM_INSTALL_TIMEOUT_S,
            stdout=sys.stdout, stderr=subprocess.STDOUT,
            shell=False,
        )
        if result.returncode != 0:
            sys.exit(f"[FATAL] npm install exited with code {result.returncode}")
    except subprocess.TimeoutExpired:
        sys.exit("[FATAL] npm install timed out (>10 min)")


def setup_api(bun: str | None) -> None:
    """Install bun packages if node_modules doesn't exist."""
    api_modules = API / "node_modules"
    if api_modules.exists():
        info("API deps already installed.")
        return
    if bun is None:
        info("Bun not installed — skipping API setup. AI tutor won't work.")
        return
    info("Installing API deps with bun...")
    try:
        result = subprocess.run(
            [bun, "install"],
            cwd=str(API),
            timeout=300,
            stdout=sys.stdout, stderr=subprocess.STDOUT,
        )
        if result.returncode != 0:
            warn(f"bun install exited with code {result.returncode}")
    except subprocess.TimeoutExpired:
        warn("bun install timed out (>5 min)")


# ----- port handling --------------------------------------------------------

def _pid_listening_on(port: int) -> list[int]:
    """Return PIDs that own LISTENING sockets on the given port (Windows)."""
    pids: list[int] = []
    try:
        out = subprocess.check_output(["netstat", "-ano", "-p", "TCP"], text=True)
    except Exception:
        return pids
    needle = f":{port} "
    for line in out.splitlines():
        if needle in line and "LISTENING" in line:
            parts = line.split()
            if parts:
                try:
                    pids.append(int(parts[-1]))
                except ValueError:
                    pass
    return pids


def free_port(port: int) -> None:
    for pid in _pid_listening_on(port):
        try:
            info(f"killing PID {pid} on :{port}")
            subprocess.run(["taskkill", "/F", "/PID", str(pid)], capture_output=True)
        except Exception:
            pass


def is_port_open(port: int, timeout: float = 1.0) -> bool:
    """True if anything is listening on the given port."""
    for host in ("127.0.0.1", "0.0.0.0", "[::1]"):
        try:
            with socket.create_connection((host, port), timeout=timeout):
                return True
        except OSError:
            continue
    return False


# ----- launch ---------------------------------------------------------------

def _spawn(cmd: list[str], title: str, cwd: Path) -> subprocess.Popen:
    """Spawn a long-lived process in its own visible console window."""
    info(f"starting {title} -> {' '.join(cmd)}")
    launcher_bat = cwd / f"_launcher_{abs(hash(title))}.bat"
    quoted = subprocess.list2cmdline(cmd)
    launcher_bat.write_text(
        f"@echo off\r\n"
        f"title {title}\r\n"
        f"cd /d \"{cwd}\"\r\n"
        f"{quoted}\r\n",
        encoding="utf-8",
    )
    flags = subprocess.CREATE_NEW_CONSOLE
    try:
        return subprocess.Popen(
            [str(launcher_bat)],
            creationflags=flags,
            shell=False,
        )
    finally:
        def _cleanup():
            try:
                launcher_bat.unlink(missing_ok=True)
            except Exception:
                pass
        import threading
        threading.Timer(5.0, _cleanup).start()


def start() -> int:
    """Start UI + optional API in their own windows and open the browser."""
    info("---- setup phase ----")
    npm = find_npm()
    bun = find_bun()
    setup_ui(npm)
    setup_api(bun)
    info("setup complete")
    info("---- launch phase ----")

    # 2) Free stale ports
    free_port(API_PORT)
    free_port(UI_PORT)

    # 3) Spawn API (if Bun installed)
    api_ok = False
    if bun:
        _spawn(
            [bun, "run", "dev"],
            "Google Prep - Backend (Bun)",
            API,
        )
    else:
        info("Bun not installed — backend skipped (AI tutor will use offline mode)")

    # 4) Spawn UI
    _spawn(
        [npm, "run", "dev"],
        "Google Prep - Frontend (Vite)",
        UI,
    )

    # 5) Wait for ports to come up
    info(f"Waiting up to {STARTUP_TIMEOUT_S}s for servers to come up...")
    deadline = time.time() + STARTUP_TIMEOUT_S
    frontend_ok = False
    next_status_emit = 0
    while time.time() < deadline:
        frontend_ok = frontend_ok or is_port_open(UI_PORT)
        if frontend_ok:
            break
        now = time.time()
        if now >= next_status_emit:
            status = f"frontend:{'up' if frontend_ok else '...'}"
            print(f"[launcher] {status}", flush=True)
            next_status_emit = now + 5
        time.sleep(0.5)

    # 6) Open browser
    if frontend_ok:
        info("opening browser...")
        try:
            if sys.platform == "win32":
                # Use Edge by default since user prefers it
                edge_paths = [
                    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
                ]
                edge = next((p for p in edge_paths if Path(p).exists()), None)
                if edge:
                    subprocess.Popen([edge, f"http://localhost:{UI_PORT}/"])
                    info(f"opened in Edge")
                else:
                    os.startfile(f"http://localhost:{UI_PORT}/")  # type: ignore[attr-defined]
                    info("opened in default browser")
            else:
                webbrowser.open(f"http://localhost:{UI_PORT}/")
        except Exception as e:
            warn(f"could not open browser: {e}")
            warn(f"Open http://localhost:{UI_PORT}/ manually in Edge.")
    else:
        err("Frontend did not start. Check the console window.")

    print()
    print("=" * 60)
    print("  Servers should be running.")
    print(f"  Frontend: http://localhost:{UI_PORT}/")
    print(f"  Backend:  http://localhost:{API_PORT}/  (if Bun was installed)")
    print("=" * 60)
    print("Two new console windows opened. Close them to stop.")
    print()

    # 7) Keep window open if double-clicked, exit if attached terminal
    if sys.stdin and sys.stdin.isatty():
        try:
            input("Press Enter to dismiss this window...")
        except EOFError:
            pass
    else:
        info("Launcher window will close in 5 sec...")
        time.sleep(5)
    return 0


def stop() -> int:
    info("freeing ports 5173 and 3001...")
    free_port(UI_PORT)
    free_port(API_PORT)
    info("done.")
    return 0


def install() -> int:
    npm = find_npm()
    bun = find_bun()
    setup_ui(npm)
    setup_api(bun)
    info("install complete")
    return 0


def main() -> int:
    cmd = sys.argv[1] if len(sys.argv) > 1 else "start"
    actions = {"start": start, "stop": stop, "install": install}
    if cmd not in actions:
        err(f"unknown command: {cmd}")
        print("usage: launcher.py [start|stop|install]")
        return 2
    return actions[cmd]()


if __name__ == "__main__":
    sys.exit(main())
