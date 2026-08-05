@echo off
title Google L4 Interview Prep Platform
color 0A
echo.
echo ============================================
echo   Google L4 Interview Prep Platform
echo ============================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download it from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if Bun is installed
where bun >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Bun is not installed. Backend may not work.
    echo Install Bun from: https://bun.sh
    echo The frontend will still work without it.
    echo.
)

:: Install UI dependencies if needed
if not exist "platform\ui\node_modules" (
    echo [1/3] Installing frontend dependencies (this may take a minute)...
    cd platform\ui
    call npm install
    cd ..\..
) else (
    echo [1/3] Frontend dependencies already installed.
)

:: Install API dependencies if needed
if not exist "platform\api\node_modules" (
    if exist "platform\api" (
        echo [2/3] Installing backend dependencies...
        cd platform\api
        call bun install
        cd ..\..
    )
) else (
    echo [2/3] Backend dependencies already installed.
)

:: Start the API in background (if Bun is available)
where bun >nul 2>&1
if %errorlevel% equ 0 (
    echo [2/3] Starting backend on http://localhost:3001 ...
    start "API Server" /min cmd /c "cd platform\api && bun run dev"
    timeout /t 2 /nobreak >nul
) else (
    echo [2/3] Skipping backend (Bun not installed)
)

:: Start the frontend
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
