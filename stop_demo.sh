#!/usr/bin/env bash
echo "🛑 جاري إيقاف سيرفر الويب وبوت التليجرام..."
pkill -f "python3 server.py" 2>/dev/null
pkill -f "python3 telegram_bot.py" 2>/dev/null
echo "✅ تم إيقاف جميع العمليات بنجاح وبأمان."
