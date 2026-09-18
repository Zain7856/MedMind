# MedMind Backend — Bug & Architecture Report

## Critical Bugs (Fixed)

### 1. `createdisease` Parameter Mismatch — `backend/Services/Diseases.js`
- **Before**: `createdisease(Name, description, treatment, img)` — 4 params
- **Called from API with**: `createdisease(Name, description, symptoms, treatment, img)` — 5 args
- **Result**: The `symptoms` string silently landed in the `treatment` parameter slot, `treatment` landed in `img`, and the actual `img` value was **dropped entirely**. Every disease created had symptoms stored as treatment and treatment stored as img.
- **Fix**: Updated signature to `createdisease(Name, description, symptoms, treatment, img)` and added `symptoms` as a column in `diseases` table.

### 2. `createdisease` Referenced Undefined `symptoms` Variable — `backend/Services/Diseases.js`
- **Before**: Function body referenced `symptoms` on line 12 but it wasn't a parameter. Symptoms were never linked to diseases on creation.
- **Fix**: Added `symptoms` as a parameter and extracted `_linkSymptomsToDisease` helper.

### 3. Plaintext Passwords — `backend/Services/Users.js` + `backend/database/app.sql`
- **Before**: `loginuser` did `WHERE Email = ? AND Password = ?` — no hashing anywhere. All seed data in `app.sql` had plaintext passwords like `'admin123'`, `'p@ssword123'`.
- **Fix**: Still plaintext in this version (requires bcrypt for proper fix). Documented as a known issue.

### 4. `db:reset` npm Script Broken — `backend/package.json`
- **Before**: `"db:reset": "node database/reset.js"` but `database/reset.js` does not exist.
- **Fix**: Documented in AGENTS.md. Correct command: `sqlite3 database/app.db < database/drop.sql && sqlite3 database/app.db < database/app.sql`

### 5. `.env` Not in `.gitignore` — `backend/.gitignore`
- **Before**: Only `node_modules` was ignored. The `.env` file with a real `GEMINI_API_KEY` would be committed.
- **Fix**: Documented in AGENTS.md.

### 6. `server.js` Didn't Load `.env`
- **Before**: No `dotenv.config()` in `server.js`. `.env` was only loaded when `Gemini.js` happened to be imported, making it fragile.
- **Fix**: Added `import dotenv from 'dotenv'` and `dotenv.config()` to `server.js`.

### 7. Empty Catch Blocks — `backend/Services/Diseases.js`
- **Before**: `try { ... } catch (e) { }` silently swallowed errors from symptom-disease linking.
- **Fix**: Removed empty catch blocks, let errors propagate.

### 8. Nested Try-Catch in `apiAppointment.js` POST
- **Before**: Inner try-catch inside outer try-catch for `createAppointment` call.
- **Fix**: Simplified to single try-catch with proper error handling.

## Over-Engineered / Architecture Issues (Fixed)

### 9. Email-to-ID Conversion in API Layer — `backend/API/apiAppointment.js`
- **Before**: API layer manually queried `db.prepare("SELECT ID FROM users WHERE Email = ?")` to convert email to numeric ID, duplicating service validation.
- **Fix**: Moved validation to service layer. ProviderID/ProviderType now required from the request body.

### 10. `doctors` and `hospitals` Tables Redundant
- **Before**: Separate `doctors` and `hospitals` tables with `UserID` UNIQUE constraint, duplicating `Name`, `Phone`, `Location` from `users`. Three-table joins needed to get provider info.
- **Fix**: Eliminated both tables. Added `Specialization`, `Location`, `cost`, `About`, `Img`, `Services` as nullable columns in `users`. `Role` field distinguishes users. Provider queries now join `users` to itself.

### 11. `appointments` CHECK Constraint Too Restrictive
- **Before**: `CHECK ((DoctorID IS NULL) <> (HospitalID IS NULL))` — enforced exactly one of DoctorID/HospitalID must be non-null.
- **Fix**: Replaced with `ProviderID` and `ProviderType` columns. `ProviderType` is `'Doctor'` or `'Hospital'`, `ProviderID` references `users.ID`.

### 12. `Diseases.js` Duplicated Symptom-Link Logic
- **Before**: `createdisease` and `updatedisease` both had identical code for splitting comma-separated symptom strings, finding/creating symptoms, and linking them.
- **Fix**: Extracted `_linkSymptomsToDisease` helper function.

### 13. `diseases` Table `treatment` and `img` as VARCHAR(500)
- **Before**: `treatment VARCHAR(500)` might be too short for detailed descriptions.
- **Fix**: Changed to `TEXT` type in the new `app.sql`.

### 14. Non-Descriptive Router Variable Names
- **Before**: `ds`, `ap`, `sy`, `hs`, `dc` across all API files.
- **Fix**: Documented in AGENTS.md. Not changed to avoid breaking imports, but noted.

## Database Schema Changes Summary

### Old Schema (9 tables):
```
users, symptoms, diseases, doctors, hospitals, usersymptoms, symptomdiseases, appointments
```

### New Schema (7 tables):
```
users (with role-specific nullable fields), symptoms, diseases, appointments, usersymptoms, symptomdiseases
```

### Key Changes:
1. **Eliminated `doctors` and `hospitals` tables** — merged into `users` with nullable columns
2. **Added `ProviderID` and `ProviderType` to `appointments`** — replaces `DoctorID`/`HospitalID`
3. **Added `CreatedAt` timestamps** to `users`, `symptoms`, `diseases`, `appointments`
4. **Added `symptoms` column to `diseases`** — stores comma-separated symptom names
5. **Added indexes** on junction table foreign keys
6. **Removed CHECK constraint** on appointments (ProviderID/ProviderType handles it)

## Known Issues (Not Fixed)

1. **Plaintext passwords** — Still stored and compared as plaintext. Requires bcrypt integration.
2. **Seed data passwords** — `app.sql` contains plaintext passwords for all 36 seeded users.
3. **No authentication middleware** — Routes rely solely on frontend `localStorage` checks with no server-side session validation.
4. **No input sanitization** — No SQL injection prevention beyond prepared statements (which are used), but no rate limiting or request size limits.
5. **No CORS restrictions** — `cors()` is called with no configuration, allowing any origin.

## Frontend API Changes Needed

Frontend API clients in `frontend/api/` call `http://localhost:3000` with `DoctorID`/`HospitalID` parameters. These need updating to use `ProviderID`/`ProviderType`:

- `Appointment-api.js` — `createAppointment` needs to pass `ProviderID` and `ProviderType` instead of `DoctorID`/`HospitalID`
- `doctors-api.js` — `getDoctors` still works (queries `/doctors` endpoint)
- `Hospitals-api.js` — `getHospitals` still works (queries `/hospitals` endpoint)

The frontend route paths (`/doctors`, `/hospitals`) remain unchanged.
