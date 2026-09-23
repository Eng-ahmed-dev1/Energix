#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "⚡ [1/3] تنظيف أي عمليات سابقة..."
pkill -9 -f "server.py" 2>/dev/null
pkill -9 -f "telegram_bot.py" 2>/dev/null
sleep 1

echo "🌐 [2/3] جاري تشغيل سيرفر الويب والـ IoT (Port 8000)..."
nohup python3 "$DIR/server.py" > /tmp/energix_server.log 2>&1 &
disown
sleep 2

echo "🤖 [3/3] جاري تشغيل بوت التليجرام (@Energix_Co_Pilot_Bot)..."
nohup python3 "$DIR/telegram_bot.py" > /tmp/energix_bot.log 2>&1 &
disown
sleep 2

echo ""
echo "============================================================"
echo "🎉 المنظومة كلها تعمل الآن بنجاح وجاهزة لعرض اللجنة!"
echo "👉 رابط الداشبورد:       http://localhost:8000"
echo "👉 صفحة الـ QR للجنة:   http://localhost:8000/demo.html"
echo "👉 بوت التليجرام:        https://t.me/Energix_Co_Pilot_Bot"
echo "============================================================"
