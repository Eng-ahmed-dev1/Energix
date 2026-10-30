@echo off
chcp 65001 >nul
title ENERGIX Platform Launcher - Windows

echo ============================================================
echo   ⚡ ENERGIX INDUSTRIAL PLATFORM - WINDOWS LAUNCHER ⚡
echo ============================================================
echo.

echo [1/3] Checking dependencies...
python -m pip install -r requirements.txt >nul 2>&1

echo [2/3] Starting Energix IoT ^& Grok AI Backend Server...
start "Energix Server (Port 8000)" cmd /k "python server.py"

timeout /t 2 >nul

echo [3/3] Starting Telegram AI Bot (@Energix_Co_Pilot_Bot)...
start "Energix Telegram Bot" cmd /k "python telegram_bot.py"

timeout /t 2 >nul

echo.
echo ============================================================
echo  🎉 All Systems Online! Opening Dashboard...
echo  👉 Web Dashboard:    http://localhost:8000
echo  👉 Committee QR:     http://localhost:8000/demo.html
echo  👉 Telegram Bot:     https://t.me/Energix_Co_Pilot_Bot
echo ============================================================
echo.

start http://localhost:8000/#inventory
start http://localhost:8000/demo.html

pause
