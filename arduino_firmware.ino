/*
 * ============================================================
 * Energix Firmware v2.1 — Dynamic Multi-Aisle Smart Warehouse
 * Hardware: Arduino Uno / Nano (Controls Prototype Aisles)
 * Features: Dynamic Aisle Auto-Discovery, 20% Standby, 100% Active,
 *           LDR Daylight Harvesting, Smooth PWM Fading,
 *           Dynamic JSON Telemetry, Targeted & All-Aisle Serial Commands
 * ============================================================
 */

// ============================================================
// SYSTEM IDENTIFIERS (Dynamic Metadata)
// ============================================================
const int WAREHOUSE_ID = 1;
const int AISLE_COUNT  = 2; // عدد الممرات المدارة بهذا الأردوينو

// ============================================================
// AISLE 1 PINOUT
// ============================================================
const int PIR1_PIN = 2;    // حساس حركة الممر الأول
const int LED1_PIN = 9;    // إضاءة الممر الأول (PWM)

// ============================================================
// AISLE 2 PINOUT
// ============================================================
const int PIR2_PIN = 3;    // حساس حركة الممر الثاني
const int LED2_PIN = 10;   // إضاءة الممر الثاني (PWM)

// ============================================================
// SHARED SENSORS — سقف المخزن
// ============================================================
const int LDR_PIN  = A0;   // حساس ضوء النهار (Daylight Harvesting)

// ============================================================
// BRIGHTNESS PWM CONSTANTS (0 - 255)
// ============================================================
const int BRIGHT_100 = 255;   // 100% وضع الحركة والتحميل الكامل
const int BRIGHT_20  = 51;    // 20% وضع الاستعداد الآمن الاقتصادي
const int BRIGHT_OFF = 0;     // 0% إطفاء وعزل تام للصيانة

// ============================================================
// TIMEOUT — مهلة السكون قبل خفض الإضاءة
// ============================================================
const unsigned long TIMEOUT_MS = 10000; // 10 ثوانٍ للتجربة المعملية

// ============================================================
// OPERATIONAL STATE
// ============================================================
int  brightness1     = BRIGHT_20;
bool manualOverride1 = false;
unsigned long lastMotion1 = 0;

int  brightness2     = BRIGHT_20;
bool manualOverride2 = false;
unsigned long lastMotion2 = 0;

// ============================================================
// SETUP
// ============================================================
void setup() {
  pinMode(PIR1_PIN, INPUT);
  pinMode(PIR2_PIN, INPUT);
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);

  // تشغيل الممرين مبدئياً على وضع الاستعداد الاقتصادي 20%
  analogWrite(LED1_PIN, brightness1);
  analogWrite(LED2_PIN, brightness2);

  Serial.begin(9600);

  // إرسال إشارة المصافحة الديناميكية ليعرف السيرفر عدد الممرات تلقائياً
  Serial.print("SYSTEM_READY:WAREHOUSE:");
  Serial.print(WAREHOUSE_ID);
  Serial.print(":AISLES:");
  Serial.println(AISLE_COUNT);
}

// ============================================================
// MAIN LOOP
// ============================================================
void loop() {
  // 1. استقبال أوامر التحكم من السيرفر أو الذكاء الاصطناعي
  if (Serial.available() > 0) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    handleCommand(cmd);
  }

  // 2. قراءة شدة ضوء النهار الطبيعي
  int lux = analogRead(LDR_PIN);

  // 3. التحكم الآلي — الممر الأول
  if (!manualOverride1) {
    int m1 = digitalRead(PIR1_PIN);
    if (m1 == HIGH) {
      lastMotion1 = millis();
      // حصاد ضوء النهار: إذا كان نور الشمس كافياً نكتفي بـ 60% (150 PWM)
      int target1 = (lux > 600) ? 150 : BRIGHT_100;
      fadeTo(LED1_PIN, brightness1, target1);
      brightness1 = target1;
    } else {
      if (millis() - lastMotion1 > TIMEOUT_MS) {
        fadeTo(LED1_PIN, brightness1, BRIGHT_20);
        brightness1 = BRIGHT_20;
      }
    }
  }

  // 4. التحكم الآلي — الممر الثاني
  if (!manualOverride2) {
    int m2 = digitalRead(PIR2_PIN);
    if (m2 == HIGH) {
      lastMotion2 = millis();
      int target2 = (lux > 600) ? 150 : BRIGHT_100;
      fadeTo(LED2_PIN, brightness2, target2);
      brightness2 = target2;
    } else {
      if (millis() - lastMotion2 > TIMEOUT_MS) {
        fadeTo(LED2_PIN, brightness2, BRIGHT_20);
        brightness2 = BRIGHT_20;
      }
    }
  }

  // 5. إرسال البيانات الحية المتوافقة ديناميكياً كل ثانية
  static unsigned long lastTelemetry = 0;
  if (millis() - lastTelemetry >= 1000) {
    lastTelemetry = millis();

    int m1 = digitalRead(PIR1_PIN);
    int m2 = digitalRead(PIR2_PIN);
    int d1 = (brightness1 * 100) / 255;
    int d2 = (brightness2 * 100) / 255;

    // صيغة JSON ديناميكية:
    // {"warehouse":1,"aisle_count":2,"aisles":[{"id":1,"motion":1,"dim":100},{"id":2,"motion":0,"dim":20}],"lux":420}
    Serial.print("{\"warehouse\":");
    Serial.print(WAREHOUSE_ID);
    Serial.print(",\"aisle_count\":");
    Serial.print(AISLE_COUNT);
    Serial.print(",\"aisles\":[");
    Serial.print("{\"id\":1,\"motion\":");
    Serial.print(m1);
    Serial.print(",\"dim\":");
    Serial.print(d1);
    Serial.print("},{\"id\":2,\"motion\":");
    Serial.print(m2);
    Serial.print(",\"dim\":");
    Serial.print(d2);
    Serial.print("}],\"lux\":");
    Serial.print(lux);
    Serial.println("}");
  }

  delay(50);
}

// ============================================================
// دالة التعتيم الانسيابي (Smooth PWM Fading)
// ============================================================
void fadeTo(int pin, int from, int to) {
  if (from == to) return;
  if (from < to) {
    for (int b = from; b <= to; b += 5) {
      analogWrite(pin, b);
      delay(12);
    }
  } else {
    for (int b = from; b >= to; b -= 5) {
      analogWrite(pin, b);
      delay(12);
    }
  }
  analogWrite(pin, to);
}

// ============================================================
// معالجة الأوامر الواردة
// ============================================================
void handleCommand(String cmd) {
  // ممر 1
  if (cmd == "LIGHT:1:100%") {
    manualOverride1 = true;
    fadeTo(LED1_PIN, brightness1, BRIGHT_100);
    brightness1 = BRIGHT_100;
    Serial.println("ACK:LIGHT_1_100");
  } else if (cmd == "LIGHT:1:20%") {
    manualOverride1 = true;
    fadeTo(LED1_PIN, brightness1, BRIGHT_20);
    brightness1 = BRIGHT_20;
    Serial.println("ACK:LIGHT_1_20");
  } else if (cmd == "LIGHT:1:OFF") {
    manualOverride1 = true;
    fadeTo(LED1_PIN, brightness1, BRIGHT_OFF);
    brightness1 = BRIGHT_OFF;
    Serial.println("ACK:LIGHT_1_OFF");
  } else if (cmd == "LIGHT:1:AUTO") {
    manualOverride1 = false;
    Serial.println("ACK:LIGHT_1_AUTO");

  // ممر 2
  } else if (cmd == "LIGHT:2:100%") {
    manualOverride2 = true;
    fadeTo(LED2_PIN, brightness2, BRIGHT_100);
    brightness2 = BRIGHT_100;
    Serial.println("ACK:LIGHT_2_100");
  } else if (cmd == "LIGHT:2:20%") {
    manualOverride2 = true;
    fadeTo(LED2_PIN, brightness2, BRIGHT_20);
    brightness2 = BRIGHT_20;
    Serial.println("ACK:LIGHT_2_20");
  } else if (cmd == "LIGHT:2:OFF") {
    manualOverride2 = true;
    fadeTo(LED2_PIN, brightness2, BRIGHT_OFF);
    brightness2 = BRIGHT_OFF;
    Serial.println("ACK:LIGHT_2_OFF");
  } else if (cmd == "LIGHT:2:AUTO") {
    manualOverride2 = false;
    Serial.println("ACK:LIGHT_2_AUTO");

  // كل الممرات معاً (ALL)
  } else if (cmd == "LIGHT:ALL:100%") {
    manualOverride1 = true; manualOverride2 = true;
    fadeTo(LED1_PIN, brightness1, BRIGHT_100); brightness1 = BRIGHT_100;
    fadeTo(LED2_PIN, brightness2, BRIGHT_100); brightness2 = BRIGHT_100;
    Serial.println("ACK:LIGHT_ALL_100");
  } else if (cmd == "LIGHT:ALL:20%") {
    manualOverride1 = true; manualOverride2 = true;
    fadeTo(LED1_PIN, brightness1, BRIGHT_20); brightness1 = BRIGHT_20;
    fadeTo(LED2_PIN, brightness2, BRIGHT_20); brightness2 = BRIGHT_20;
    Serial.println("ACK:LIGHT_ALL_20");
  } else if (cmd == "LIGHT:ALL:OFF") {
    manualOverride1 = true; manualOverride2 = true;
    fadeTo(LED1_PIN, brightness1, BRIGHT_OFF); brightness1 = BRIGHT_OFF;
    fadeTo(LED2_PIN, brightness2, BRIGHT_OFF); brightness2 = BRIGHT_OFF;
    Serial.println("ACK:LIGHT_ALL_OFF");
  } else if (cmd == "LIGHT:ALL:AUTO") {
    manualOverride1 = false; manualOverride2 = false;
    Serial.println("ACK:LIGHT_ALL_AUTO");
  }
}
