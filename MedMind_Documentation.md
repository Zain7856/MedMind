# MedMind — Project Documentation | توثيق المشروع

**Developed by | تطوير:** Mohamed Zain
**Date | التاريخ:** February 11, 2026
**Competition | المسابقة:** Afro-Asian International Web Competition

---

## 1. Overview | نظرة عامة

MedMind هو health-tech platform هدفه إنه يقرب المسافة بين "حاسس إني مش تمام" و"عارف أعمل إيه بالظبط". من خلال chatbot متاح 24 ساعة، وdatabase فيها دكاترة ومستشفيات، ومكتبة معلومات عن الأمراض، المستخدم يقدر يطمن على نفسه من بيته بدل ما يضيع وقت في البحث في أماكن متفرقة.

The idea is simple: catch problems early, before they turn into something that's harder — and more expensive — to treat.

---

## 2. The Problem | المشكلة

كتير من الناس بتأجل زيارة الدكتور مش لأنهم مش حاسين بحاجة، لكن لأن العملية نفسها متعبة: مش عارفين يروحوا لأنهي تخصص، صعب يقارنوا بين الدكاترة والمستشفيات، ومفيش وسيلة سريعة يعرفوا بيها هل الأعراض دي فعلاً محتاجة قلق. And by the time they act, the condition is usually more advanced.

## 3. The Solution | الحل

MedMind بتجمع كل الرحلة دي في مكان واحد:

- **Chatbot (24h)** — initial read على الأعراض في أي وقت
- **Doctors (anywhere)** — بحث بالمكان والسعر والمواعيد المتاحة
- **Hospitals (anywhere)** — نفس الفكرة بس للمستشفيات
- **Diseases** — مكتبة تعرّفك أكتر على الحالة اللي أعراضك بتشبهها

---

## 4. Features | الميزات

| Feature | الوصف |
|---|---|
| Chatbot (24h) | مساعد متاح دايمًا لفحص أولي للأعراض |
| Doctors (anywhere) | بحث عن دكاترة بالمكان، السعر، والمواعيد |
| Hospitals (anywhere) | بحث عن مستشفيات بالمكان والخدمات |
| Diseases | مكتبة مرجعية للأعراض والأمراض |

---

## 5. Tech Stack | التقنيات المستخدمة

### Languages

| Tech | ليه استخدمناها |
|---|---|
| HTML | بناء هيكل الصفحة |
| CSS | التصميم والشكل |
| JavaScript | التفاعل مع المستخدم |
| SQL | تخزين البيانات |

### Frameworks & Runtime

| Tech | ليه استخدمناها |
|---|---|
| **Node.js** | بيشغل JavaScript برا الـ browser بمحرك V8، فبيدي الـ backend سرعة أعلى، وبتقدر تشتغل بنفس اللغة على الـ frontend والـ backend |
| **Express** | بيسهّل بناء الـ REST API اللي بيربط الـ frontend بالـ backend |
| **better-sqlite3** | مكتبة synchronous سريعة للتعامل مع SQLite من JavaScript بسهولة |
| **SQLite** | قاعدة بيانات خفيفة (file-based) مناسبة لبيانات الدكاترة والمستشفيات والأمراض |

### Data Sources | مصادر البيانات

- **Database:** SQLite3
- **API:** MedMind API — الـ API ده مش خدمة خارجية، إحنا اللي بنينا الـ Frontend والـ Backend بأيدينا، والـ API هو الجسر اللي بيربط بينهم عشان يتكلموا مع بعض ويبادلوا البيانات
- **Static Data:** محتوى ثابت لمكتبة الأمراض

---

## 6. Architecture | البنية التقنية

```
User (Browser)
      │
      ▼
Frontend (HTML/CSS/JS)
      │  HTTP requests
      ▼
Express.js API Server (Node.js)
      │
      ▼
better-sqlite3
      │
      ▼
SQLite Database (doctors, hospitals, diseases, chatbot data)
```

---

## 7. Technical Q&A | أسئلة تقنية

**إيه إمكانيات المشروع؟**
MedMind بيوصّلك لدكتور أو مستشفى أو معلومة عن مرضك في أسرع وقت ممكن، بدل ما تضيع وقتك بتدور في أماكن كتير متفرقة. المنصة بتوفرلك 4 حاجات أساسية: chatbot متاح 24 ساعة يديك فحص أولي لأعراضك، بحث عن دكاترة في أي مكان بالسعر والمواعيد، بحث عن مستشفيات بنفس الطريقة، ومكتبة معلومات عن الأمراض تفهمك أكتر عن حالتك.

**إيه المشكلة اللي بيحلها المشروع؟**
كتير من الناس بتمرض وبتوصل لمرحلة متأخرة من غير ما تحس، لأنها مش بتاخد خطوة غير لما الحالة تكون اتطورت وبقى صعب علاجها. MedMind بيديك فرصة إنك تطمن على نفسك من بيتك في أسرع وقت، ولو حسيت إن فيه اشتباه في حاجة تلحق نفسك بدري في الوقت المناسب بدل التأخير.

**إيه اللغات المستخدمة وليه؟**
استخدمنا HTML لبناء هيكل الصفحة، CSS لتصميمها وإخراجها بشكل مناسب، JavaScript عشان نعمل تفاعل حقيقي مع المستخدم في المتصفح، وSQL عشان نخزن ونسترجع بيانات الدكاترة والمستشفيات والأمراض بشكل منظم.

**هل استخدمتوا API؟ منين؟**
أيوه، استخدمنا MedMind API، وهو API بنيناه إحنا بنفسنا مش جاهز أو خارجي. الهدف منه إنه يربط بين حاجتين احنا اللي عملناهم: الـ Frontend (الواجهة اللي المستخدم بيشوفها ويتعامل معاها) والـ Backend (المنطق وقاعدة البيانات اللي شغالة من ورا). يعني الـ API ده هو خط الاتصال اللي بيخلي الاتنين يبعتوا ويستقبلوا بيانات من بعض بشكل منظم.

**إيه الـ Frameworks/التقنيات المستخدمة؟**
استخدمنا better-sqlite3, Express, Node.js, وSQLite. كل واحدة فيهم كان ليها دور مختلف: Node.js شغّل الـ JavaScript على السيرفر، Express بنى الـ API اللي بتتكلم بيه الواجهة مع قاعدة البيانات، better-sqlite3 سهّل التعامل مع قاعدة البيانات من جوه الكود، وSQLite كانت مكان تخزين البيانات نفسها.

---

## 8. Marketing Plan | الخطة التسويقية

### Product Positioning
Always be able to check on your health and stay aware of your health status — من غير ما تحتاج تروح لدكتور كل شهر بس عشان تطمن.

### Target Users | المستخدمون المستهدفون

| Priority | Segment |
|---|---|
| Primary | Elderly; adults 40–59 |
| Secondary | Adults 33–39; babies (via parents) |
| Tertiary | Children, teenagers, adults 20–30 |

### Unique Feature | الميزة الفريدة
All things you need to know or use about your health, in one place.

### Digital Marketing | التسويق الرقمي

1. **Social Media** — التركيز الأساسي على Facebook لأن حوالي 80% من الـ target users موجودين عليه، مع وجود ثانوي على Instagram وTwitter/X.
2. **Email Marketing** — إرسال health tips أسبوعية وتحديثات عن المنتج للمشتركين.
3. **Community & Reviews** — تشجيع المستخدمين يشاركوا تجربتهم مع MedMind (review) مقابل discount.

### Marketing Budget | الميزانية التسويقية
- Facebook Ads: __________
- Instagram/Twitter Ads: __________
- Content creation (posts, weekly emails): __________
- **Total monthly budget:** __________

### Timeline | الجدول الزمني
- Month 1 — __________
- Month 2 — __________
- Month 3 — __________
- Month 6 target — __________

### Success Metrics (KPIs) | مؤشرات النجاح
- Target signups/month: __________
- Chatbot usage rate: __________
- Doctor/hospital bookings via platform: __________
- Review/referral rate from Community program: __________

---

## 9. Team | الفريق

**Developed by | تطوير:** Mohamed Zain (Solo Project)

---

## 10. Repository | المستودع البرمجي

GitHub: __________
