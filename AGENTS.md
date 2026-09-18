# MedMind Repository — Agent Guide

## Project Overview

MedMind is a medical management platform with a **backend API** (Express + SQLite + Gemini AI) and a **frontend** (plain HTML/CSS/JS, no build tool).

```
MedMind/
├── backend/          # Express.js API server (Node.js ESM, port 3000)
│   ├── server.js     # Entry point, mounts all API routers
│   ├── API/          # Express route modules (apiUsers, apiDoctors, etc.)
│   ├── Services/     # Business logic & DB access (db.js, Users.js, Gemini.js, etc.)
│   ├── database/     # SQLite DB (app.db) + schema (app.sql) + drop.sql
│   └── package.json  # "type": "module", scripts: start, dev, db:reset
└── frontend/         # Static HTML/CSS/JS (no build step)
    ├── Pages/        # Page HTML files (home, Sign in, Sign up, etc.)
    ├── api/          # Frontend API clients (fetch calls to localhost:3000)
    ├── assets/css/   # Global and page-specific styles
    └── index.html    # Loading screen, redirects to /Pages/Home/home.html
```

## Setup

1. **Install backend dependencies**: `cd backend && npm install` (no `node_modules` exists yet)
2. **Start the backend**: `cd backend && npm run dev` (uses `node --watch server.js` for auto-reload)
3. **Frontend**: Open `frontend/index.html` in a browser, or serve `frontend/` statically. The frontend calls the backend at `http://localhost:3000`.
4. **The backend must be running before the frontend can make API calls.**

## Key Commands

| Command | Description |
|---|---|
| `cd backend && npm install` | Install dependencies |
| `cd backend && npm run dev` | Start dev server with file watching |
| `cd backend && npm start` | Start production server |
| `cd backend && npm run db:reset` | **BROKEN** — references missing `database/reset.js`. Use `drop.sql` then `app.sql` instead: `sqlite3 database/app.db < database/drop.sql && sqlite3 database/app.db < database/app.sql` |

## Architecture Notes

- **Backend uses ES modules** (`"type": "module"` in package.json). All imports must use `.js` extensions.
- **Express app** (`server.js`) mounts 9 API routers from `backend/API/`. Each router delegates to a service in `backend/Services/`.
- **Database**: SQLite via `better-sqlite3`. Connection is in `backend/Services/db.js`. DB path: `backend/database/app.db`. WAL mode and foreign keys are enforced. `server.js` calls `dotenv.config()` to load `.env`.
- **Gemini AI**: `backend/Services/Gemini.js` loads `GEMINI_API_KEY` from `.env` and uses model `gemini-2.5-flash`. The chat endpoint is `POST /chat`.
- **Auth flow**: Login at `POST /users/login` returns user data (minus password). Frontend stores user in `localStorage` via `frontend/api/auth-api.js`.
- **User roles**: `Patient`, `Doctor`, `Hospital`, `Admin`. Users start with `ApprovalStatus: 'Pending'` and need admin approval (`PATCH /admin/users/:id/approve`) before logging in.
- **Simplified database schema**: 6 tables — `users` (with nullable role-specific columns), `symptoms`, `diseases`, `appointments`, `usersymptoms`, `symptomdiseases`. `doctors` and `hospitals` tables were eliminated; role-specific data (`Specialization`, `Location`, `cost`, `About`, `Img`, `Services`) is stored directly in `users`. `appointments` uses `ProviderID` + `ProviderType` instead of `DoctorID`/`HospitalID`. See `BUGS.md` for details.

## Important Gotchas

- **`.env` contains a real `GEMINI_API_KEY`** but `.gitignore` only ignores `node_modules`. Do NOT commit `.env`.
- **`db:reset` npm script is broken** — `database/reset.js` does not exist. To reset the DB, run the `drop.sql` then `app.sql` scripts against `app.db`.
- **No `.env.example`** exists. If you need to share the project, provide the `.env` structure manually.
- **No linting, typechecking, or testing infrastructure** is configured. There are no test files, no linter config, no CI workflows.
- **No root-level `package.json` or lockfile** — all npm commands must be run from `backend/`.
- **Frontend API clients all use `const baseUrl = 'http://localhost:3000'`** — this is hardcoded. Change it if the backend runs on a different port.
- **Database schema**: Column names use PascalCase in SQL (`Name`, `Email`, `UserID`), but API responses may use camelCase or PascalCase inconsistently. Frontend API clients handle both via fallback logic (e.g., `doctor.Name || doctor.name`).
- **Plaintext passwords**: Passwords are stored and compared as plaintext in `Users.js`. No hashing is implemented. This is a known security issue.
- **Appointment creation**: Use `ProviderID` and `ProviderType` (`'Doctor'` or `'Hospital'`) instead of the old `DoctorID`/`HospitalID`.
- **`Services/Hospitals.js` does not exist** — all hospital/doctor functions are in `Services/Doctors.js`.
- **`Diseases.js` symptom linking**: `createdisease` and `updatedisease` accept `symptoms` as a comma-separated string parameter. This is parsed by `_linkSymptomsToDisease` helper.
- **`Appointments.js` service**: `createAppointment(UserID, ProviderID, ProviderType, AppointmentDate, Status)` — takes `ProviderID` and `ProviderType`, NOT `DoctorID`/`HospitalID`.
- **`Doctors.js` service**: `getDoctorByUserId(ID)` and `getHospitalByUserId(ID)` query by `ID` column (not `UserID` which no longer exists in `users`). `createDoctor(ID, ...)` and `createHospital(ID, ...)` take `ID` as first param.
- **`apiUsers.js`**: `updateHospitalProfile` uses `Img` (PascalCase), not `img`.
- **Frontend `Appointment-api.js`**: `mapAppointment` maps `providerType` from `apt.ProviderType`. Backend SQL returns `p.Role as ProviderType`.
- **Frontend `Sign up.js`**: Uses `user.Img` (PascalCase) to match backend.
- **Frontend `auth-api.js`**: `createUser` passes the full `user` object including `Img` to the backend.
- **Frontend `doctors-api.js` and `Hospitals-api.js`**: Return `id`, `name`, `img`, etc. — no `userId` field.
- **Frontend `profile.js`**: `createAppointmentCard` uses `appointment.providerName` and `appointment.providerType`. `loadPatientAppointments` filters by `a.userId`.
- **Frontend `Appointment-Doc.js` and `Appointment-hos.js`**: Call `createAppointment(currentUser.id, providerId, 'Doctor'/'Hospital', dateTime, status)`.

## Frontend Bug Fixes Applied

### Critical bugs fixed:
1. **`Appointment-Doc.js`**: Was calling `createAppointment(email, doctorId, null, dateTime, status)` with wrong API signature. Now uses `createAppointment(currentUser.id, doctorId, 'Doctor', dateTime, status)`.
2. **`Appointment-hos.js`**: Same issue. Now uses `createAppointment(currentUser.id, hospitalId, 'Hospital', dateTime, status)`.
3. **`doctors-api.js`**: Had `userId: doctor.UserID || doctor.userId || null` referencing non-existent field. Removed `userId` mapping.
4. **`Hospitals-api.js`**: Same issue. Removed `userId` mapping.
5. **`profile.js`**: `createAppointmentCard` referenced `appointment.doctorName`/`appointment.hospitalName` (non-existent). Changed to `appointment.providerName`/`appointment.providerType`.
6. **`Sign up.js`**: Used `user.img` (camelCase). Changed to `user.Img` (PascalCase).
7. **`apiUsers.js`**: `updateHospitalProfile` used lowercase `img` instead of `Img`.
8. **`Doctors.js` service**: `createDoctor`/`getDoctorByUserId`/`upsertDoctorProfile` queried `UserID` column which no longer exists. Changed to query `ID`.
9. **`Hospitals.js` service**: Same `UserID` → `ID` fix.
10. **`Appointments.js` service**: `createAppointment` had wrong signature `(UserID, DoctorID, HospitalID, ...)`. Changed to `(UserID, ProviderID, ProviderType, ...)`. `updateAppointment` same fix. SQL queries return `ProviderType` instead of `ProviderRole`.
11. **`apiDoctors.js`**: `POST /doctors` passed `UserID` to `createDoctor`. Changed to `ID`.
12. **`apiHospitals.js`**: `POST /hospitals` passed `UserID` to `createHospital`. Changed to `ID`.
13. **`Doctors.js` page**: `createDoctorCard` filter used `doc.userId`. Changed to `doc.id`.
14. **`Hospitals.js` page**: Same fix.

## Current Status
- All backend and frontend files compile successfully (`node --check` passes).
- Server verified end-to-end: doctor profiles, hospital profiles, appointment creation, and appointment retrieval all work correctly.
- `ProviderType` is now correctly `"Doctor"` or `"Hospital"` in appointment responses.

## Frontend Structure

- `frontend/Pages/` contains subdirectories for each page (home, Sign in, Sign up, Doctors, Hospitals, Disease, Appointment, etc.)
- Each page has its own `.html`, `.js`, and `.css` files
- `frontend/api/` contains JS modules (`auth-api.js`, `chat-api.js`, `doctors-api.js`, `Appointment-api.js`, `Disease-api.js`, `Hospitals-api.js`) that call the backend
- `frontend/index.html` has a loading screen that redirects to `/Pages/Home/home.html` after 1 second
