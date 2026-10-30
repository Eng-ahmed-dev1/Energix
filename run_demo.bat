@echo off
title ENERGIX Platform Launcher
cd /d "%~dp0"

echo ============================================================
echo   ENERGIX INDUSTRIAL PLATFORM - LAUNCHER
echo ============================================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python and check 'Add Python to PATH'.
    echo.
    pause
    exit /b 1
)

echo [1/2] Starting Backend Server (Port 8000)...
start "Energix Server (Port 8000)" cmd /k "python server.py"

timeout /t 2 >nul

echo [2/2] Starting Telegram Bot...
start "Energix Telegram Bot" cmd /k "python telegram_bot.py"

timeout /t 2 >nul

echo.
echo ============================================================
echo   All systems started. Opening Dashboard...
echo   Dashboard:  http://localhost:8000/#inventory
echo   QR Page:    http://localhost:8000/demo.html
echo ============================================================
echo.

start http://localhost:8000/#inventory
start http://localhost:8000/demo.html

pause
