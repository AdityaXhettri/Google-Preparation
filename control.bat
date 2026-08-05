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
echo   [1] START the app
echo   [2] STOP the app
echo   [3] Open in browser
echo   [4] Check status
echo   [5] Exit
echo.
echo ============================================
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto browser
if "%choice%"=="4" goto status
if "%choice%"=="5" exit

echo Invalid choice. Try again.
timeout /t 2 >nul
goto menu

:start
echo.
echo Starting the app...
start "" "%~dp0start.bat"
timeout /t 3 >nul
start "" "http://localhost:5173"
echo.
echo App started! Browser opening...
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
