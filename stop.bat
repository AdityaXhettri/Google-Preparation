@echo off
REM Google L4 Interview Prep - stop everything
title Google L4 Interview Prep - Stopper
cd /d "%~dp0"

where python >nul 2>&1
if errorlevel 1 (
    echo Python not on PATH. Trying fallback...
    goto :fallback
)

python launcher.py stop
goto :end

:fallback
:: Fallback if Python isn't installed - use netstat directly
echo Stopping servers on ports 5173 and 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING 2^>nul') do (
    echo Killing PID %%a on port 5173
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING 2^>nul') do (
    echo Killing PID %%a on port 3001
    taskkill /F /PID %%a >nul 2>&1
)
echo Done.

:end
pause