@echo off
chcp 65001 >nul
title ENERGIX Platform Launcher - Windows

echo ============================================================
echo   ⚡ ENERGIX INDUSTRIAL PLATFORM - WINDOWS LAUNCHER ⚡
echo ============================================================
echo.

:: 1. التحقق من وجود بايثون
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] خطأ: بايثون غير مثبت على هذا الجهاز أو لم يتم تفعيل خيار Add to PATH!
    echo يرجى تثبيت Python وتفعيل "Add Python to PATH" ثم إعادة المحاولة.
    echo.
    pause
    exit /b
)

:: 2. تثبيت وتحديث جميع المكتبات من requirements.txt مع إظهار التفاصيل
echo [1/3] جاري فحص وتثبيت كافة المكتبات المطلوبة من requirements.txt...
echo ------------------------------------------------------------
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
echo ------------------------------------------------------------
echo [✓] تم التأكد من تثبيت جميع المكاتب بنجاح!
echo.

:: 3. تشغيل السيرفر
echo [2/3] جاري تشغيل سيرفر الويب والذكاء الاصطناعي (Port 8000)...
start "Energix Server (Port 8000)" cmd /k "python server.py"

timeout /t 2 >nul

:: 4. تشغيل بوت التليجرام
echo [3/3] جاري تشغيل بوت التليجرام (@Energix_Co_Pilot_Bot)...
start "Energix Telegram Bot" cmd /k "python telegram_bot.py"

timeout /t 2 >nul

echo.
echo ============================================================
echo  🎉 تم تشغيل المنظومة بنجاح! جاري فتح الداشبورد في المتصفح...
echo  👉 Web Dashboard:    http://localhost:8000/#inventory
echo  👉 Committee QR:     http://localhost:8000/demo.html
echo  👉 Telegram Bot:     https://t.me/Energix_Co_Pilot_Bot
echo ============================================================
echo.

start http://localhost:8000/#inventory
start http://localhost:8000/demo.html

pause
