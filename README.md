# MedMind

MedMind is a small medical website. Anyone can read about diseases, tick the symptoms they have to see which diseases match, and look through doctors and hospitals. People who sign in can chat with an AI assistant and book appointments.

## What you can do

| Who | What |
|---|---|
| Anyone | Browse **diseases** (click a symptom to learn more), use the **symptom checker**, look through **doctors** and **hospitals** |
| Patient | Book a doctor or hospital, see and cancel your own bookings, chat with the **AI assistant** |
| Doctor / Hospital | Edit your listing, see who booked you, confirm or cancel bookings (you must be approved by the admin first) |
| Admin | Approve or reject new doctors and hospitals, reject or delete any user, add / edit / delete diseases and symptoms |

Everybody can edit their own profile, change their password and delete their account.

## How it works

```
Browser (frontend/, plain HTML + CSS + JavaScript)
    |  fetch("http://localhost:3000/...")
    v
backend/server.js  (Express, port 3000)
    |-- API/       one file for each topic. A route checks the input and calls a service.
    |-- Services/  one file for each topic. Every function runs one SQL query.
    |       |-- database/app.db  (SQLite file, made from database/app.sql)
    |       `-- Gemini.js -> Google Gemini (the AI assistant)
```

- **Frontend:** one folder for each page in `frontend/Pages/`. `frontend/api/` has one tiny file for each topic that talks to the server. `frontend/components/` has the header and footer. There is no build step.
- **Backend:** `API/` receives the request, `Services/` talks to the database. Errors a person can cause (empty field, wrong password, email already used) are plain `if` checks that send back a friendly message.
- **Database:** 5 tables: `users` (patients, doctors, hospitals and the admin all live here), `symptoms`, `diseases`, `symptomdiseases` (which symptom belongs to which disease) and `appointments`. See [DB_DIAGRAMS.md](DB_DIAGRAMS.md).
- **Symptom checker:** counts, for each disease, how many of the ticked symptoms it has, and shows the highest count first.

## Run it

You need **Node.js 22.5 or newer** (it has SQLite built in) and the `sqlite3` command (only to reset the database).

```bash
cd backend
npm install
cp .env.example .env        # then put your Gemini key into .env
npm run db:reset            # makes database/app.db with demo data
npm start                   # server on http://localhost:3000
```

Then serve the `frontend/` folder as the root of a web server. For example, in another terminal:

```bash
cd frontend
python3 -m http.server 8080   # then open http://localhost:8080
```

(The VS Code *Live Server* extension works too, with `frontend/` as the root.)
If the server runs somewhere other than `http://localhost:3000`, change `BASE_URL` in `frontend/api/request.js`.

Free Gemini key: https://aistudio.google.com/apikey

### Demo logins

| Role | Email | Password |
|---|---|---|
| Admin | admin@medmind.com | admin123 |
| Patient | omar@example.com | p@ssword123 |
| Doctor | dromarali@medmind-doc.com | password123 |
| Hospital | citygeneralhospital@medmind-hos.com | password123 |

### Reset the data

`npm run db:reset` (in `backend/`) deletes `database/app.db` and builds it again from `database/app.sql`. Add or change diseases and symptoms in the admin's profile page, or edit `app.sql` and reset.

## Deploy it

1. Copy the project to a computer with Node.js 22.5+ and run the "Run it" steps there.
2. Put the `frontend/` folder on any static web host (or the same machine).
3. Change `BASE_URL` in `frontend/api/request.js` to the address of your server, and serve the pages from the root of their address (the pages link to `/Pages/...` and `/assets/...`).

## Limits

This is a learning project. These things were left out on purpose, to keep the code short and easy to read:

- **Passwords are stored as plain text.** Anybody who can open `app.db` can read them. The demo passwords are in `app.sql`.
- **The server does not check who is asking.** The pages hide what you may not use, but anyone who calls the server directly (for example with `curl`) can do anything an admin can. Do not put real patient data in it.
- **A person who is signed in is remembered only in their browser** (`localStorage`). If they change their data somewhere else, the browser does not know until they sign in again.
- **Profile photos are saved in your browser only,** so they do not follow you to another device. Doctors' and hospitals' listing photos are links.
- **The database is made by hand** with `npm run db:reset`, which needs the `sqlite3` command. Resetting deletes everything, including bookings people made.
- **The frontend and backend are two servers.** The backend allows any website to call it (CORS `*`).
- **The AI assistant uses one Gemini model (`gemini-2.5-flash`) and does not retry.** If Google is busy or over its free limit, the person sees "The assistant is busy" and tries again later. A message can be at most 1000 characters and only the last 20 messages of a chat are sent.
- **The server does not handle network or database crashes.** Only mistakes a person can make get a friendly message. Anything else becomes a plain "500" error.
- **An account is "blocked" by rejecting it.** Rejecting does not cancel the user's bookings.
- **Booking is first come, first served.** Nothing stops two patients from booking the same doctor at the same time.
- **The admin account cannot be deleted or rejected,** and only patients can book.
- **Only English.**
