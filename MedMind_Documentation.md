
# Software Project Documentation | 

---

## 1. Project Overview | نظرة عامة على المشروع

| Field | Value |
|-------|-------|
| **Project Title** | MedMind |
| **Project Type** | Web App |
| **Description** | MedMind هو Medical website بيساعدك تعملcheck بسيط علي صحتك عن طريق الchatbot بتاعنا(MedMind)
 ودا بيساعدك تعمل check دوري كل فتره عشان تطمن طب لو محتاج برضو MedMind موفرلك دكاتره و مستشفيات 
 وبرضو لو حابب تعرف عن المرض نفسه فMedMind
 برضو ف لو حسيت في اي وقت انك مش تمام مش لازم تنزل مخصوص لازم تنزل ولا لا وايه المجالات الي لازم تكشف فيها |
<!-- | **Target Users** |
- Primary: From 45-60
  Secondery: From 31-45,Babies
  Tertiary: From 20-30,Teenagers| -->

### Tech Stack | Technology Stack

**Language**
- [x] HTML
- [x] CSS
- [x] JavaScript
- [x] SQL

**Framework&Libraries** 
- [x] better-sqlite3
- [x] express
- [x] Node.js
- [x] SQLite
- [x] Cors

**Database** 
- [x] Database: SQLite3
- [x] API: MedMind API
- [x] Static Data

**HTML:** TO BUILD THE STRUCTURE OF THE FRONTEND PAGES

**CSS:** TO DESIGN PAGES

**JavaScript:** TO MAKE THE BACKEND STRUCTURE AND THE INTERACTIVE FEATURES ON FRONTEND

**SQL:** 
- HANDLING THE READ AND WRITE OPERATIONS OF DB

**better-sqlite3:**
- CONNECTING BACKEND SERVICES TO THE SQLite database

**express:**
- exposing the backend API endpoints to the frontend 

**Node.js:** 
- RUNTIME TO RUN THE Backend-JS CODE

**SQLite:**
- USING SQL TO MAKE THE DATABASE AND MANAGE THE READ AND WRITE OPERATIONS

**Cors:**
- ALLOWING THE FRONTEND TO MAKE REQUESTS TO THE BACKEND



### Dependencies | المكتبات المستخدمة

| Package | Version | Purpose |
|---------|---------|---------|
| express | 4.22.1 | Web server & APIs |
| better-sqlite3 | 11.10.0 | Database connection |
| @google/generative-ai | 0.24.1 | AI Chatbot |
| cors | 2.8.6 | Frontend-backend connection |
| dotenv | 17.2.4 | Environment settings |

---

## 2. Problem Statement | بيان المشكلة



### What problem does this project solve? | ما المشكلة التي يحلها هذا المشروع؟

many people get sick every day and they don't know what to do so they go to the doctor and waste time and money and they don't know if they're okay or not

### Why does it matter? | لماذا هذا مهم؟

because if they don't go to the doctor they might die and this is the point of MedMind he notice you to prevent you from got sick and gives you the best solution to get better

### How is it currently solved? | كيف تُحل المشكلة حالياً؟

in the past people can not known they are have a disease or not and dont know the symptomps of it and the only way to know is to go to the doctor but don`t know what is the specialaztion they need to go or if they are travel where is the nearest Doctor or Hospital And this What MedMind do they help people to check themeself and know about diseases and Book a Appointment to the doctor or hospital 

---

## 3. Technical Architecture | البنية التقنية

### Project Structure | هيكل المشروع

```
MedMind/
├── backend/                  # Express.js REST API Server
│   ├── server.js             # Main server entry point & route mounting
│   ├── API/                  # Route modules (users, doctors, appointments, chat)
│   ├── Services/             # Business logic & DB access (db.js, Gemini.js, etc.)
│   ├── database/             # SQLite database (app.db, app.sql)
│   └── package.json          # Backend dependencies & scripts
└── frontend/                 # Client-side web application
    ├── index.html            # Main entry point & splash screen
    ├── Pages/                # Application pages (home, Doctors, Hospitals, etc.)
    │   ├── home/             # Homepage & service navigation
    │   ├── Doctors/          # Doctors directory & profiles
    │   ├── Hospitals/        # Hospitals directory
    │   ├── Disease/          # Disease information & symptoms
    │   ├── Appointment/      # Appointment booking flows
    │   ├── Sign in/          # User login
    │   └── Sign up/          # User registration
    ├── api/                  # Frontend API client modules
    └── assets/               # CSS styles & design assets
```

### Architecture Diagram | مخطط البنية

```
[User Browser]
      │
      ▼
[Frontend | HTML / CSS / JS]
      │
      ▼
[Backend | Express.js API Server | PORT 3000]
      │                     │
      ▼                     ▼
[SQLite DB: app.db]    [Google Gemini AI]
```


### Key Files | الملفات الرئيسية

| File | Purpose | Lines of Code |
|------|---------|:-------------:|
| `backend/server.js` | Express server entry point, middleware, and route mounting | ~40 |
| `backend/Services/Gemini.js` | Google Gemini AI integration for 24/7 medical chatbot | ~65 |
| `backend/Services/Appointments.js` | Appointment booking, status management, and queries | ~125 |
| `backend/Services/Users.js` | User authentication, registration, and profile logic | ~150 |
| `backend/database/app.sql` | SQLite database schema, constraints, and seed data | ~210 |
| `frontend/Pages/home/home.html` | Home page UI with service overview and chatbot access | ~80 |



---

## 4. Features & User Flow

### Feature List

| # | Feature | Description | Status |
|---|---------|-------------|:------:|
| 1 | Chatbot | It answers any question you ask about your health and tells you if you are okay or not | ✅ |
| 2 | Doctors | It tells you the nearest doctors and hospitals to you and their prices and you can book an appointment with them | ✅ |
| 3 | Hospitals | It tells you the nearest hospitals to you and their prices and you can book an appointment with them | ✅ |
| 4 | Diseases | It tells you about diseases and how to prevent them and their symptoms | ✅ |
| 5 | Appointments | You can book an appointment with any doctor or hospital you want | ✅ |
| 6 | Profile Picture| That Allow You TO Put a Photo Of You Or A Logo Of Hospital| ⏳ |
| 7 | Live video consultations with doctors|Make Your Chosen Doctor Call You 2 Times in week | ❌ |
| 8 |Online payment|make you pay for the appointment through online| ❌ |

> Status: ✅ Complete | ⏳ In Progress | ❌ Not Started

### User Flow | تدفق المستخدم

```
                      ┌────────────────┐
                      │  LANDING PAGE  │
                      │  (index.html)  │
                      └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │   HOME PAGE    │
                      │   (Main Hub)   │
                      └───────┬────────┘
                              │
         ┌──────────────┬─────┴──────┬──────────────┐
         ▼              ▼            ▼              ▼
   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
   │  CHATBOT  │  │  DOCTORS  │  │ HOSPITALS │  │ DISEASES  │
   │ (AI Test) │  │  (Search) │  │  (Search) │  │  (Info)   │
   └───────────┘  └─────┬─────┘  └─────┬─────┘  └───────────┘
                        │              │
                        └──────┬───────┘
                               ▼
                      ┌────────────────┐
                      │  APPOINTMENTS  │
                      │ (Booking Flow) │
                      └────────────────┘
```

### Screen Reference | دليل الشاشات

| Screen | File / Route | Description | Transitions To |
|--------|--------------|-------------|----------------|
| Landing | `frontend/index.html` | Welcome splash screen with loading animation | Home |
| Home | `frontend/Pages/home/home.html` | Main hub with service cards, quick actions, and chatbot | Doctors, Hospitals, Diseases, Sign in |
| Chatbot | `home.html` (AI Widget) | 24/7 AI medical consultation and symptom checker | Doctors, Hospitals |
| Doctors | `frontend/Pages/Doctors/Doctors.html` | Browse doctors by specialty, location, and fees | Appointments, Home |
| Hospitals | `frontend/Pages/Hospitals/Hospitals.html` | Browse hospitals and available medical care | Appointments, Home |
| Diseases | `frontend/Pages/Disease/Disease.html` | Search diseases, symptoms, and health prevention tips | Home |
| Appointments | `frontend/Pages/Appointment/Appointment.html` | Book an appointment with selected doctor or hospital | Profile, Home |
| Sign In / Up | `frontend/Pages/Sign in/Sign in.html` | User login and new account registration | Home |


---

## 5. UI/UX Design | تصميم واجهة المستخدم

### Screenshots | لقطات الشاشة

<!-- Screenshot: Home Page -->
![alt text](ScreenShots/home.png)
![alt text](ScreenShots/Chatbot.png)
![alt text](ScreenShots/Doctors.png)
![alt text](ScreenShots/Hospitals.png)
![alt text](ScreenShots/Disease.png)
![alt text](ScreenShots/Appointment.png)

### Design System | نظام التصميم

| Element | Style |
|---------|-------|
| **Primary Color** | #1e40af (Blue) / #4f46e5 (Indigo) |
| **Secondary Color** | #059669 (Green) |
| **Font** | 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif |
| **Button Style** | Rounded (8px radius), flat with hover transition |
| **Layout** | Top navigation bar, hero banner, responsive card grid |

### Responsive Design | التصميم المتجاوب

| Breakpoint | Layout | Tested? |
|------------|--------|:-------:|
| Desktop (1024px+) | 4-column card grid, full hero banner, wide layout | ☑ |
| Tablet (768-1024px) | 2-column card grid, adapted spacing & padding | ☑ |
| Mobile (< 768px) | 1-column stacked cards, full-width buttons | ☑ |
---

## 6. Data Sources | مصادر البيانات

<div class="arabic">
هنا تكتب منين جبت الداتا — قاعدة بيانات، API، ملفات، أو داتا مكتوبة في الكود
</div>

### Data Sources | مصادر البيانات

| Source | Type | Description |
|--------|------|-------------|
| SQLite (app.db) | Database | Stores users, doctors, hospitals, appointments |
| Google Gemini | API | Medical chatbot answers |
| User Input | Forms | Login, sign up, appointment booking |

### Database Schema | مخطط قاعدة البيانات

| Table | Columns | Description |
|-------|---------|-------------|
| users | ID, Name, Email, Role, Specialization, Location | User, doctor, and hospital profiles |
| appointments | ID, UserID, ProviderID, AppointmentDate, Status | Booked appointments |
| diseases | ID, Name, description, treatment | Disease information |
| symptoms | ID, Name, Description | Symptom details |

### External APIs (if any) | واجهات برمجة التطبيقات

| API | Purpose | Rate Limit |
|-----|---------|------------|
| Google Gemini AI | Medical chatbot | 15 RPM (free tier) |
---

## 7. Educational Content | المحتوى التعليمي

<div class="arabic">
هنا تكتب المحتوى التعليمي — ماذا يتعلم الطالب من هذا المشروع؟ كيف يتعلق بالمنهج؟
</div>

### Learning Objectives | أهداف التعلم

By the end of this project, the student will be able to:

1. Build a full-stack web application with Node.js and Express
2. Design and query a SQLite database
3. Create a responsive web UI using HTML, CSS, and JavaScript
4. Integrate Google Gemini AI for medical guidance
5. Implement appointment booking and user authentication

### Cultural / Historical Context | السياق الثقافي / التاريخي

| Topic | Description |
|-------|-------------|
| Healthcare Access | Helping people get quick medical guidance from home |
| Digital Health in Region | Connecting patients to local doctors and hospitals |

### Curriculum Alignment | التوافق مع المنهج

| Skill Area | What the Student Practices |
|------------|---------------------------|
| Problem Solving | Solving medical access problems with code |
| Computational Thinking | Database schema design and REST API routing |
| Creativity | UI/UX design and chatbot conversation flow |
| Collaboration | Modular team development and code organization |
| Technical Writing | Documenting APIs, database schema, and project features |

---

## 8. Marketing Plan | خطة تسويقية

> **Short version** — for full marketing plans, use the main Afro-Asian template.

<div class="arabic">
نسخة مختصرة — للخطط التسويقية الكاملة، استخدم القالب الرئيسي
</div>

### Target Audience | الجمهور المستهدف

- **Primary**: Adults & Elderly ages 45–60
- **Secondary**: Adults ages 31–45 and Parents with babies
- **Tertiary**: Young adults ages 20–30 and Teenagers

### Platforms | المنصات

- Web browsers (Chrome, Edge, Firefox)
- Mobile phones & Tablets (Responsive web)
- Desktop computers

### Promotion Ideas | أفكار ترويجية

1. Facebook campaigns focused on our primary target users
2. Weekly email tips about health and disease prevention
3. User reviews and shared experiences for discounts
4. Presentation at the Afro-Asian Tech Forum competition

---

## 9. Student Worksheet | ورقة عمل الطالب


### My Project Information | معلومات مشروعي

**Student Name**: Mohamed Ahmed Ali Zain
**Project Title**: MedMind

**Date**: 2026/9/10

---

#### What is your project about? | عن ماذا يتحدث مشروعي؟

[MedMind هو Medical website بيساعدك تعملcheck بسيط علي صحتك عن طريق الchatbot بتاعنا(MedMind)
 ودا بيساعدك تعمل check دوري كل فتره عشان تطمن طب لو محتاج برضو MedMind موفرلك دكاتره و مستشفيات 
 وبرضو لو حابب تعرف عن المرض نفسه فMedMind
 برضو ف لو حسيت في اي وقت انك مش تمام مش لازم تنزل مخصوص لازم تنزل ولا لا وايه المجالات الي لازم تكشف فيها]

#### What problem does it solve? | ما المشكلة التي يحلها؟

[many people get sick every day and they don't know what to do so they go to the doctor and waste time and money and they don't know if they're okay or not]
---

### My Tech Stack | التقنيات المستخدمة

**My project type**: Web App  

**Technologies I used**:

| Category | Technology |
|----------|-----------|
| Language | HTML, CSS, JavaScript, SQL |
| Framework | Node.js, Express.js |
| Database | SQLite3 |
| Libraries | better-sqlite3, cors, dotenv, @google/generative-ai |

---

### My Screens | شاشات مشروعي

Draw or describe all the screens in your project:

| Screen Name | What the user sees/does | How to get here |
|-------------|------------------------|-----------------|
| Home Page | Main services overview and AI chatbot | Opens on website launch |
| Chatbot | 24/7 AI medical consultation & symptom check | Click Chatbot on Home page |
| Doctors | Browse doctors, specializations, and prices | Click "Doctors" in navbar |
| Hospitals | Browse hospitals and available care | Click "Hospitals" in navbar |
| Diseases | Read disease symptoms and prevention info | Click "Diseases" in navbar |
| Appointments | Book an appointment with a doctor or hospital | Click "Book" on doctor/hospital card |

---

### My Features | ميزات مشروعي

| Feature | What it does | Status |
| 1 | [Chatbot] | 
[It answers any question you ask about your health and tells you if you are okay or not] | ✅ |
| 2 | [Doctors] | 
[It tells you the nearest doctors and hospitals to you and their prices and you can book an appointment with them] | ✅ |
| 3 | [Hospitals] | 
[It tells you the nearest hospitals to you and their prices and you can book an appointment with them] | ✅ |
| 4 | [Diseases] | 
[It tells you about diseases and how to prevent them and their symptoms] | ✅ |
| 5 | [Appointments] | 
[You can book an appointment with any doctor or hospital you want] | ✅ |

---

### My Data | بيانات مشروعي

**Where does data come from?**
Our data come from two things
 First: The Doctors and The Hospitals is a testing data we got them from claude
 Second: The Disease come from World Health Orgainization(WHO)
_______________________________________________

**What data is stored?**
The data that stored in our database is:
 1. Users
 2. Doctors
 3. Hospitals
 4. Diseases
 5. Appointments
_______________________________________________

---

### What I Learned | ما تعلمته

1. The hardest part of building my project was: Connecting the frontend to the backend REST APIs and managing database tables.

2. The most fun part of building my project was: Integrating the Google Gemini AI chatbot and watching it answer medical questions.

3. If I had more time, I would add: Live video consultations with doctors and online payment.

4. One thing I would do differently: Make Whole project have Ai Assisstant
---

### Screenshot of My Project | لقطة شاشة من مشروعي

![alt text](ScreenShots/home.png)

---

<div class="session-footer">
  <p>Techno Kids, Techno Future — Software Documentation Template</p>
  <p>Afro-Asian Tech Forum · Software Category · 2026</p>
</div>
