# MedMind: Agent Guide

MedMind is a small medical website: an Express + SQLite backend (`backend/`) and a plain HTML/CSS/JS frontend (`frontend/`, no build step). See [README.md](README.md) for what it does, how to run it and its **Limits**.

## The kid-simple rules (keep them in every change)

The code should be readable by a curious 12-year-old, top to bottom. Readability wins over robustness and cleverness. Anything that removes safety or a feature is the user's decision. Ask first, then write it down under **Limits** in the README.

**Code**
- Plain variables and plain functions with verb names (`addUser`, `getPatientAppointments`). Loops and `if`s, not clever one-liners. No classes, no decorators, no generators, no TypeScript.
- One short comment above anything a kid would ask "why?" about, in kid words.
- Constants at the top of the file in CAPITALS, with a comment saying why the number is what it is (`MAX_HISTORY`, `MAX_MESSAGE_LENGTH`, `MIN_PASSWORD_LENGTH`).
- A little repetition is better than an abstraction when it keeps a file readable on its own.

**Libraries**
- The standard library first. The backend has **one** dependency: `express`. A new library must do something plain code cannot do in about 10 lines. Pin versions you tested (no `^`).
- SQLite is `node:sqlite`. The `.env` file is read with `process.loadEnvFile`. Gemini is one `fetch` call.

**Layout**
- Backend: `server.js` (set-up) > `API/api*.js` (routes: check the input, call a service, send the answer) > `Services/*.js` (one small file for each topic, every function runs one query). The schema and demo data are readable text in `database/app.sql`.
- Frontend: one folder for each page in `frontend/Pages/<page>/` (`<page>.html`, `.js`, `.css`). `frontend/api/` has one tiny file for each topic (every function is one `request(...)` call). `frontend/components/` has the header, footer and `helpers.js`.

**Behaviour**
- Check with plain `if`s the things a user can get wrong (empty field, email taken, wrong password, date in the past) and send `{ error: "Friendly message." }`. No try/catch. The pages show the message with `alert`.
- When an outside service has a limit, stay inside it (cap the input) instead of writing retry code.
- Never send a password to the browser. Name the columns in `SELECT`.

**UI**
- Friendly labels, icons on menu items, one main button on each screen.
- Hide what the current user cannot use, instead of showing it and refusing. Visitors may browse. Booking and chat need a sign-in. Only patients can book.

## Names and data
- Database columns and JSON fields are PascalCase (`Name`, `ProviderID`, `Cost`). There are no fallbacks like `a.Name || a.name`.
- Roles: `Patient`, `Doctor`, `Hospital`, `Admin`. Doctors and hospitals are rows in `users` with extra listing columns. An appointment's `ProviderID` is that user's ID, and the provider's type is its `Role`.
- `ApprovalStatus`: `Pending` (waiting for the admin), `Approved`, `Rejected` (rejected means blocked). Patients are approved at sign-up. Doctors and hospitals start `Pending`.
- Deleting a user deletes their appointments (`ON DELETE CASCADE`).

## Commands
| Command | What it does |
|---|---|
| `cd backend && npm install` | Install express |
| `cd backend && npm run db:reset` | Delete `database/app.db` and build it again from `database/app.sql` (needs the `sqlite3` command) |
| `cd backend && npm start` | Start the server on port 3000 (`npm run dev` restarts it when files change) |
| `cd frontend && python3 -m http.server 8080` | Serve the pages (any static server with `frontend/` as its root works) |

## Gotchas
- Node 22.5 or newer is needed (`node:sqlite`).
- `backend/.env` holds the real `GEMINI_API_KEY`. It is git-ignored. Never commit it. `backend/.env.example` shows its shape.
- The pages link to `/Pages/...` and `/assets/...`, so `frontend/` must be the root of its web server.
- There are no tests or linter. Check a change by running the server and clicking through each role (see the demo logins in the README).
- `database/app.db` is committed, so a local run changes it. Run `git checkout backend/database/app.db` (or `npm run db:reset`) before committing if you do not mean to change the data.
