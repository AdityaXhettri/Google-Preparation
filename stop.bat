@echo off
setlocal enableextensions
title Stop Google L4 Interview Prep
color 0C
echo.
echo ============================================
echo   Stopping Google L4 Interview Prep
echo ============================================
echo.

:: Kill Vite (frontend on port 5173)
echo Stopping frontend on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING 2^>nul') do (
    echo   - Killing PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill Bun (backend on port 3001)
echo Stopping backend on port 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING 2^>nul') do (
    echo   - Killing PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill any lingering "API Server" window
echo Killing any API Server windows...
taskkill /F /FI "WINDOWTITLE eq API Server - Google Prep*" >nul 2>&1

echo.
echo ============================================
echo   All servers stopped!
echo ============================================
echo.
pause
endlocal
