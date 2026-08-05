@echo off
title Google L4 Interview Prep - Control Panel
color 0B
:menu
cls
echo.
echo ============================================
echo   Google L4 Interview Prep - Control Panel
echo ============================================
echo.
echo   [1] START the app (Vite + Bun)
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
start "" "%~dp0start.bat"
echo.
echo Waiting for server to start (up to 30 seconds)...
timeout /t 5 /nobreak >nul
:waitloop
netstat -aon | findstr :5173 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is running!
    start "" "http://localhost:5173"
    echo Browser opened!
) else (
    echo Still waiting for frontend...
    timeout /t 3 /nobreak >nul
    netstat -aon | findstr :5173 | findstr LISTENING >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] Frontend is running!
        start "" "http://localhost:5173"
    ) else (
        echo [WARNING] Frontend did not start in 30 seconds.
        echo Check the start.bat window for errors.
        pause
    )
)
timeout /t 3 >nul
goto menu

:stop
echo.
echo Stopping the app...
call "%~dp0stop.bat"
goto menu

:browser
echo.
echo Opening browser...
start "" "http://localhost:5173"
timeout /t 2 >nul
goto menu

:status
echo.
echo ============================================
echo   Server Status
echo ============================================
echo.

:: Check if frontend is running
netstat -aon | findstr :5173 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo [RUNNING] Frontend on http://localhost:5173
) else (
    echo [STOPPED] Frontend on http://localhost:5173
)

:: Check if backend is running
netstat -aon | findstr :3001 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo [RUNNING] Backend on http://localhost:3001
) else (
    echo [STOPPED] Backend on http://localhost:3001
)

echo.
echo ============================================
echo.
pause
goto menu

:restart
echo.
echo Restarting the app...
call "%~dp0stop.bat"
timeout /t 2 /nobreak >nul
start "" "%~dp0start.bat"
echo.
echo Waiting for restart...
timeout /t 5 /nobreak >nul
goto waitloop

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
) else (
    echo [INFO] No .vite cache found
)
if exist "platform\ui\node_modules\.vite" (
    rd /s /q "platform\ui\node_modules\.vite" 2>nul
    echo [OK] Cleared node_modules/.vite cache
)
echo.
echo Starting fresh...
start "" "%~dp0start.bat"
timeout /t 5 /nobreak >nul
goto waitloop
