@echo off
REM ============================================================
REM  Google L4 Interview Prep — one-click launcher
REM
REM  Flow:
REM    1. Find Python on PATH
REM    2. Run launcher.py in THIS window (see progress live)
REM    3. Launcher spawns UI + backend in their own console windows
REM    4. Launcher opens Edge when 5173 is reachable
REM    5. This window waits until you press Enter, then exits
REM       (The server windows stay open)
REM ============================================================

title Google L4 Interview Prep - Launcher
color 0B

cd /d "%~dp0"

echo.
echo ============================================================
echo   Google L4 Interview Prep
echo ============================================================
echo.

where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not on PATH. Install Python 3.10+
    echo         from https://python.org and tick "Add to PATH".
    echo.
    pause
    exit /b 1
)

echo [start.bat] using Python: 
where python
echo.

python launcher.py
set "RC=%ERRORLEVEL%"

if not "%RC%"=="0" (
    echo.
    echo [start.bat] launcher exited with code %RC%.
    echo.
)

echo.
echo ============================================================
echo   Done. You can close this window (servers keep running).
echo ============================================================
echo.
pause
exit /b %RC%
