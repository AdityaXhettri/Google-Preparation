@echo off
REM ============================================================
REM  Google L4 Interview Prep - first-time install
REM ============================================================

title Google L4 Interview Prep - Installer
cd /d "%~dp0"

where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not on PATH. Install Python 3.10+ first.
    echo         from https://python.org and tick "Add to PATH".
    echo.
    pause
    exit /b 1
)

python launcher.py install
pause
