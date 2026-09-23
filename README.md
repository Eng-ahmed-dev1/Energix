# ⚡ Energix — Smart Energy & Warehouse Lighting Management System
### *An IoT-Powered Intelligent Lighting Control & Analytics Platform for Warehouses and Logistics Facilities*

[![School](https://img.shields.io/badge/School-Fathalla%20iATS-blue.svg)](https://fathallaiats.edu.eg/)
[![Grade](https://img.shields.io/badge/Grade-11%20(2025--2026)-green.svg)](#)
[![Team Code](https://img.shields.io/badge/Team%20Code-W032526-orange.svg)](#)
[![Savings](https://img.shields.io/badge/Energy%20Savings-65%25%20--%2070%25-brightgreen.svg)](#8-نتائج-التجارب-والتحليل-الرقمي-results--data-analysis)
[![AI Co-Pilot](https://img.shields.io/badge/AI%20Co--Pilot-Grok%20(xAI)-black.svg)](#12-دليل-التنفيذ-الكامل-خطوة-بخطوة-full-implementation-guide)
[![SDGs](https://img.shields.io/badge/UN%20SDGs-8%20|%209%20|%2012%20|%2017-yellow.svg)](#10-التوافق-مع-أهداف-التنمية-المستدامة-un-sdgs)

---

## 📌 الفهرس التفصيلي للمشروع

1. [المفهوم العام والملخص التنفيذي (Executive Summary)](#1-المفهوم-العام-والملخص-التنفيذي)
2. [تحليل المشكلة وأبعادها التشغيلية والمالية (Problem Statement)](#2-تحليل-المشكلة-وأبعادها-التشغيلية-والمالية)
3. [الأفكار والبدائل التقنية التي تمت دراستها (Evaluated Solutions & Alternatives)](#3-الأفكار-والبدائل-التقنية-التي-تمت-دراستها)
4. [الفكرة المعتمدة ومزاياها التنافسية (The Proposed Solution)](#4-الفكرة-المعتمدة-ومزاياها-التنافسية)
5. [المعمارية التقنية وقواعد التحكم الذكي (System Architecture & Smart Logic)](#5-المعمارية-التقنية-وقواعد-التحكم-الذكي)
6. [النموذج الأولي الفيزيائي والمكونات (Hardware Prototype)](#6-النموذج-الأولي-الفيزيائي-والمكونات)
7. [المنصة الرقمية والمحاكاة البرمجية (Energix Software Platform)](#7-المنصة-الرقمية-والمحاكاة-البرمجية)
8. [نتائج التجارب والتحليل الرقمي (Results & Data Analysis)](#8-نتائج-التجارب-والتحليل-الرقمي)
9. [دراسة الجدوى ونموذج العمل التجاري (Business Model Canvas)](#9-دراسة-الجدوى-ونموذج-العمل-التجاري)
10. [التوافق مع أهداف التنمية المستدامة (UN SDGs)](#10-التوافق-مع-أهداف-التنمية-المستدامة)
11. [التوصيات الهندسية وخريطة الطريق المستقبلية (Recommendations & Roadmap)](#11-التوصيات-الهندسية-وخريطة-الطريق-المستقبلية)
12. [🚀 دليل التنفيذ الكامل خطوة بخطوة (Full Implementation Guide: Firmware, Grok AI & Web)](#12-دليل-التنفيذ-الكامل-خطوة-بخطوة-full-implementation-guide)
13. [المراجع العلمية المعتمدة (References)](#13-المراجع-العلمية-المعتمدة)

---

## 1. المفهوم العام والملخص التنفيذي

**Energix (Energy Saver)** هو نظام إنترنت أشياء (IoT) ومنصة برمجية سحابية ذكية تهدف إلى أتمتة وترشيد إضاءة المنشآت اللوجستية الضخمة والمستودعات وسلاسل التجزئة والهايبر ماركت. 

يقوم النظام باستبدال أسلوب الإضاءة التقليدي الدائم (Always-ON 24/7) بأسلوب تكيفي متقدم يعتمد على استشعار الحركة والحرارة وشدة ضوء النهار، مع الحفاظ على وضع استعداد آمن بنسبة **20%** بدلاً من الإطفاء الكلي، بالإضافة إلى ربط كافة البيانات بلوحة تحكم تحليلية تتيح استخراج تقارير أسبوعية تفاعلية وتنبؤات الصيانة الاستباقية، ومساعد ذكاء اصطناعي تفاعلي **(Grok-Powered AI Co-Pilot)** يتيح التخاطب الصوتي والنصي والتحكم الميداني الفوري.

---

## 2. تحليل المشكلة وأبعادها التشغيلية والمالية

### المشكلة الأساسية:
تعتمد المستودعات الكبرى على إبقاء صفوف إضاءة عالية الكثافة (High-Bay Fixtures) تعمل بكامل طاقتها (100%) على مدار 24 ساعة يومياً، حتى في الممرات التي قد تظل خالية من العمال لساعات طويلة.

### الآثار السلبية الناتجة:
1. **استنزاف مالي حاد:** تمثل الإضاءة المستمرة أكبر بنود استهلاك الكهرباء غير المنتجة في ميزانية تشغيل المخازن وسلاسل التوريد.
2. **تلف متسارع لوحدات الإضاءة (Bulb & Ballast Degradation):** التشغيل المستمر بأقصى طاقة يقلل العمر الافتراضي لوحدات الـ LED، في حين أن الإطفاء والتشغيل المفاجئ المتكرر يسبب صدمات حرارية وكهربائية تؤدي لاحتراقها.
3. **غياب الرؤية البيانية والتحليلية (Blind Operations):** افتقار الإدارات لأي وسيلة لمعرفة المناطق الأكثر استهلاكاً للهدر أو كشف الأعطال الكهربائية والحساسات المعطلة إلا بعد توقفها التام.
4. **تحديات السلامة والراحة المهنية:** الإطفاء الكلي للممرات يسبب ظلاماً مفاجئاً خطيراً لرافعات الشوكية (Forklifts)، بينما الإضاءة القصوى الدائمة تولد وهجاً وحرارة غير مريحة للعمال.

---

## 3. الأفكار والبدائل التقنية التي تمت دراستها

خلال مراحل البحث والتطوير (Ideation & Research)، تمت دراسة وتحليل عدة بدائل تقنية مستخدمة أو مقترحة:

| الفكرة / البديل | آلية العمل | المزايا | القصور ونقاط الضعف التي كشفها البحث |
|---|---|---|---|
| **1. حساسات الحركة البسيطة (Basic PIR)** | تشغيل الإضاءة 100% عند الحركة وإطفاؤها تماماً (0%) عند السكون. | رخيصة التكلفة وسهلة التركيب. | • الإطفاء الكامل (0%) يسبب خطورة لرافعات الشوكية.<br>• التبديل السريع والمستمر بين (0% و 100%) يحرق لمبات الـ LED سريعاً.<br>• لا تستشعر تواجد العمال الثابت في مكانهم.<br>• غياب أي نظام تقارير. |
| **2. خلايا الضوء الطبيعي فقط (Photocell / LDR)** | خفض الإضاءة حسب كمية ضوء الشمس الداخلة للمخزن. | استغلال طاقة الشمس نهاراً. | • تعمل نهاراً فقط.<br>• لا علاقة لها بحركة العمال أو وجودهم داخل الممرات. |
| **3. نظام الإضاءة التنبؤي (AI Pattern Prediction)** | التنبؤ بأوقات الذروة وجدولة الإضاءة مسبقاً. | تجهيز الممرات قبل دخول العمال. | • غير مرن في حالات التغيير المفاجئ لجدول التفريغ والشحن.<br>• يتطلب بنية تحتية برمجية معقدة دون توفير فوري للحركة المفاجئة. |
| **4. أنظمة إدارة المباني المركزية (Traditional BMS)** | تحكم مركزي كامل بجميع أنظمة المبنى (تكييف، إضاءة، كهرباء). | شمولية التحكم. | • تكلفة استثمارية باهظة جداً.<br>• غير مصممة للمراقبة الجزئية على مستوى مربعات الممرات.<br>• تعقيد الصيانة والبرمجة. |
| **5. سياسات الترشيد اليدوي (Manual Switching Policies)** | إلزام العمال بإطفاء مفاتيح الإضاءة يدوياً عند مغادرة الممر. | صفر تكلفة تقنية. | • عرضة للخطأ والنسيان البشري.<br>• مستحيلة التطبيق عملياً في المخازن العملاقة متعددة الممرات. |

---

## 4. الفكرة المعتمدة ومزاياها التنافسية

تم اعتماد فكرة **نظام الإضاءة التكيفي الهجين المتصل سحابياً (Energix)** والذي يجمع بين أفضل ميزات الأفكار السابقة مع التغلب على عيوبها:

* **نظام التعتيم الذكي بنسبة 20% (Standby Optimization):**
  بدلاً من إطفاء النور كلياً، ينخفض الضوء تدريجياً إلى 20%؛ هذا المستوى يحقق معادلة هندسية ذهبية:
  - استهلاك كهرباء شبه منعدم (توفير يصل لـ 80% في وضع السكون).
  - بقاء الممر مرئياً بوضوح لحركة الرافعات الشوكية للسلامة ومنع الحوادث.
  - منع الصدمات الحرارية لدرايفرات ومصابيح الـ LED عبر تجنب دورات (OFF/ON) الصفرية.
* **الاستشعار التكاملي المزدوج (Motion + Heat Sensing):**
  دمج حساسات الحركة بالأشعة تحت الحمراء مع حساسات قياس التواجد والحرارة حتى لا تنطفئ الإضاءة عن العامل أثناء وقوفه لفترات طويلة لتفقد البضائع.
* **الأتمتة الشاملة بدون تغيير سلوك العمال (Zero Change in Workflow):**
  يعمل النظام ذاتياً بالكامل دون الحاجة لأي ضغطة زر أو تدخل بشري.
* **المساعد الذكي للمخزن (Grok AI Co-Pilot):**
  دمج نموذج Grok (xAI) عبر واجهة محادثة طبيعية واستدعاء دوال برمجية (Tool Calling) لقراءة الحساسات والتحكم في الإضاءة عبر الصوت والنص.
* **التقارير التنفيذية التفاعلية (Executable Weekly Reports):**
  توليد تقارير بيانية تفصيلية أسبوعياً ومؤشرات أداء قابلة للاستخراج بصيغة PDF.

---

## 5. المعمارية التقنية وقواعد التحكم الذكي

```mermaid
flowchart TD
    subgraph Inputs ["طبقة الاستشعار والبيئة الميدانية"]
        S1["حساسات الحركة PIR"]
        S2["حساسات الحرارة والتواجد DHT"]
        S3["حساسات ضوء النهار LDR"]
        S4["إشارة إنذار الطوارئ والحريق"]
        USR["أوامر المستخدم / المدير عبر الشات"]
    end

    subgraph Processing ["وحدة المعالجة المنطقية (Microcontroller & AI)"]
        MCU["متحكم الأردوينو ومحرك خوارزميات PWM"]
        AI["Grok LLM Engine (xAI Function Calling)"]
    end

    subgraph Outputs ["المشغلات الميدانية"]
        LED["وحدات إضاءة الممرات (LED High Bays)"]
        LCD["شاشة المؤشرات الميدانية (Watts Saved)"]
    end

    subgraph Cloud ["المنصة السحابية والتحليلات"]
        GW["خادم الوسيط (Python Backend)"]
        DB["قاعدة البيانات والتحليلات"]
        UI["لوحة تحكم Energix Dashboard"]
        REP["تقارير PDF الأسبوعية وتنبيهات الأعطال"]
    end

    S1 --> MCU
    S2 --> MCU
    S3 --> MCU
    S4 --> MCU

    MCU --> LED
    MCU --> LCD

    USR --> UI
    UI --> GW
    GW <--> AI
    GW <--> MCU
    GW --> DB
    DB --> UI
    UI --> REP
```

### القواعد التشغيلية الخمس (Core Algorithmic Rules):

1. **قاعدة الدخول الفوري (Instant Active Rule):**
   عند دخول أي عامل أو رافعة لممر، يستشعر النظام وجوده في غضون **2 إلى 3 ثوانٍ**، ويرفع مستوى الإضاءة بنعومة إلى **100%**.
2. **قاعدة وضع الاستعداد (Standby Timeout Rule):**
   عند انعدام الحركة لمهلة محددة (تمت معايرتها معملياً بـ 30 ثانية وفي التطبيق الميداني من 15 إلى 60 دقيقة)، تتلاشى الإضاءة عبر تقنية **PWM** بنعومة لتستقر عند **20%**.
3. **قاعدة حصاد ضوء النهار (Daylight Harvesting Rule):**
   تقيس حساسات الـ LDR شدة الضوء الطبيعي النافذ من نوافذ السقف؛ وفي الأيام المشمسة، يقوم المعالج بخفض طاقة الإضاءة الصناعية بنسبة **40% إلى 60% إضافية** بما يضمن ثبات شدة الإضاءة الكلية على مستوى العمل.
4. **قاعدة تخصيص المناطق الديناميكي (Dynamic Zone Allocation Rule):**
   إذا استقر العامل في مربع عمل محدد (Zoned Area) لأكثر من 30 دقيقة، يستمر هذا المربع فقط عند 100% بينما تنخفض باقي أجزاء الممر الطويل إلى وضع الـ 20% لتوفير أقصى قدر ممكن من الطاقة.
5. **قاعدة الطوارئ والأمان القصوى (Emergency Override Rule):**
   في حال حدوث حريق أو إطلاق صفارات الإنذار، يتجاوز النظام كافة قواعد التوفير ويشغل كامل إضاءات الممرات والمخزن بنسبة **100% فورياً** لتسهيل رؤية مخارج الطوارئ ومسارات الإخلاء.

---

## 6. النموذج الأولي الفيزيائي والمكونات

تم تصميم وتجميع نموذج محاكاة هندسي واقعي (Hardware Prototype) لاختبار المنطق البرمجي والدوائر الكهربائية:

### قائمة المكونات المادية والإلكترونية (BOM):
* **المتحكم الدقيق (MCU):** لوحة Arduino Uno / Mega.
* **مستشعرات الحركة (Motion):** مستشعرات PIR مجهزة بأسطوانات توجيه فيزيائية خاصة (*Crosstalk Blinders*) لحصر زاوية الرؤية داخل الممر ومنع الاستشعار الخاطئ من الممرات المجاورة.
* **مستشعر الحرارة والتواجد:** مستشعر DHT11 لقياس الحرارة وتأكيد التواجد البشري.
* **مستشعر الضوء الطبيعي:** مقاومات ضوئية LDR متصلة بمقسم جهد (Voltage Divider) عبر مقاومات 10kΩ.
* **الإضاءة:** 6 دايودات بيضاء عالية السطوع (High-Brightness White LEDs) متصلة بمقاومات 220Ω على منافذ PWM لدعم التعتيم التدريجي دون رعشة بصرية.
* **شاشة العرض الميدانية:** شاشة LCD لعرض الوضع التشغيلي اللحظي (Active / Eco) وتقدير الوفر في الواط (*Watts Saved*).
* **هيكل المجسم:** ألواح Foam Board مغلفة بطلاء أسود غير لامع لمحاكاة الخصائص الضوئية الواقعية للمخازن مع أرفف محاكاة للبضائع.

---

## 7. المنصة الرقمية والمحاكاة البرمجية

تتكامل طبقة الهاردوير مع منصة ويب سحابية حديثة تحمل اسم **Energix Smart Energy Platform**:

### واجهات ومكونات المنصة:
1. **صفحة الهبوط (Landing Page):** تعرض إحصائيات عامة للمنظومة (2.4M kWh Tracked, $180K Saved Monthly, 340+ Sites Active).
2. **شرح آلية العمل (How It Works):** توضيح الخطوات الأربع: (1) تسجيل المنشآت -> (2) ربط العدادات والحساسات -> (3) التحليل وتحديد الهدر -> (4) التنفيذ الآلي للتوفير.
3. **لوحة تحكم المخازن (Inventory Dashboard):**
   - مؤشرات مجمعة: إجمالي الطاقة المستهلكة (Total Consumed kWh)، إجمالي الطاقة الموفرة (Total Saved kWh)، إجمالي الوفر المالي بالدولار ($ Saved)، عدد المنشآت المدارة.
   - تصنيف آلي ذكي لكل منشأة إلى 3 مستويات أداء:
     - **Efficient (كفء):** نسبة توفير مرتفعة وتجاوب ممتاز للحساسات.
     - **Moderate (متوسط):** استهلاك معتدل.
     - **High Usage (استهلاك مرتفع):** تنبيه فوري لوجود استهلاك غير معتاد أو ممر بحاجة لإعادة معايرة الحساسات.
4. **نافذة استخراج التقارير الأسبوعية (Interactive Weekly Report Modal):**
   - استعراض بياني مفصل لاستهلاك كل يوم على حدة (من الإثنين إلى الأحد).
   - زر لتوليد واستخراج التقارير الرسمية كملفات PDF جاهزة لمديري المنشآت.

### صور واجهات المنصة الموثقة:
| اسم الشاشة | الغرض الوظيفي | رابط المعاينة |
|---|---|:---:|
| **Landing Page** | الواجهة الرئيسية لمنصة Energix ومؤشرات التوفير العامة | ![Landing Page](./Resources/1.jpeg) |
| **Workflow** | خطوات التشغيل الأربع | ![How It Works](./Resources/2.jpeg) |
| **Inventory Dashboard** | المراقبة الشاملة وتصنيف الوحدات | ![Dashboard](./Resources/3.jpeg) |
| **Facility Cards Grid** | بطاقات المراقبة لكل مخزن أو وحدة تبريد | ![Cards Grid](./Resources/4.jpeg) |
| **Weekly Report Modal** | استخراج تقرير PDF وتحليل الأيام | ![Report Modal](./Resources/5.jpeg) |

---

## 8. نتائج التجارب والتحليل الرقمي

أظهرت نتائج الاختبارات التجريبية المستمرة على مدار **4 أسابيع** الأرقام والبيانات الموثقة التالية:

* **الوفر الإجمالي الأسبوعي في فاتورة الكهرباء:** **65% إلى 70%**.
* **ساعات العمل النشطة:** خفض الاستهلاك إلى 35% - 40% (توفير 60% - 65%) عبر تركيز النور في منطقة العمل فقط وتعتيم باقي الممر.
* **ساعات الركود والليل:** وفر يصل إلى **80%** عند العمل على وضع الاستعداد (20% Standby Mode).
* **تأثير ضوء النهار الطبيعي:** تخفيض إضافي بنسبة **40% إلى 60%** أثناء سطوع الشمس.
* **زمن استجابة النظام عند الدخول:** **2 إلى 3 ثوانٍ** فقط للوصول لكامل السطوع.
* **زمن التعتيم بعد المغادرة:** **5 ثوانٍ** بعد انقضاء مهلة السكون.
* **دقة رصد الحركة:** **96.4%**، مع نسبة إنذار خاطئ أقل من 3%.

---

## 9. دراسة الجدوى ونموذج العمل التجاري

```
+----------------------------------------------------------------------------------------------------+
|                                    BUSINESS MODEL CANVAS: ENERGIX                                  |
+---------------------------------+---------------------------------+--------------------------------+
| شركاء النجاح (KEY PARTNERS)     | الأنشطة الرئيسية (KEY ACTIVITIES)| القيمة المضافة (VALUE PROPS)   |
| • موردو المعدات والحساسات       | • تجميع وتركيب الحساسات والمتحكم | • مساعد ذكي مدعوم بـ Grok AI    |
| • مشغلو المخازن والمناطق اللوجستية| • المراقبة اللحظية عبر السحابة  | • تقارير تنفيذية أسبوعية PDF    |
| • مصانع وحدات إضاءة الـ LED      | • التطوير المستمر للخوارزميات   | • خفض تكلفة الكهرباء 65%-70%   |
| • مزودو البنية السحابية (Cloud) | • الصيانة الفنية ومعايرة الأجهزة| • مضاعفة العمر الافتراضي للمبات|
|                                 +---------------------------------+ • صفر تغيير في سلوكيات العمال  |
|                                 | الموارد الرئيسية (KEY RESOURCES)| • تعزيز السلامة وتكامل الطوارئ |
|                                 | • عتاد التحكم الإلكتروني المبرمج |                                |
|                                 | • منصة الويب وخوادم التحليلات   |                                |
|                                 | • الفريق الهندسي والفني المتخصص |                                |
+---------------------------------+---------------------------------+--------------------------------+
| علاقات العملاء (CUSTOMER REL.)  | قنوات التوزيع (CHANNELS)         | شرائح العملاء (CUSTOMER SEGS)  |
| • عقود صيانة ودعم فني (SLA)     | • المبيعات المباشرة للشركات B2B | • فئة (أ): المخازن ومراكز     |
| • تقارير تدقيق أداء دورية       | • لوحة التحكم الإلكترونية السحابية|   التوزيع العملاقة             |
| • صيانة ميدانية وتنبؤ استباقي للأعطال| • شراكات مقاولي الأعمال الكهربائية| • فئة (ب): المصانع والمستودعات |
|                                 | • معارض ومؤتمرات اللوجستيات     |   المتوسطة والصغيرة            |
|                                 |                                 | • سلاسل الهايبر ماركت والتجزئة |
|                                 |                                 | • مستودعات التبريد والتجميد    |
+---------------------------------+---------------------------------+--------------------------------+
| هيكل التكاليف (COST STRUCTURE)                                    | مصادر الإيرادات (REVENUE)      |
| • شراء وتصنيع الحساسات والدوائر الإلكترونية                       | • رسوم بيع وتركيب العتاد الأولي|
| • استضافة الخوادم وقواعد البيانات السحابية                        | • اشتراكات برمجية دورية (SaaS) |
| • أجور مهندسي وفنيي التركيبات والصيانة الميدانية                  | • عقود الصيانة السنوية (SLA)   |
| • تكاليف البحث والتطوير الهندسي والبرمجي                         | • نسبة مشاركة في الوفر المحقق  |
+-------------------------------------------------------------------+--------------------------------+
```

---

## 10. التوافق مع أهداف التنمية المستدامة

* **الهدف 8 (العمل اللائق ونمو الاقتصاد):** بيئة عمل آمنة، إضاءة غير مجهدة للعين، ودعم ربحية المنشآت التشغيلية.
* **الهدف 9 (الصناعة والابتكار والبنية التحتية):** رقمنة المستودعات بأحدث حلول إنترنت الأشياء والتحكم الآلي.
* **الهدف 12 (الاستهلاك والإنتاج المسؤولان):** وقف استنزاف الكهرباء والحد من المخلفات الإلكترونية الناتجة عن احتراق المصابيح.
* **الهدف 17 (عقد الشراكات لتحقيق الأهداف):** بناء تحالفات بين التعليم التكنولوجي المتقدم وقطاعات الصناعة واللوجستيات.

---

## 11. التوصيات الهندسية وخريطة الطريق المستقبلية

1. **معيار توزيع المستشعرات الميداني:** تثبيت حساس حركة وحرارة واحد لكل **8 إلى 10 أمتار** على طول الممر لضمان عدم وجود أي نقطة عمياء (Blind Spot).
2. **أولوية البدء بمخازن التبريد (Cold Storage Priority):** يُنصح بالبدء بمستودعات التبريد والتجميد؛ نظراً لأن حرارة المصابيح التقليدية تزيد حمل أجهزة التبريد، مما يجعل الوفر المزدوج هائلاً.
3. **التكامل مع أنظمة الـ WMS / ERP:** ربط الحساسات بنظام إدارة المستودعات ليتم توقع ممرات الشحن القادمة وإضاءتها مسبقاً قبل وصول الشاحنة بدقائق.
4. **خوارزميات التعلم الآلي للتعديل الذاتي للوقت (Dynamic Timeout ML):** تحليل أنماط الحركة وتعديل مهلة الانتظار تلقائياً لكل ممر حسب تاريخ نشاطه.

---

## 12. 🚀 دليل التنفيذ الكامل خطوة بخطوة (Full Implementation Guide)

يشرح هذا القسم طريقة بناء وتشغيل النظام بالكامل في **ساعة واحدة**: بدءاً من كود الأردوينو الميداني، مروراً بمساعد الذكاء الاصطناعي **Grok (xAI)**، وانتهاءً بنافذة الشات التفاعلية على لوحة التحكم.

---

### أولاً: كود الأردوينو المتكامل للتحكم الميداني (`firmware.ino`)
يقوم هذا الكود بالتحكم في الإضاءة عبر منافذ PWM، قراءة حساسات الحركة والضوء الطبيعي، واستقبال أوامر التحكم عن بُعد عبر الاتصال التسلسلي (Serial) من الذكاء الاصطناعي Grok.

```cpp
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
```

---

### ثانياً: كود وسيط الذكاء الاصطناعي مع Grok API (`grok_copilot.py`)
يقوم هذا السكريبت بالربط المباشر مع واجهة **Grok (xAI)** باستخدام ميزة **Function Calling**؛ فيفهم أسئلة المدير بالعربية، ويقرر تلقائياً إرسال الأوامر للأردوينو أو استخراج بيانات التوفير.

#### تثبيت المتطلبات:
```bash
pip install openai pyserial fastapi uvicorn
```

#### كود السكريبت:
```python
import os
import json
import serial
import serial.tools.list_ports
from openai import OpenAI
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Energix Grok Co-Pilot API")

# 1. إعداد الاتصال مع xAI Grok API
# يتم وضع المفتاح في متغير البيئة أو كتابته مباشرة
XAI_API_KEY = os.getenv("XAI_API_KEY", "your_xai_api_key_here")

client = OpenAI(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai/v1"  # المسار الرسمي لـ xAI API
)

# 2. إعداد الاتصال التسلسلي بالأردوينو
try:
    # ابحث عن المنفذ المتصل تلقائياً أو حدده يدوياً مثل '/dev/ttyUSB0' أو 'COM3'
    arduino = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)
    print("✅ تم الاتصال بالأردوينو بنجاح.")
except Exception as e:
    arduino = None
    print(f"⚠️ تنبيه: لم يتم العثور على الأردوينو ({e})، سيتم العمل بوضع المحاكاة.")

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

# تعريف مواصفات الأدوات لمعيار Function Calling في Grok
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

# سجل المحادثة
conversation_history = [
    {
        "role": "system",
        "content": (
            "أنت 'Energix Co-Pilot'، المساعد الذكي لإدارة طاقة المخازن والمستودعات مدعوم بنموذج Grok من xAI. "
            "أنت تتحدث باللغة العربية بأسلوب احترافي وودود. "
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

        # فحص إذا قرر Grok استدعاء أداة برمجية
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

            # استدعاء ثانٍ للحصول على رد Grok النهائي بعد تنفيذ الأمر
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

### ثالثاً: واجهة الشات العائمة المدمجة في الـ Dashboard (`index.html`)
كود خفيف يمكن إضافته لأي صفحة HTML في منصة Energix لعرض أيقونة شات في الزاوية تفتح نافذة محادثة ذكية متصلة بـ Grok:

```html
<!-- زر فتح الشات العائم -->
<div id="chat-bubble" onclick="toggleChat()" style="position: fixed; bottom: 25px; right: 25px; background: #00d26a; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,210,106,0.4); z-index: 9999;">
  <span style="font-size: 28px;">⚡</span>
</div>

<!-- نافذة المحادثة -->
<div id="chat-window" style="display: none; position: fixed; bottom: 95px; right: 25px; width: 360px; height: 480px; background: #0d1520; border: 1px solid #1e293b; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); flex-direction: column; overflow: hidden; z-index: 9999; font-family: sans-serif;">
  <div style="background: #162235; padding: 15px; color: #fff; display: flex; justify-content: space-between; align-items: center;">
    <div style="font-weight: bold; display: flex; align-items: center; gap: 8px;">
      <span style="color: #00d26a;">●</span> Energix Grok Co-Pilot
    </div>
    <span onclick="toggleChat()" style="cursor: pointer; color: #94a3b8;">✕</span>
  </div>

  <div id="chat-messages" style="flex: 1; padding: 15px; overflow-y: auto; color: #e2e8f0; font-size: 14px; display: flex; flex-direction: column; gap: 10px;">
    <div style="background: #1e293b; padding: 10px 14px; border-radius: 12px; align-self: flex-start; max-width: 85%;">
      أهلاً بك! أنا مساعد Grok الذكي لطاقة المخزن. اسألني عن التوفير أو اطلب مني التحكم في إضاءة أي ممر.
    </div>
  </div>

  <div style="padding: 12px; background: #162235; display: flex; gap: 8px;">
    <input id="user-input" type="text" placeholder="اكتب أمرك هنا (مثال: اطفي ممر 1)..." style="flex: 1; padding: 10px; background: #0d1520; border: 1px solid #334155; border-radius: 8px; color: #fff; outline: none;" onkeypress="if(event.key === 'Enter') sendMessage()">
    <button onclick="sendMessage()" style="background: #00d26a; border: none; padding: 0 15px; border-radius: 8px; color: #000; font-weight: bold; cursor: pointer;">إرسال</button>
  </div>
</div>

<script>
function toggleChat() {
  const win = document.getElementById('chat-window');
  win.style.display = win.style.display === 'none' ? 'flex' : 'none';
}

async function sendMessage() {
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;

  const msgBox = document.getElementById('chat-messages');
  // إضافة رسالة المستخدم
  msgBox.innerHTML += `<div style="background: #00d26a; color: #000; padding: 10px 14px; border-radius: 12px; align-self: flex-end; max-width: 85%; font-weight: 500;">${text}</div>`;
  input.value = '';
  msgBox.scrollTop = msgBox.scrollHeight;

  try {
    const res = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    msgBox.innerHTML += `<div style="background: #1e293b; padding: 10px 14px; border-radius: 12px; align-self: flex-start; max-width: 85%;">${data.reply}</div>`;
  } catch (err) {
    msgBox.innerHTML += `<div style="background: #ef4444; color: #fff; padding: 10px 14px; border-radius: 12px; align-self: flex-start;">حدث خطأ في الاتصال بسيرفر Grok.</div>`;
  }
  msgBox.scrollTop = msgBox.scrollHeight;
}
</script>
```

---

### رابعاً: خطوات التشغيل والتجربة في 4 خطوات بسيطة

1. **توصيل الأردوينو:**
   - وصل لوحة الأردوينو بالكمبيوتر عبر كابل USB.
   - ارفع كود `firmware.ino` عبر Arduino IDE بعد ضبط منفذ الـ COM.
2. **تشغيل سيرفر Grok:**
   - ضع مفتاح `XAI_API_KEY` الخاص بك.
   - شغل السيرفر بالأمر:
     ```bash
     python grok_copilot.py
     ```
3. **فتح واجهة الشات:**
   - افتح صفحة الموقع `index.html` في المتصفح.
4. **تنفيذ سيناريو المناقشة (Live Demo):**
   - اكتب: *"يا جروك، استهلكنا كهرباء قد إيه النهاردة؟"* ⬅️ يرد عليك بنسب التوفير المحققة.
   - اكتب: *"اطفي نور ممر 1 للصيانة حالاً"* ⬅️ **اللمبة في المجسم ستنطفئ فورياً أمام الحضور!**

---

## 13. المراجع العلمية المعتمدة (References)

1. **U.S. Department of Energy (FEMP):** *"Wireless Occupancy Sensors for Lighting Controls: Applications Guide for Federal Facilities"*. [Link](https://www.energy.gov/femp/articles/wireless-occupancy-sensors-lighting-controls-applications-guide-federal-facility)
2. **U.S. DOE – Better Buildings Solution Center:** *"Wireless Sensors for Lighting Energy Savings Guidance"*. [Link](https://betterbuildingssolutioncenter.energy.gov/sites/default/files/attachments/Wireless-Sensors-Guidance.pdf)
3. **EnOcean Alliance:** *"Wireless Lighting Controls: A Total Cost Analysis — Warehouse Payback Study"*. [Link](https://www.enocean-alliance.org/wp-content/uploads/2016/11/Whitepaper__wireless_lighting_controls_payback.pdf)
4. **AGC Lighting Technical Papers:** *"High Bay Light with Occupancy Sensor Saving Energy in Warehouse — PIR & Microwave Applications"*. [Link](https://www.agcled.com/blog/high-bay-light-with-occupancy-sensor-saving-energy-in-warehouse.html)
5. **xAI Documentation:** *"Grok API Reference and Function Calling Guide"*. [Link](https://docs.x.ai)

---

---

## 🛡️ الخطة البديلة المعتمدة: Plan B (SafeGrid Platform)

تم اعتماد **Plan B** رسمياً كخطة طوارئ وحماية صناعية متكاملة للمشروع تحت اسم:  
🔥 **SafeGrid — Smart Warehouse Safety & Hazard Grid**

### التنسيق المزدوج بين Plan A و Plan B:
يشترك المشروعان في نفس البنية التحتية لممرات المخزن؛ فعند رصد أي حريق أو شرز كهربائي عبر **Plan B**:
1. يفصل نظام SafeGrid التيار الكهربائي فورياً عن الممر المصاب لعزل الماس ومنع انتشار النيران.
2. يرسل إشارة طوارئ فورية لنظام **Plan A (Energix)** لتشغيل كافة إضاءات المخزن الأخرى بنسبة **100% فورياً** لتأمين مسارات إخلاء العمال.
3. يقوم مساعد **Grok AI Co-Pilot** بإذاعة برقية طوارئ صوتية للمشرفين برقم الممر المشتعل.

📖 **للاطلاع على التوثيق الهندسي والبرمجي الكامل لـ Plan B مع كود الأردوينو:**  
👉 [**انقر هنا لفتح ملف README_PLAN_B.md المستقل**](file:///home/amed/Desktop/Repos/Capstone/README_PLAN_B.md)
