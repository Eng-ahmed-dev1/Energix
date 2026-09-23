import os
import json
import serial
import serial.tools.list_ports
from openai import OpenAI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Energix Grok Co-Pilot API")

# السماح للواجهة بالاتصال بالسيرفر
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. إعداد الاتصال مع xAI Grok API
XAI_API_KEY = os.getenv("XAI_API_KEY", "your_xai_api_key_here")

client = OpenAI(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai/v1"
)

# 2. إعداد الاتصال التسلسلي بالأردوينو
arduino = None
for port in serial.tools.list_ports.comports():
    if "USB" in port.description or "ACM" in port.description or "Arduino" in port.description:
        try:
            arduino = serial.Serial(port.device, 9600, timeout=1)
            print(f"✅ تم الاتصال بالأردوينو على المنفذ: {port.device}")
            break
        except Exception:
            pass

if not arduino:
    print("⚠️ تنبيه: لم يتم اكتشاف الأردوينو تلقائياً، يعمل السيرفر بوضع المحاكاة (Simulation Mode).")

# 3. الدوال البرمجية المتاحة لـ Grok (Tools)
def control_aisle_light(aisle_id: int, mode: str):
    """التحكم في إضاءة ممر معين: 100%, 20%, OFF, أو AUTO"""
    command = f"LIGHT:{aisle_id}:{mode}\n"
    if arduino and arduino.is_open:
        arduino.write(command.encode())
    return f"تم تعديل إضاءة الممر {aisle_id} إلى الوضع {mode} بنجاح."

def get_energy_metrics():
    """استرجاع إحصائيات الطاقة والوفر المالي المحقق لهذا الأسبوع"""
    return json.dumps({
        "total_consumed_kwh": 353,
        "total_saved_kwh": 59,
        "money_saved_usd": 12,
        "efficiency_rate": "68%",
        "active_units": 12,
        "highest_consuming_unit": "ممر 2 (بحاجة لمعايرة مهلة السكون)"
    }, ensure_ascii=False)

tools_schema = [
    {
        "type": "function",
        "function": {
            "name": "control_aisle_light",
            "description": "التحكم في إضاءة ممر معين في المخزن وتحديد مستوى السطوع أو إطفائه للصيانة أو إعادته للوضع التلقائي",
            "parameters": {
                "type": "object",
                "properties": {
                    "aisle_id": {"type": "integer", "description": "رقم الممر (مثلاً 1 أو 2)"},
                    "mode": {"type": "string", "enum": ["100%", "20%", "OFF", "AUTO"], "description": "الوضع المطلوب"}
                },
                "required": ["aisle_id", "mode"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_energy_metrics",
            "description": "استرجاع تقرير استهلاك وتوفير الطاقة، ونسبة الكفاءة، وأكثر المناطق هدراً",
            "parameters": {"type": "object", "properties": {}}
        }
    }
]

conversation_history = [
    {
        "role": "system",
        "content": (
            "أنت 'Energix Co-Pilot'، المساعد الذكي لإدارة طاقة المخازن والمستودعات مدعوم بنموذج Grok من xAI. "
            "أنت تتحدث باللغة العربية بأسلوب احترافي وودود وموجز. "
            "يمكنك استدعاء الأدوات للتحكم في إضاءة الممرات وقراءة تقارير التوفير المالي والكهربائي."
        )
    }
]

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat_with_grok(req: ChatRequest):
    conversation_history.append({"role": "user", "content": req.message})

    try:
        response = client.chat.completions.create(
            model="grok-beta",
            messages=conversation_history,
            tools=tools_schema,
            tool_choice="auto"
        )
        msg = response.choices[0].message

        if msg.tool_calls:
            conversation_history.append(msg)
            for tool in msg.tool_calls:
                fn_name = tool.function.name
                args = json.loads(tool.function.arguments)

                if fn_name == "control_aisle_light":
                    result = control_aisle_light(args["aisle_id"], args["mode"])
                elif fn_name == "get_energy_metrics":
                    result = get_energy_metrics()
                else:
                    result = "دالة غير معروفة"

                conversation_history.append({
                    "role": "tool",
                    "tool_call_id": tool.id,
                    "content": result
                })

            second_resp = client.chat.completions.create(
                model="grok-beta",
                messages=conversation_history
            )
            final_reply = second_resp.choices[0].message.content
        else:
            final_reply = msg.content

        conversation_history.append({"role": "assistant", "content": final_reply})
        return {"reply": final_reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 سيرفر Energix Grok Co-Pilot يعمل الآن على: http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
