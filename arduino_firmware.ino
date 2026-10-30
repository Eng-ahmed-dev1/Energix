// ===== البنات =====
const int corridors = 2;
int pirPins[corridors] = {A0, A1};
int pwmPins[corridors] = {3, 9};   // ممر 1: أول 4 ليدات (موسفت) | ممر 2: كله
int ldrPins[corridors] = {A2, A3};
const int tailPin = 5;             // ممر 1: الـ 4 التانيين (ترانزستور)
const int trigPin = 7;
const int echoPin = 8;
int buttonPin = 2;
int buzzerPin = 4;

// ===== الإعدادات =====
const int levels[] = {255, 178, 115, 51};
const int levelCount = 4;
const int inactiveBrightness = 0;
const int daylightBrightness = 0;
const int ecoMax = 51;             // 20% من 255

const int dayOn = 800;
const int dayOff = 700;
const bool debug = false;          // false لضمان إرسال JSON نقي للسيرفر
const bool debugHand = false;

// فلترة الحركة (للتكييف)
const unsigned long pirConfirmMs = 300;

// إشارة الإيد
const int handMaxCm = 30;
const int handTolerance = 3;
const unsigned long handHold = 5000;
const unsigned long usInterval = 80;

const unsigned long holdTime = 8000;
const unsigned long levelTime = 3000;
const unsigned long fadeSlow = 20;
const unsigned long fadeFast = 1;
const unsigned long fadeEco = 30;
const unsigned long graceTime = 4000;

// ===== المتغيرات =====
int mode = 0;
bool lastButtonState = HIGH;
unsigned long lastButtonTime = 0;
unsigned long ignoreUntil = 0;
unsigned long lastPrint = 0;
unsigned long lastApiTelemetry = 0;

int levelIndex[corridors] = {3, 3};
int current[corridors] = {0, 0};
int target[corridors] = {0, 0};
bool isDay[corridors] = {false, false};

unsigned long lastMotion[corridors] = {0, 0};
unsigned long lastLevelChange[corridors] = {0, 0};
unsigned long lastFade[corridors] = {0, 0};
unsigned long pirFirstHigh[corridors] = {0, 0};

int naturalTarget0 = 0;
int tailCurrent = 0;
int tailTarget = 0;
unsigned long tailLastFade = 0;

bool economy = false;
bool handActive = false;
bool handLatched = false;
int handRef = 0;
unsigned long handStart = 0;
unsigned long lastUs = 0;

// ===== دوال الـ Buzzer =====
void beep(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(buzzerPin, HIGH);
    delay(150);
    digitalWrite(buzzerPin, LOW);
    delay(150);
  }
}

void longBeep() {
  digitalWrite(buzzerPin, HIGH);
  delay(600);
  digitalWrite(buzzerPin, LOW);
}

bool isActive(int c) {
  return (mode == 3 || mode == c + 1);
}

int readLdr(int pin) {
  long sum = 0;
  for (int i = 0; i < 5; i++) sum += analogRead(pin);
  return sum / 5;
}

// فلترة الحركة
bool motionConfirmed(int c, unsigned long now) {
  if (digitalRead(pirPins[c]) == LOW) {
    pirFirstHigh[c] = 0;
    return false;
  }
  if (pirFirstHigh[c] == 0) pirFirstHigh[c] = now;
  return (now - pirFirstHigh[c] >= pirConfirmMs);
}

int readDistanceCm() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  unsigned long d = pulseIn(echoPin, HIGH, 12000);
  if (d == 0) return -1;
  return (int)(d * 0.034 / 2);
}

void checkHand(unsigned long now) {
  if (now - lastUs < usInterval) return;
  lastUs = now;

  int d = readDistanceCm();
  bool present = (d > 0 && d <= handMaxCm);

  if (present) {
    if (!handActive) {
      handActive = true;
      handStart = now;
      handRef = d;
    }
    else if (abs(d - handRef) > handTolerance) {
      handStart = now;
      handRef = d;
    }
    else if (!handLatched && now - handStart >= handHold) {
      handLatched = true;
      economy = !economy;
      if (economy) beep(2);
      else beep(1);
    }
  } else {
    handActive = false;
    handLatched = false;
  }
}

// معالجة أوامر السيرفر والداشبورد وبوت التليجرام
void handleIncomingCommands() {
  if (Serial.available() > 0) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "LIGHT:ALL:100%" || cmd == "LIGHT:1:100%" || cmd == "LIGHT:2:100%") {
      mode = 3;
      beep(1);
    } else if (cmd == "LIGHT:ALL:OFF" || cmd == "LIGHT:1:OFF" || cmd == "LIGHT:2:OFF") {
      mode = 0;
      longBeep();
    } else if (cmd == "LIGHT:ALL:AUTO" || cmd == "LIGHT:ALL:20%") {
      mode = 3;
    }
  }
}

// ===== setup =====
void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(tailPin, OUTPUT);
  analogWrite(tailPin, 0);

  for (int c = 0; c < corridors; c++) {
    pinMode(pirPins[c], INPUT);
    pinMode(pwmPins[c], OUTPUT);
    analogWrite(pwmPins[c], current[c]);
  }

  // رسالة المصافحة للسيرفر ليعرف أن الأردوينو متصل بـ 2 ممرات تلقائياً
  Serial.println("SYSTEM_READY:WAREHOUSE:1:AISLES:2");
}

// ===== loop =====
void loop() {
  unsigned long now = millis();

  // استقبال أي أوامر من السيرفر
  handleIncomingCommands();

  // الزرار
  bool buttonState = digitalRead(buttonPin);
  if (buttonState == LOW && lastButtonState == HIGH && now - lastButtonTime > 200) {
    lastButtonTime = now;
    mode = (mode + 1) % 4;
    if (mode == 0) longBeep();
    else beep(mode);
    ignoreUntil = millis() + graceTime;
  }
  lastButtonState = buttonState;

  // إشارة الإيد (Ultrasonic)
  checkHand(now);

  for (int c = 0; c < corridors; c++) {
    bool active = isActive(c);

    if (!active) {
      levelIndex[c] = levelCount - 1;
      target[c] = (mode == 0) ? 0 : inactiveBrightness;
    }
    else {
      int light = readLdr(ldrPins[c]);
      if (!isDay[c] && light > dayOn) isDay[c] = true;
      else if (isDay[c] && light < dayOff) isDay[c] = false;

      if (motionConfirmed(c, now) && now >= ignoreUntil) {
        lastMotion[c] = now;
        lastLevelChange[c] = now;
        levelIndex[c] = 0;
      }
      else if (levelIndex[c] < levelCount - 1 &&
               now - lastMotion[c] >= holdTime &&
               now - lastLevelChange[c] >= levelTime) {
        levelIndex[c]++;
        lastLevelChange[c] = now;
      }

      if (isDay[c]) target[c] = daylightBrightness;
      else target[c] = levels[levelIndex[c]];
    }

    if (c == 0) {
      naturalTarget0 = target[0];
      if (economy && active && !isDay[0]) target[0] = 255;
    }

    unsigned long interval = (!active || target[c] > current[c]) ? fadeFast : fadeSlow;
    if (current[c] != target[c] && now - lastFade[c] >= interval) {
      lastFade[c] = now;
      if (current[c] < target[c]) current[c]++;
      else current[c]--;
      analogWrite(pwmPins[c], current[c]);
    }
  }

  // الـ 4 التانيين (Tail)
  tailTarget = economy ? min(naturalTarget0, ecoMax) : naturalTarget0;

  unsigned long tailInterval;
  if (tailTarget > tailCurrent) tailInterval = fadeFast;
  else tailInterval = economy ? fadeEco : fadeSlow;

  if (tailCurrent != tailTarget && now - tailLastFade >= tailInterval) {
    tailLastFade = now;
    if (tailCurrent < tailTarget) tailCurrent++;
    else tailCurrent--;
    analogWrite(tailPin, tailCurrent);
  }

  // ============================================================
  // إرسال الـ JSON التلقائي للسيرفر والـ API كل 800 مللي ثانية
  // ============================================================
  if (now - lastApiTelemetry >= 800) {
    lastApiTelemetry = now;

    int m1 = digitalRead(pirPins[0]);
    int m2 = digitalRead(pirPins[1]);
    int d1 = (current[0] * 100) / 255;
    int d2 = (current[1] * 100) / 255;
    int luxAvg = (readLdr(ldrPins[0]) + readLdr(ldrPins[1])) / 2;

    // JSON Format المتوافق 100% مع server.py
    Serial.print("{\"warehouse\":1,\"aisle_count\":2,\"aisles\":[");
    Serial.print("{\"id\":1,\"motion\":");
    Serial.print(m1);
    Serial.print(",\"dim\":");
    Serial.print(d1);
    Serial.print("},{\"id\":2,\"motion\":");
    Serial.print(m2);
    Serial.print(",\"dim\":");
    Serial.print(d2);
    Serial.print("}],\"lux\":");
    Serial.print(luxAvg);
    Serial.print(",\"economy\":");
    Serial.print(economy ? 1 : 0);
    Serial.println("}");
  }
}
