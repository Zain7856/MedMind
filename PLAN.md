# MedMind — UI/UX Refresh Plan

Status: draft for discussion
Scope: frontend only (`frontend/`). Backend changes limited to issue 9's `PatientPhone` gap.

## Decisions locked

| Question | Decision |
|---|---|
| UI/UX skill | None installed — use `prototype` skill (UI.md branch) to explore directions |
| Scope | Whole site, foundations first |
| Colour palette | Keep navy `#1e40af` / teal `#059669`, refine only |
| Dark mode | Out of scope (would require tokenising first) |
| Contact + Government pages | Delete (unreachable, 0-byte CSS, no content) |
| Logged-out nav | Public may browse; gate actions only |
| Aesthetic scope of foundations | Structural only — no palette/type decisions |

## Principles

1. **Foundations before aesthetics.** Breakpoints, dedup, focus states and token
   mapping are aesthetic-agnostic. Palette and type-scale waits for the prototype
   verdict, so no work is thrown away.
2. **Real data over filler.** Replace invented content ("Helping patients with
   heart health and prevention") with counts and records from the API.
3. **Every interactive element is keyboard-reachable** with a visible focus ring.
4. **Simple implementation.** Prefer deleting to abstracting. The codebase has no
   build step and should keep working when opened directly.

---

## Issue breakdown

Parent: *UI/UX refresh: foundations, visual direction, and dead-code cleanup*

### Batch A — deletions and auth flow (no visual consequence)

**A1. Delete unreachable pages**
- Remove `frontend/Pages/contact_us/` (Contact.css, Contact.html, Contact.js)
- Remove `frontend/Pages/Government/` (Government.css, Governments.html, Government.js)
- Drop the `btn-contact` block at `frontend/Pages/home/home.js:20-25`
- Drop `assets/css/global.css:143` `.hide-mobile` rule (only consumer was removed)

**A2. Public browsing, gated actions**
- `Pages/Doctors/Doctors.js:6-8`, `Pages/Hospitals/Hospitals.js:6-8`,
  `Pages/Disease/Disease.js:7-9` — remove the `requireAuth()` + `throw` gate
- `Pages/Appointment/Appointment-Doc.js:7-8` and the `Appointment-hos.js` twin —
  render for anyone, gate at submit. `Appointment-Doc.js:117-122` currently shows
  *"Please fill in all required fields"* when `userId` is null, which is
  misleading; becomes *"Sign in to book"* with a link to sign in
- `Pages/Get Started/chat.js:7-9` — keep gated but redirect with a return path
  instead of throwing, so the user returns to the chat after signing in

### Batch B — design foundations (highest risk, touches every stylesheet)

- Collapse 7 breakpoints (600/700/768/769/900/1000) across 17 media queries to 3
- `.container` — single definition in `global.css:82`; delete dead override at
  `Pages/Disease/Disease-info.css:29`
- Scope `components/Header/header.css:175` `.btn` → `.header .btn`; it currently
  leaks onto every page and wins the cascade only by injection order
- Repair `assets/css/global.css:142-148` — `.hide-desktop` is hidden in *both*
  queries; the `min-width:769px` block should target `.hide-mobile`
- Delete 10 dead classes: `global.css` `.btn-ghost` `.flex-center` `.flex-col`
  `.hide-mobile` `.mb-3` `.mt-3`; `profile.css` `.appointment-date`
  `.appointment-meta`; `header.css` `.profile-link`

### Batch C — accessibility and dedup

- Restore `:focus-visible` (replaces the deleted `outline: none` at
  `global.css:131-134`); add styles for buttons and links, which have none
- Add `prefers-reduced-motion` block; `transition: all` at `global.css:100` is
  over-broad
- Add `role="tab"` / `aria-selected` to admin tabs (`profile.html:176-177`)
- Style `.admin-tab-content` (used at `profile.html:180,186`, defined nowhere)
- Fix `h1 → h3` skips in generated cards: `Doctors.js:38`, `Hospitals.js:38`,
  `Disease.js:36`, `profile.js:453`
- Extract shared `auth.css` — 9 byte-identical blocks split across
  `Pages/Sign in/Sign in.css` and `Pages/Sign up/Sign up.css`
- `explore-card` is `role="button" tabindex="0"` (`home.html:49-66`) but
  `home.js` binds only `.onclick`, so keyboard users can focus but not activate.
  Add a keydown handler; `.feature-card` has neither role nor focus style.

### Batch D — tokenise colours

- Map 280 hardcoded hex values onto existing tokens where an exact match exists
- Add tokens for genuine new colours (greys, status colours)
- Palette values do not change

### Batch E — prototype: three visual directions

Sub-shape A per the `prototype` skill: variants on the **existing**
`/Pages/home/home.html` route behind `?variant=A|B|C`, keeping the real
`loadHeader()`/`loadFooter()` so the variants butt up against the live app.
Three *structurally* different directions, no shared `<Layout>`. Shared
`PrototypeSwitcher` pill, `←`/`→` keys, URL-synced, gated out of production.
Winner folds into the real page; full variant set goes to a throwaway branch.

### Batch F — rollout and remaining bug fixes

- Apply the winning direction to Doctors, Hospitals, Diseases, Disease-info,
  chat, Profile (4 role dashboards), Sign in/up, About
- Backend: `GET /appointments` must return `PatientPhone`/`PatientAge`, which
  `Appointment-api.js:13-14` already maps but the query never selects. Until then
  `profile.js:476-483` shows `N/A` for every patient.
- `profile.js:278` reads `hos.img`; the endpoint does `SELECT *`, which returns
  `Img`. Correct is `hos.Img`, matching `profile.js:199`.
- `Doctors.js:56` `about.textContent = doctor.about` renders literal
  `"undefined"` when empty; add `|| 'Not provided'` like lines 48 and 52
- Delete dead stubs: `auth-api.js:97 getUsers()`, `auth-api.js:102
  getUserById()`, `Appointment-api.js:98 getAppointmentById()`
- Delete `Disease.js:48-50` leftover `console.log`; `Sign in.js:18` unused `user`
- Merge `Appointment-Doc.js` / `Appointment-hos.js` — 75% identical, lines 47-114
  are a verbatim copy
- Unify currency: `$${doctor.cost}` (`Doctors.js:71`) vs `' L.E'` (`profile.js:190`)
- `header.js:185-190` duplicates logout instead of calling `auth-api.logout()`
- Move the profile-pic out of `localStorage` keyed by email (`profile.js:59`) —
  editing your email orphans it

---

## Home page — problems found

1. **"What you can do" and "Explore" say the same thing twice.** Eight cards
   convey four ideas: features are Diseases/Hospitals/Chat/Doctors, explore is
   Get Started/Diseases/Hospitals/Doctors.
2. **Everything is the same card.** `.feature-card` (`home.css:61`) and
   `.explore-card` (`home.css:89`) are byte-identical apart from hover.
3. **The banner is unused.** `imgs/banner.png` is 1600×640, 1034 KB, referenced
   nowhere.
4. **The hero is off-palette.** `home.css:13` is indigo→violet
   (`#4f46e5 → #7c3aed`) against navy/teal tokens; `index.html:16` matches it.
5. **No credibility signals.** Real doctor/hospital/disease counts exist in the
   database and are surfaced nowhere.
6. **Weak CTA.** "Sign Up" sits once, at the very bottom. The hero's only button
   is "Get Started", which requires login.
7. **`min-height: 100vh`** on `.home-container` (`home.css:3`) plus a grey
   `#f5f5f5` field that fights the white cards.
8. **Filler copy.** "Helping patients with heart health and prevention." tells a
   visitor nothing.

## Home page — decisions locked

**Banner: split hero, image right.** Text sits on solid navy; the banner gets its
own framed panel beside it. No scrim required, so the photo stays fully legible,
and it stacks cleanly on mobile.

Two measured constraints drive this:

- Mean luminance is **182/255** — the asset is light, so white text over it is
  unreadable without a heavy overlay. Beside the text, no scrim is needed at all.
- It ships as **PNG at 1034 KB**, wrong format for a photographic asset.
  Re-encoding to **JPEG q82 gives 115 KB** (9× smaller, no visible loss); an
  800px-wide mobile variant is **48 KB**. Re-encode as part of this batch.

**Services: bento grid with uneven tiles.** Diseases is the core feature and gets
the largest tile; Chat AI, Find a Doctor and Hospitals follow at decreasing
size. Tile size carries hierarchy, so no new colours or assets are needed. The
duplicate "Explore" section is deleted rather than restyled.

**Trust bar: real counts from a new endpoint.** Add `GET /stats` returning doctor,
hospital and disease counts from SQLite. The frontend already fetches all three
lists elsewhere, so the data exists and is simply unaggregated.

### Target structure

| # | Section | Notes |
|---|---|---|
| 1 | Hero | Split; navy text block left, framed banner right. Two CTAs: primary "Get Started", secondary "Sign Up" |
| 2 | Trust bar | Live counts from `GET /stats` |
| 3 | Core services | Bento grid, 4 uneven tiles. Replaces both old sections |
| 4 | How it works | 3 steps |
| 5 | Final CTA | Sign-up panel |

Also in this batch: hero gradient `#4f46e5 → #7c3aed` → navy `#1e40af` so it stops
clashing with the header and footer; drop `min-height: 100vh` and the
`#f5f5f5` field; replace filler copy with real content.

---

## Delegation

`ui` lane — `opencode`, `opencode/big-pickle`, variant `high`. Each batch gets a
file-and-line-precise brief and lands **uncommitted** for review.

## Verification

Run independently after each batch — never trust the implementer's self-report:

- Full asset crawl: 12 pages, zero 404s
- Breakpoints render correctly at 640 / 768 / 1024
- No leftover `console.log` from OpenCode
- Token count fell and hardcoded hex count dropped
- Keyboard-only pass: every card and control reachable and activatable
