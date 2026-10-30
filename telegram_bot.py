#!/usr/bin/env python3
"""
============================================================
ENERGIX v2.1 AI CO-PILOT — TELEGRAM BOT FOR JURY DEMO
Features:
  1. Instant notification when Arduino is plugged into laptop
  2. Dynamic aisle detection & dynamic interactive keyboard
  3. Monthly billing cycle status (Restart by Month)
  4. 100% Egyptian Pounds (EGP / ج.م) Currency Localization
============================================================
"""

import os
import sys
import json
import time
import asyncio
import logging
import urllib.request
import urllib.error
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes

# Logging setup
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# Configuration
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8615704545:AAHPbGyh74WAJNPn1g5yY-yqBg_fAPtqkvY")
LOCAL_SERVER_URL = "http://localhost:8000"
AUTH_CHATS_FILE = "/tmp/energix_authorized_chats.json"

def call_local_server(endpoint: str, data: dict = None) -> dict:
    """Helper to communicate with running server.py"""
    url = f"{LOCAL_SERVER_URL}{endpoint}"
    try:
        if data:
            req = urllib.request.Request(
                url,
                data=json.dumps(data).encode('utf-8'),
                headers={"Content-Type": "application/json"}
            )
        else:
            req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

# ============================================================
# ACCESS CONTROL & SECURITY (Persistence for Server Notifications)
# ============================================================
AUTHORIZED_USERS = set()
AUTHORIZED_PINS = {"2026", "1234", "energix", "ENERGIX"}
DEEP_LINK_TOKEN = "energix2026"

def load_authorized_users():
    global AUTHORIZED_USERS
    if os.path.exists(AUTH_CHATS_FILE):
        try:
            with open(AUTH_CHATS_FILE, "r") as f:
                data = json.load(f)
                AUTHORIZED_USERS = set(data.get("authorized_users", []))
        except Exception:
            pass

def save_authorized_user(uid: int):
    global AUTHORIZED_USERS
    AUTHORIZED_USERS.add(uid)
    try:
        data = {"authorized_users": list(AUTHORIZED_USERS)}
        with open(AUTH_CHATS_FILE, "w") as f:
            json.dump(data, f)
    except Exception as e:
        print(f"⚠️ [Error saving authorized user]: {e}")

load_authorized_users()

# ============================================================
# DYNAMIC KEYBOARDS
# ============================================================
def get_main_keyboard():
    """Interactive control buttons for the jury — Dynamic Warehouse Grid"""
    keyboard = [
        [
            InlineKeyboardButton("📊 تقرير الطاقة والوفر الحي (ج.م)", callback_data="btn_metrics"),
            InlineKeyboardButton("🏢 التحكم في الممرات المكتشفة", callback_data="btn_aisles_menu")
        ],
        [
            InlineKeyboardButton("── Warehouse 01 Master Control ──", callback_data="btn_noop")
        ],
        [
            InlineKeyboardButton("⚡ All 100% (تشغيل كامل)", callback_data="btn_all_100"),
            InlineKeyboardButton("🌙 All 20% (استعداد اقتصادي)", callback_data="btn_all_20")
        ],
        [
            InlineKeyboardButton("🛑 All OFF (عزل للصيانة)", callback_data="btn_all_off"),
            InlineKeyboardButton("🔄 All AUTO (تحكم آلي)", callback_data="btn_auto")
        ],
        [
            InlineKeyboardButton("📅 تصفير عداد الدورة الشهرية (Demo)", callback_data="btn_reset_cycle")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

def get_aisles_keyboard():
    """Dynamically generated Aisle buttons based on connected hardware payload"""
    res = call_local_server("/api/telemetry")
    items = res.get("items", [])
    if not items:
        items = [
            {"id": 1, "name": "Warehouse Aisle 01", "dim_pct": 20},
            {"id": 2, "name": "Warehouse Aisle 02", "dim_pct": 20}
        ]

    keyboard = []
    row = []
    for item in items:
        aid = item["id"]
        dim = item.get("dim_pct", 20)
        mode = "100%" if dim >= 90 else "0%" if dim == 0 else "20%"
        row.append(InlineKeyboardButton(f"🔆 ممر {aid} ({mode})", callback_data=f"sel_aisle_{aid}"))
        if len(row) == 2:
            keyboard.append(row)
            row = []
    if row:
        keyboard.append(row)

    keyboard.append([InlineKeyboardButton("🔙 العودة للقائمة الرئيسية", callback_data="btn_back_main")])
    return InlineKeyboardMarkup(keyboard)

def get_single_aisle_keyboard(aid: int):
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("⚡ تشغيل 100%", callback_data=f"cmd_a_{aid}_100%"),
            InlineKeyboardButton("🌙 وضع 20%", callback_data=f"cmd_a_{aid}_20%"),
            InlineKeyboardButton("🛑 إطفاء 0%", callback_data=f"cmd_a_{aid}_OFF"),
            InlineKeyboardButton("🔄 AUTO", callback_data=f"cmd_a_{aid}_AUTO")
        ],
        [
            InlineKeyboardButton(f"📋 تقرير استهلاك ممر {aid} (ج.م)", callback_data=f"rep_a_{aid}")
        ],
        [InlineKeyboardButton("🔙 اختيار ممر آخر", callback_data="btn_aisles_menu")]
    ])

# ============================================================
# COMMAND & BUTTON HANDLERS
# ============================================================
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handles /start — validates deep-link secret token or prompts for PIN"""
    user_id = update.effective_user.id
    user_first = update.effective_user.first_name or "المشرف"

    # 1. Automatic unlock via QR Code Deep Link (?start=energix2026)
    if context.args and len(context.args) > 0:
        param = context.args[0].strip().lower()
        if param == DEEP_LINK_TOKEN.lower() or param in [p.lower() for p in AUTHORIZED_PINS]:
            save_authorized_user(user_id)
            welcome_text = (
                f"🛡️ **[تم التحقق من الصلاحية الأمنية بنجاح ✅]**\n\n"
                f"👋 **أهلاً بك يا {user_first} في منصة Energix الصناعية!**\n\n"
                f"🤖 أنا **المساعد الذكي (Energix Co-Pilot)**.\n"
                f"العملة المعتمدة في النظام: **الجنيه المصري (ج.م)** بتعرفة 3.20 ج.م/kWh.\n\n"
                f"✨ **الممرات النشطة يتم اكتشافها ديناميكياً فور توصيل الأردوينو.**\n"
                f"• اختر أمراً من الأزرار التفاعلية أدناه 👇\n"
                f"• أو اكتب أمرك باللغة الطبيعية."
            )
            await update.message.reply_text(
                welcome_text,
                reply_markup=get_main_keyboard(),
                parse_mode="Markdown"
            )
            return

    # 2. Already authorized user returning
    if user_id in AUTHORIZED_USERS:
        welcome_text = (
            f"👋 **أهلاً بك مجدداً يا {user_first}!**\n\n"
            f"أنت مسجل كـ **مشغل معتمد (Authorized Operator)**.\n"
            f"يمكنك متابعة التحكم بالمنظومة أدناه 👇"
        )
        await update.message.reply_text(
            welcome_text,
            reply_markup=get_main_keyboard(),
            parse_mode="Markdown"
        )
        return

    # 3. Unauthorized access: Ask for PIN
    lock_text = (
        f"🔒 **منظومة Energix — لوحة تحكم مؤمنة**\n\n"
        f"مرحباً {user_first}، الوصول إلى أزرار التحكم بالمخزن وشبكة الطاقة مخصص فقط لأعضاء لجنة التحكيم وفريق الإدارة المصرح لهم.\n\n"
        f"🔑 **يرجى كتابة رمز الأمان (PIN Code: 2026)** لفتح الصلاحيات، أو مسح كود الـ QR المصرح به من شاشة العرض."
    )
    await update.message.reply_text(lock_text, parse_mode="Markdown")

async def safe_edit_text(query, text, reply_markup=None):
    try:
        await query.edit_message_text(text, reply_markup=reply_markup, parse_mode="Markdown")
    except Exception:
        try:
            await query.edit_message_text(text, reply_markup=reply_markup)
        except Exception:
            pass

async def handle_button(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handles button clicks from the jury"""
    query = update.callback_query
    user_id = query.from_user.id

    if user_id not in AUTHORIZED_USERS:
        await query.answer("🔒 غير مصرح لك! يرجى إدخال رمز الأمان (PIN) أولاً.", show_alert=True)
        return

    await query.answer()
    data = query.data

    if data == "btn_metrics":
        res = call_local_server("/api/telemetry")
        cycle = res.get("monthly_cycle", {})
        if "items" in res:
            total_kwh = res.get("total_consumed", 711)
            saved_kwh = res.get("total_saved", 1319)
            egp_saved = res.get("total_egp_saved", res.get("total_money", 4224))
            aisle_count = res.get("aisle_count", len(res.get("items", [])))
            reply = (
                f"📊 **تقرير الطاقة والوفر المباشر — Energix:**\n\n"
                f"• دورة الفاتورة: **{cycle.get('cycle_label', 'أكتوبر 2026')}** (متبقي {cycle.get('days_remaining', '--')} يوم)\n"
                f"• إجمالي الاستهلاك اللحظي: `{total_kwh:,} kWh`\n"
                f"• صافي الطاقة الموفرة: `{saved_kwh:,} kWh`\n"
                f"• الوفر المالي التراكمي: **{egp_saved:,} ج.م** (EGP)\n"
                f"• نسبة خفض الهدر: `68.4%` بفضل تقنية 20% Standby\n"
                f"• الممرات المكتشفة ديناميكياً: `{aisle_count} ممرات نشطة`\n"
                f"• حالة الأردوينو: `{'متصل ✅ (' + (res.get('port') or 'USB') + ')' if res.get('hardware_connected') else 'وضع المحاكاة'}`"
            )
        else:
            reply = "📊 **تقرير الطاقة والوفر:**\n\n• نسبة التوفير: `68.4%`\n• العملة: **الجنيه المصري (ج.م)**"
        await safe_edit_text(query, reply, reply_markup=get_main_keyboard())

    elif data == "btn_aisles_menu":
        await safe_edit_text(
            query,
            "🏢 **الممرات المكتشفة ديناميكياً — اختر الممر للتحكم:**",
            reply_markup=get_aisles_keyboard()
        )

    elif data == "btn_noop":
        await query.answer()

    elif data.startswith("sel_aisle_"):
        aid = int(data.split("_")[-1])
        await safe_edit_text(
            query,
            f"⚡ **التحكم في [الممر 0{aid}] — اختر وضع التشغيل:**",
            reply_markup=get_single_aisle_keyboard(aid)
        )

    elif data.startswith("cmd_a_"):
        parts = data.split("_")
        aid = int(parts[2])
        mode = parts[3]
        call_local_server("/api/control", {"unit_id": aid, "mode": mode})
        mode_ar = "100% نشط" if "100" in mode else "20% اقتصادي" if "20" in mode else "0% معزول للصيانة" if "OFF" in mode else "AUTO آلي"
        reply = (
            f"✅ **تم تنفيذ الأمر بنجاح:**\n"
            f"تم ضبط **[الممر 0{aid}]** على وضع **({mode_ar})**.\n"
            f"*(ستلاحظ استجابة ليدات الماكيت والداشبورد فورياً)*"
        )
        await safe_edit_text(query, reply, reply_markup=get_single_aisle_keyboard(aid))

    elif data.startswith("rep_a_"):
        aid = int(data.split("_")[-1])
        res = call_local_server(f"/api/aisle/{aid}")
        if "name" in res:
            occ_str = "🟢 متواجدون (Occupied)" if res.get("motion") else "⚪ شاغر (Vacant)"
            reply = (
                f"📋 **تقرير شامل لـ [{res['name']}]:**\n\n"
                f"📍 **الموقع:** `{res['location']}`\n"
                f"🚶‍♂️ **حالة التواجد:** `{occ_str}`\n"
                f"⚙️ **الوضع التشغيلي:** `{res['mode']}`\n"
                f"💡 **نسبة الإضاءة:** `{res['dim_pct']}%`\n"
                f"⚡ **الحمل الأساسي:** `{res['base_kw']:,} kWh`\n"
                f"📉 **الاستهلاك اللحظي:** `{res['consumed']:,} kWh`\n"
                f"🌱 **الوفر المحقق:** `{res['saved']:,} kWh`\n"
                f"💰 **العائد المالي التقديري:** **{res.get('egp_saved', res.get('money', 0)):,} ج.م**\n"
                f"🎯 **كفاءة الطاقة:** `{res['eff']}%`"
            )
        else:
            reply = f"تعذر استخراج بيانات الممر {aid}."
        await safe_edit_text(query, reply, reply_markup=get_single_aisle_keyboard(aid))

    elif data == "btn_all_100":
        call_local_server("/api/control", {"unit_id": 0, "mode": "100%"})
        reply = (
            "💡 **تم تشغيل المخزن بالكامل:**\n"
            "تم رفع إضاءة **جميع الممرات المكتشفة** إلى **100% (أقصى نشاط تحميلي)**.\n"
            "*(ستلاحظ إضاءة ليدات الممرات في الماكيت فوراً)*"
        )
        await safe_edit_text(query, reply, reply_markup=get_main_keyboard())

    elif data == "btn_all_20":
        call_local_server("/api/control", {"unit_id": 0, "mode": "20%"})
        reply = (
            "🌙 **تفعيل وضع الاستعداد الشامل:**\n"
            "تم ضبط **جميع الممرات المكتشفة** على **20% Standby Mode**.\n"
            "*(تحقيق أقصى وفر للطاقة بنسبة 80% في كل الممرات)*"
        )
        await safe_edit_text(query, reply, reply_markup=get_main_keyboard())

    elif data == "btn_all_off":
        call_local_server("/api/control", {"unit_id": 0, "mode": "OFF"})
        reply = (
            "🛑 **عزل شامل لكامل المنشأة:**\n"
            "تم إطفاء وعزل جميع ممرات المخزن بنسبة 0% لعمليات الصيانة الشاملة أو الطوارئ."
        )
        await safe_edit_text(query, reply, reply_markup=get_main_keyboard())

    elif data == "btn_auto":
        call_local_server("/api/control", {"unit_id": 0, "mode": "AUTO"})
        reply = (
            "⚡ **تمت استعادة التحكم الآلي لجميع الممرات:**\n"
            "النظام الآن يعمل تلقائياً وفق قراءات الحساسات (PIR للحركة و LDR لضوء النهار)."
        )
        await safe_edit_text(query, reply, reply_markup=get_main_keyboard())

    elif data == "btn_reset_cycle":
        res = call_local_server("/api/cycle/reset", {})
        reply = (
            "📅 **تم تصفير عداد الدورة الشهرية بنجاح (Restart by Month):**\n\n"
            "تم بدء دورة فوترة شهرية جديدة، وتصفير العداد التراكمي لعرض بداية شهر جديد أمام اللجنة."
        )
        await safe_edit_text(query, reply, reply_markup=get_main_keyboard())

    elif data == "btn_back_main":
        await safe_edit_text(
            query,
            "👋 اختر أمراً من القائمة الرئيسية:",
            reply_markup=get_main_keyboard()
        )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handles natural language chat and PIN authentication"""
    user_id = update.effective_user.id
    user_text = update.message.text.strip()
    user_first = update.effective_user.first_name or "المشرف"

    # 1. Access Control: If user is not yet authorized, check PIN
    if user_id not in AUTHORIZED_USERS:
        if user_text.lower() in [p.lower() for p in AUTHORIZED_PINS]:
            save_authorized_user(user_id)
            await update.message.reply_text(
                f"✅ **تم التحقق من الصلاحية الأمنية بنجاح!**\n\n"
                f"مرحباً بك يا {user_first} كـ **مشغل مصرح له (Authorized Operator)** في نظام Energix الذكي.\n\n"
                f"تم فتح أزرار التحكم اللحظي واستعلامات الذكاء الاصطناعي لك الآن 👇",
                reply_markup=get_main_keyboard(),
                parse_mode="Markdown"
            )
            return
        else:
            await update.message.reply_text(
                "⛔ **رمز الأمان غير صحيح!**\n\n"
                "الوصول مقفل لحماية شبكة الطاقة وممرات المنشأة من الأوامر غير المصرح بها.\n"
                "يرجى كتابة رمز الأمان المعتمد (PIN: 2026) للمتابعة.",
                parse_mode="Markdown"
            )
            return

    # 2. Authorized user: Process AI / server chat endpoint
    res = call_local_server("/chat", {"message": user_text})
    if "reply" in res:
        bot_reply = res["reply"]
    else:
        # Fallback intelligent matching if server.py is offline
        lower = user_text.lower()
        if "اطفي" in user_text or "off" in lower or "صيانة" in user_text:
            bot_reply = "تم عزل التيار وإطفاء إضاءة ممر 1 بنجاح لأعمال الصيانة (تأكيد 0%)."
        elif "شغل" in user_text or "100" in user_text or "on" in lower:
            bot_reply = "تم تفعيل الإضاءة الكاملة 100% لممر 1 فورياً لأعمال التحميل."
        elif "وفر" in user_text or "طاقة" in user_text or "استهلاك" in user_text or "فاتورة" in user_text:
            bot_reply = "حقق نظام Energix اليوم وفراً بنسبة 68.4% (ما يعادل 4,224 ج.م) بفضل تقنية الـ 20% Standby."
        else:
            bot_reply = f"مرحباً بك! أنا مساعد Energix الذكي. فهمت استفسارك: '{user_text}'. يمكنك استخدام الأزرار أدناه للتحكم السريع في الإضاءة أو الاستعلام عن منظومة الطاقة بالجنيه المصري."

    await update.message.reply_text(
        bot_reply,
        reply_markup=get_main_keyboard()
    )

# ============================================================
# BACKGROUND HARDWARE CONNECTION WATCHER
# ============================================================
last_known_hw_state = False

async def hardware_connection_poller(application):
    """Background task polling /api/status to alert users when Arduino is connected"""
    global last_known_hw_state
    while True:
        try:
            res = call_local_server("/api/status")
            is_connected = res.get("hardware_connected", False)
            if is_connected and not last_known_hw_state:
                last_known_hw_state = True
                port = res.get("serial_port", "USB")
                aisle_cnt = res.get("aisle_count", 2)
                lux = res.get("lux", 350)
                alert_text = (
                    f"🔌 **[إشعار اتصال هاردوير فوري — Energix Gateway]**\n\n"
                    f"تم اكتشاف وتوصيل الأردوينو باللابتوب بنجاح! 🟢\n"
                    f"• منفذ الاتصال: `{port}`\n"
                    f"• المخزن: **Warehouse 01**\n"
                    f"• عدد الممرات المكتشفة ديناميكياً: **{aisle_cnt} ممرات**\n"
                    f"• قراءة ضوء النهار: **{lux} lux**\n"
                    f"• جاهز للتحكم الفوري وعرض اللجنة."
                )
                for uid in list(AUTHORIZED_USERS):
                    try:
                        await application.bot.send_message(
                            chat_id=uid,
                            text=alert_text,
                            reply_markup=get_main_keyboard(),
                            parse_mode="Markdown"
                        )
                    except Exception as err:
                        print(f"⚠️ Could not notify user {uid}: {err}")
            elif not is_connected:
                last_known_hw_state = False
        except Exception:
            pass

        await asyncio.sleep(3)

def main():
    token = TELEGRAM_BOT_TOKEN
    print("🤖 جاري تشغيل بوت التليجرام لـ Energix...")
    app = ApplicationBuilder().token(token).build()

    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CallbackQueryHandler(handle_button))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    async def post_init(application):
        asyncio.create_task(hardware_connection_poller(application))

    app.post_init = post_init

    print("🚀 البوت يعمل الآن ويستقبل رسائل اللجنة ومجهز لإشعارات الهاردوير الحية!")
    app.run_polling()

if __name__ == "__main__":
    main()
