@echo off
setlocal enableextensions
title Google L4 Interview Prep Platform
color 0A
echo.
echo ============================================
echo   Google L4 Interview Prep Platform
echo ============================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please download it from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

:: Install UI dependencies if needed
if not exist "platform\ui\node_modules" (
    echo [1/3] Installing frontend dependencies... this may take 1-3 minutes
    cd platform\ui
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed!
        cd ..\..
        pause
        exit /b 1
    )
    cd ..\..
    echo [OK] Frontend dependencies installed.
) else (
    echo [1/3] Frontend dependencies already installed.
)

:: Check if Bun is installed for backend
where bun >nul 2>&1
if errorlevel 1 (
    echo [2/3] Bun not installed. Skipping backend.
    echo       The frontend will work without AI tutor.
    goto :start_frontend
)

echo [2/3] Bun found. Starting backend on http://localhost:3001 ...

:: Start the API in a separate window
cd platform\api
start "API Server - Google Prep" cmd /c "bun run dev"
cd ..\..

:: Give the backend a moment to start
timeout /t 3 /nobreak >nul

:start_frontend
echo.
echo [3/3] Starting frontend on http://localhost:5173 ...
echo.
echo ============================================
echo   App is starting!
echo   Open: http://localhost:5173
echo.
echo   To STOP: Close this window or run stop.bat
echo ============================================
echo.

cd platform\ui
call npm run dev
endlocal
