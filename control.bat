@echo off
setlocal enableextensions
title Google L4 Interview Prep - Control Panel
color 0B
:menu
cls
echo.
echo ============================================
echo   Google L4 Interview Prep - Control Panel
echo ============================================
echo.
echo   [1] START the app
echo   [2] STOP the app
echo   [3] Open in browser
echo   [4] Check status
echo   [5] Restart the app
echo   [6] Clear all caches and restart
echo   [7] Exit
echo.
echo ============================================
echo.

set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto browser
if "%choice%"=="4" goto status
if "%choice%"=="5" goto restart
if "%choice%"=="6" goto clear
if "%choice%"=="7" exit

echo Invalid choice. Try again.
timeout /t 2 >nul
goto menu

:start
echo.
echo Starting the app...
echo.

:: Start backend (if Bun is installed)
where bun >nul 2>&1
if not errorlevel 1 (
    if exist "platform\api" (
        start "API Server - Google Prep" cmd /c "cd platform\api && bun run dev"
        echo [OK] Backend starting in new window
    )
) else (
    echo [INFO] Bun not installed. Backend skipped.
)

:: Start frontend
cd platform\ui
start "Frontend - Google Prep" cmd /c "npm run dev"
cd ..\..

echo.
echo ============================================
echo   App is starting!
echo ============================================
echo.
echo   The frontend and backend are running in
echo   separate windows. Wait 15-30 seconds for
echo   them to be ready (first time install is slow).
echo.
echo   Frontend URL: http://localhost:5173
echo   Backend URL:  http://localhost:3001
echo.
echo   If Chrome doesn't work, try Edge or Firefox.
echo   Or type the URL manually in your browser.
echo.
echo ============================================
echo.

:: Wait and check
echo Waiting for servers to be ready...
timeout /t 15 /nobreak >nul

:: Check status
netstat -aon | findstr :5173 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Frontend (port 5173) is NOT responding.
    echo Check the "Frontend - Google Prep" window for errors.
    echo.
    echo   You can also try opening this URL manually:
    echo   http://localhost:5173
) else (
    echo [OK] Frontend is running on http://localhost:5173
    echo.
    call :open_browser "http://localhost:5173"
)

netstat -aon | findstr :3001 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo [INFO] Backend (port 3001) not running. AI tutor will use offline mode.
) else (
    echo [OK] Backend is running on http://localhost:3001
)

echo.
pause
goto menu

:: Function to open browser — Edge only
:open_browser
set "url=%~1"
echo.
echo Opening browser to: %url%

:: Try Edge (x86) first
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "%url%"
    echo [OK] Opened in Edge
    goto :eof
)

:: Try Edge (64-bit)
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" "%url%"
    echo [OK] Opened in Edge
    goto :eof
)

:: Try Edge from PATH
where msedge >nul 2>&1
if not errorlevel 1 (
    start "" "msedge.exe" "%url%"
    echo [OK] Opened in Edge
    goto :eof
)

:: Fall back to default browser
start "" "%url%"
echo [OK] Opened (default browser)
goto :eof

:stop
echo.
echo Stopping the app...
call "%~dp0stop.bat"
goto menu

:browser
echo.
echo Opening browser...
call :open_browser "http://localhost:5173"
timeout /t 2 >nul
goto menu

:status
echo.
echo ============================================
echo   Server Status
echo ============================================
echo.

netstat -aon | findstr :5173 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo [STOPPED] Frontend on http://localhost:5173
) else (
    echo [RUNNING] Frontend on http://localhost:5173
)

netstat -aon | findstr :3001 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo [STOPPED] Backend on http://localhost:3001
) else (
    echo [RUNNING] Backend on http://localhost:3001
)

echo.
echo If browser doesn't open, type this URL in Edge:
echo   http://localhost:5173
echo.
echo ============================================
echo.
pause
goto menu

:restart
echo.
echo Restarting the app...
call "%~dp0stop.bat" >nul 2>&1
timeout /t 3 /nobreak >nul
goto start

:clear
echo.
echo ============================================
echo   Clear Vite cache and restart
echo ============================================
echo.
echo Stopping server...
call "%~dp0stop.bat" >nul 2>&1
echo Clearing Vite cache...
if exist "platform\ui\.vite" (
    rd /s /q "platform\ui\.vite" 2>nul
    echo [OK] Cleared .vite cache
)
if exist "platform\ui\node_modules\.vite" (
    rd /s /q "platform\ui\node_modules\.vite" 2>nul
    echo [OK] Cleared node_modules/.vite cache
)
echo.
echo Starting fresh...
goto start
endlocal
