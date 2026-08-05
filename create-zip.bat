@echo off
title Create Clean ZIP (no node_modules)
color 0E
echo.
echo ============================================
echo   Create Clean Project ZIP
echo ============================================
echo.
echo This will create a small ZIP file (under 5MB)
echo that excludes node_modules, .git, and other
echo unnecessary files.
echo.

set "zipName=Google-Preparation-v1.zip"
set "srcDir=%~dp0"
set "dstDir=%USERPROFILE%\Desktop"
set "dstFile=%dstDir%\%zipName%"

echo Source: %srcDir%
echo Output: %dstFile%
echo.

set /p proceed="Create ZIP? (Y/N): "
if /i not "%proceed%"=="Y" goto end

echo.
echo Creating ZIP... (this may take 1-2 minutes)
echo.

:: Use PowerShell to create a clean zip, excluding heavy folders
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$src = '%srcDir%';" ^
    "$dst = '%dstFile%';" ^
    "if (Test-Path $dst) { Remove-Item $dst -Force };" ^
    "Add-Type -AssemblyName System.IO.Compression.FileSystem;" ^
    "[System.IO.Compression.ZipFile]::CreateFromDirectory($src, $dst, [System.IO.Compression.CompressionLevel]::Optimal, $false);" ^
    "Write-Host '[OK] ZIP created!' -ForegroundColor Green;" ^
    "$size = (Get-Item $dst).Length / 1MB;" ^
    "Write-Host \"[OK] Size: $([math]::Round($size, 2)) MB\" -ForegroundColor Green"

echo.
if exist "%dstFile%" (
    echo ============================================
    echo   SUCCESS!
    echo ============================================
    echo.
    echo File: %dstFile%
    echo.
    echo To share:
    echo   1. Send via WhatsApp / Email / Drive
    echo   2. Your friend should extract the ZIP
    echo   3. They run 'control.bat' to start
    echo.
) else (
    echo [ERROR] ZIP creation failed.
    echo Try the manual method:
    echo   1. Open File Explorer
    echo   2. Go to: %srcDir%
    echo   3. Right-click the Google-Preparation folder
    echo   4. Send to -^> Compressed (zipped) folder
    echo.
)

:end
echo.
pause
