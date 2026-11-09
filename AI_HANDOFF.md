# Aria Edit (آریا ادیت) — AI/Developer Handoff

Persian (RTL) video-editing learning app. Plain HTML/CSS/JS web app in `www/`, wrapped as an Android APK with Capacitor 7. **No framework, no bundler.** Scripts are classic (non-module) and share globals.

## Folder map
- `www/index.html` — the app shell + main inline script. Holds globals `state`, `save()`, `EDITQUEST_CURRICULUM`, and `makeMonth(title, goal, weekTitles, days)`. **Year 1 (months 1–12)** roadmap data lives inline here as `MONTH_N_DAYS` arrays.
- `www/roadmap-y2.js` — **Years 2–4 (months 13–48)**. Defines `window.ARIA_Y2_BUILD(makeMonth)` returning 3 year objects (year 2: m13–24, year 3: m25–36, year 4: m37–48). index.html pushes them into `EDITQUEST_CURRICULUM` right after the array is defined.
- `www/data/lessons.js` — `window.ARIA_LESSONS`, rich lessons/quizzes (keys like `"y0c0m0"` = year0/chapter0/month0). Currently only the first months of year 1.
- `www/lessons-ui.js` + `lessons.css` — lesson & quiz overlay engine.
- `www/app-extras.js` + `extras.css` — overlay extras (achievement card, help, search, backup). Reads globals but never patches the shell.
- `www/auth.js` + `aria-extras.css` — device-only local accounts (PBKDF2-SHA256 hash + salt; not server auth). `www/config.js`: `ARIA_API_BASE=""` means local-only.
- `www/resources.js` — static learning-resource links (allow-listed domains only).
- `www/diag.js` — on-device lag lab (debug). `www/shell.css` — main styles (performance-first rules).
- `www/sw.js` — service worker, caches app shell. `www/feed.xml`, `manifest.webmanifest`, `icons/`, `vendor/` (qrcode, three, fonts).
- `capacitor.config.json` (appId `com.aria.edit`, appName آریا ادیت, webDir `www`), `package.json`.
- `.github/workflows/build-apk.yml` — CI: generates the `android/` project each run (`npx cap add android`), builds **debug APK**, uploads artifact `aria-edit-apk`. `android/` is not committed.
- `tools/validate-roadmap.js` — data validator (run before every release).

## Roadmap data format (years 2–4)
Each month is a const array of exactly **30** strings, each with exactly 3 parts joined by ` | `:
`"آموزش: … | تمرین: … | تحلیل: …"` then `.map(D2)`. Older months use ` / ` with `.map(D)`. Parts must not contain the separator.
Each month is created with `makeMonth(title, goal, [5 week titles], MXX)`: 4 weeks of 7 days + a 5th "روزهای پایانی ماه" group for days 29–30. Months must be listed in order inside `ARIA_Y2_BUILD`, which splits them into years with `slice`.
Day 7/14/21 = weekly review; day 30 = monthly review / graduation.

## Rules for changes
1. Run `node tools/validate-roadmap.js` — must print `OK`.
2. **Bump the cache name in `www/sw.js`** (`aria-shell-vN`) on every release, and list any new top-level file in `SHELL`.
3. Add new script/style files to `index.html` and `sw.js`. Keep overlays self-contained; use `textContent`, not `innerHTML`, for user/content data.
4. Don't store plaintext passwords or send data off-device unless `ARIA_API_BASE` is deliberately configured.
5. Keep the UI RTL-safe and fast on low-end phones (see header of `shell.css`).

## Build the APK
GitHub → Actions → "Build APK" → Run workflow → download artifact. Local: `npm install && npx cap add android && npx cap sync android && cd android && ./gradlew assembleDebug`.

## History / known issues
- Fixed: roadmap month accordion hid days after day 3 (open-state height clipping); height limit is now released after the open animation. Verify on a device after each build.
- Years 2–4 added in `roadmap-y2.js` (years 3–4 in separate year objects). Months 1–12 still use only 4 week titles in `index.html`, so days 29–30 may not appear there — consider giving them a 5th group like the newer months.
- Release APKs need a signing key. The previous published APK's key and package id are **unknown**: the CI builds a debug-signed APK with id `com.aria.edit`, which installs as a separate app (no data carry-over) unless the original id/key are restored.
- Default launcher icon is still used in the Capacitor project; add icon generation (e.g. `@capacitor/assets`) if wanted.
