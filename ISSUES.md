# MedMind: Issues

The issue tracker for this repository. Fixed things are not listed (see `git log`).
Tags: `feature`, `bug`, `refactor`, `docs`, `performance`.

## Open

### 1. [feature] Serve the frontend from the Express server
Today there are two servers (the API on port 3000 and a static server for `frontend/`), plus CORS. One `express.static("../frontend")` line would give one command and one address, and `frontend/api/request.js` could use plain paths like `/doctors`. Planned for a later branch.

### 2. [bug] The Gemini key in `backend/.env` is rejected
Google answers `API key not valid` (400) for the key currently in `backend/.env`, so the chat shows "The assistant is busy". Make a new key at https://aistudio.google.com/apikey and put it in `backend/.env`. (The chat code itself was tested against a pretend Gemini.)

### 3. [feature] Real log-in on the server
Passwords are plain text and the server trusts the browser (see README **Limits**). If real data is ever stored: hash passwords (`node:crypto` `scrypt`) and have the server check who is asking (a random token saved when the user signs in).

### 4. [bug] Phone menu button is hidden
`frontend/assets/css/global.css`: `.hide-desktop` is hidden in both media queries, so the three-line menu button never shows on phones, and the menu has no way to open there. The `min-width: 769px` block should hide `.hide-desktop` only, and the `max-width: 768px` block should not.

### 5. [refactor] Tidy the stylesheets
- Collapse the 6 different breakpoints (600/700/768/769/900/1000) to 3.
- Replace the 280 hard-coded colours with the tokens in `:root`.
- `frontend/Pages/sign-in/sign-in.css` and `sign-up.css` share 9 identical blocks. Move them to one `auth.css`.
- Scope the `.btn` rule in `components/Header/header.css` to `.header .btn` (it leaks into every page).
- Delete the unused classes (`.btn-ghost`, `.flex-center`, `.flex-col`, `.hide-mobile`, `.mb-3`, `.mt-3`, `.hidden`, `.appointment-date`, `.appointment-meta`, `.profile-link`).

### 6. [feature] Accessibility
Visible `:focus-visible` outlines (the global `outline: none` removed them), `role="tab"` / `aria-selected` on the admin tabs, a `prefers-reduced-motion` block, and `h1` then `h2` (not `h3`) in the card lists.

### 7. [feature] Visual refresh
Try three visual directions on the home page and roll the winner out to the other pages. The home page already has the new split hero, stats bar and four tiles.

### 8. [feature] Filter doctors by specialization (and rate)
From `tasks.txt`. Pagination comes later.

### 9. [refactor] Profile photo key
The photo is saved in `localStorage` under the user's email, so changing your email loses it. Use the user's ID.

### 10. [feature] Stop double booking
Two patients can book the same doctor at the same minute (see README **Limits**).
