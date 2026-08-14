@echo off
title Open Browser in Edge
color 0E
echo.
echo ============================================
echo   Open Browser in Edge
echo ============================================
echo.
echo Opening http://localhost:5173 in Edge...
echo.

:: Try Edge (x86) first
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "http://localhost:5173"
    echo [OK] Opened in Edge
    goto :end
)

:: Try Edge (64-bit)
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" "http://localhost:5173"
    echo [OK] Opened in Edge
    goto :end
)

:: Try Edge from PATH
where msedge >nul 2>&1
if not errorlevel 1 (
    start "" "msedge.exe" "http://localhost:5173"
    echo [OK] Opened in Edge
    goto :end
)

:: Fall back to default (will open Edge if it's the default)
start "" "http://localhost:5173"
echo [OK] Opened (default browser)

:end
echo.
echo If browser did not open, copy this URL into Edge:
echo.
echo   http://localhost:5173
echo.
timeout /t 4 /nobreak >nul
exit
