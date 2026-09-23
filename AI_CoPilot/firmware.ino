/*
 * Energix Firmware - Smart Warehouse Lighting System
 * Features: 20% Standby Mode, LDR Daylight Harvesting, Grok AI Serial Commands
 */

// تعريف المنافذ (Pinout)
const int PIR_PIN = 2;          // منفذ حساس الحركة PIR
const int LDR_PIN = A0;         // منفذ حساس ضوء النهار LDR
const int LED_PIN = 9;          // منفذ إضاءة LED (يجب أن يكون PWM)

// ثوابت شدة الإضاءة عبر PWM (0 - 255)
const int BRIGHT_100 = 255;     // وضع الحركة والنشاط الكامل
const int BRIGHT_20  = 51;      // وضع الاستعداد الآمن 20% (255 * 0.20)
const int BRIGHT_OFF = 0;       // إطفاء كامل (لحالات الصيانة)

// المتغيرات التشغيلية
int currentBrightness = BRIGHT_20;
unsigned long lastMotionTime = 0;
const unsigned long TIMEOUT_MS = 10000; // مهلة السكون (10 ثوانٍ للتجربة المعملية)
bool manualOverride = false;   // تفعيل تجاوز التحكم الآلي عند تلقي أمر من الذكاء الاصطناعي

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600); // بدء الاتصال التسلسلي مع سيرفر Grok
  
  // تشغيل الإضاءة مبدئياً على وضع الاستعداد 20%
  analogWrite(LED_PIN, currentBrightness);
  Serial.println("SYSTEM_READY");
}

void loop() {
  // 1. فحص الأوامر الواردة من الذكاء الاصطناعي Grok عبر السيريال
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    handleGrokCommand(command);
  }

  // 2. التحكم الآلي إذا لم يكن هناك تجاوز يدوي من المشرف
  if (!manualOverride) {
    int motion = digitalRead(PIR_PIN);
    int lightLevel = analogRead(LDR_PIN); // قراءة ضوء النهار الطبيعي

    if (motion == HIGH) {
      lastMotionTime = millis();
      // حصاد ضوء النهار: إذا كان ضوء الشمس قوياً نخفض الإضاءة الصناعية
      if (lightLevel > 600) {
        fadeTo(150); // إضاءة متوسطة تكفي مع ضوء النهار
      } else {
        fadeTo(BRIGHT_100); // إضاءة 100% كاملة
      }
    } else {
      // إذا انقضت المهلة دون حركة، العودة إلى 20% وضع الاستعداد
      if (millis() - lastMotionTime > TIMEOUT_MS) {
        fadeTo(BRIGHT_20);
      }
    }
  }

  // 3. إرسال البيانات الحية (Telemetry) لسيرفر بايثون كل ثانية بصيغة JSON
  static unsigned long lastTelemetryTime = 0;
  if (millis() - lastTelemetryTime >= 1000) {
    lastTelemetryTime = millis();
    int motion = digitalRead(PIR_PIN);
    int lightLevel = analogRead(LDR_PIN);
    int dimPct = (currentBrightness * 100) / 255;

    // إرسال JSON متوافق تماماً مع server.py
    Serial.print("{\"motion\":");
    Serial.print(motion);
    Serial.print(",\"lux\":");
    Serial.print(lightLevel);
    Serial.print(",\"dim\":");
    Serial.print(dimPct);
    Serial.println("}");
  }

  delay(50);
}

// دالة التعتيم الانسيابي (Smooth Fading) لحماية اللمبات
void fadeTo(int target) {
  if (currentBrightness < target) {
    for (int b = currentBrightness; b <= target; b += 5) {
      analogWrite(LED_PIN, b);
      delay(15);
    }
  } else if (currentBrightness > target) {
    for (int b = currentBrightness; b >= target; b -= 5) {
      analogWrite(LED_PIN, b);
      delay(15);
    }
  }
  currentBrightness = target;
}

// معالجة أوامر Grok الواردة
void handleGrokCommand(String cmd) {
  if (cmd == "LIGHT:1:100%") {
    manualOverride = true;
    fadeTo(BRIGHT_100);
    Serial.println("ACK:LIGHT_1_100");
  } else if (cmd == "LIGHT:1:20%") {
    manualOverride = true;
    fadeTo(BRIGHT_20);
    Serial.println("ACK:LIGHT_1_20");
  } else if (cmd == "LIGHT:1:OFF") {
    manualOverride = true;
    fadeTo(BRIGHT_OFF);
    Serial.println("ACK:LIGHT_1_OFF");
  } else if (cmd == "LIGHT:AUTO") {
    manualOverride = false; // إعادة التحكم الآلي للحساسات
    Serial.println("ACK:MODE_AUTO");
  }
}
