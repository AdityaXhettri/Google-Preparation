@echo off
title Stop Google L4 Interview Prep
color 0C
echo.
echo ============================================
echo   Stopping Google L4 Interview Prep
echo ============================================
echo.

:: Kill Vite (frontend)
echo Stopping frontend (port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
    echo   - Killed PID %%a
)

:: Kill Bun (backend)
echo Stopping backend (port 3001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
    echo   - Killed PID %%a
)

:: Kill any lingering node/bun processes related to the project
echo Cleaning up related processes...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq API Server*" >nul 2>&1
taskkill /F /IM bun.exe /FI "WINDOWTITLE eq API Server*" >nul 2>&1

echo.
echo ============================================
echo   All servers stopped!
echo ============================================
echo.
pause
