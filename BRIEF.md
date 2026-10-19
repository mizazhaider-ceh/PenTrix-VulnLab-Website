# PenTrix Website Build Brief (read this first)

You are building a static marketing + docs website for PenTrix-VulnLab.
Work directory: `~/workspace/pentrix-website/`. Output must be pure static
HTML/CSS/JS, no build step, `index.html` at root (GitHub Pages ready).

## ABSOLUTE RULES

1. **No em dashes anywhere.** Not in HTML, CSS, JS, or content. Use commas,
   colons, or parentheses. Grep your files before finishing.
2. **Never expose the lab publicly.** Test instances run on this machine only,
   localhost only. The website itself is static and safe; it never runs the lab.
3. **Disjoint files.** Only write the files assigned to you. Never edit another
   worker's files.
4. **Valid HTML5.** One `<h1>` per page, lang="en", meta viewport, alt text on
   every image.
5. **All links relative.** `install.html`, `quickstart.html`, `docs.html`,
   `assets/img/...`, `assets/css/site.css`. The only absolute URLs are the
   GitHub repo links.
6. **Mobile responsive.** Everything must work at 390px width. No horizontal
   scroll. A reviewer will render your pages at 390px.
7. **Light-only.** No dark mode, no theme switcher.

## DESIGN TOKENS (match the lab exactly)

```css
--clay-canvas:#F4F1FA; --clay-card:#fff; --clay-ink:#332F3A;
--clay-muted:#635F69; --clay-violet:#7C3AED; --clay-pink:#DB2777;
--clay-sky:#0EA5E9; --clay-emerald:#10B981; --clay-amber:#F59E0B;
--clay-well:#EFEBF5; --hairline:rgba(51,47,58,.08);
--font-display:"Nunito",ui-rounded,system-ui,sans-serif;
--font-body:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
--font-mono:ui-monospace,"Cascadia Code","JetBrains Mono",Menlo,Consolas,monospace;
--r-hero:48px; --r-card:32px; --r-med:24px; --r-btn:20px; --r-pill:999px;
```

Shadows (copy exactly):
- Card: `16px 16px 32px rgba(160,150,180,.2),-10px -10px 24px rgba(255,255,255,.9),inset 6px 6px 12px rgba(139,92,246,.03),inset -6px -6px 12px rgba(255,255,255,1)`
- Button: `12px 12px 24px rgba(139,92,246,.3),-8px -8px 16px rgba(255,255,255,.4),inset 4px 4px 8px rgba(255,255,255,.4),inset -4px -4px 8px rgba(0,0,0,.1)`
- Buttons squish on press: `transform:scale(.92)`.

Fonts via Google Fonts (same as the lab):
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Nunito:wght@700;800;900&display=swap" rel="stylesheet">
```

## CSS CONTRACT (class names the CSS worker provides; page builders use these)

`.topbar` (sticky glass nav), `.brand` (with `.orb` logo dot), `.topbar nav a`
(with `[aria-current=page]`), `.wrap` (max-width 1080px content),
`.hero` (with `.cta-row`, `.stats`, `.stat`), `.clay-btn` +
`.clay-btn-primary` / `.clay-btn-secondary` / `.clay-btn-sm`,
`.grid` + `.clay-card` (with `.card-top`, `.orb`, `.tagline`, `.card-foot`,
`.badge-new`), `.card` (plain content card), `.blobs` + `.blob-1/2/3`
(floating background), `.foot` (footer), `code`/`kbd`/`pre` styling,
`table` styling (rounded, striped), `details`/`summary` FAQ styling,
`.step` (numbered step cards for guides), `.warning` (amber callout box),
`.checklist li` styling.

## REQUIRED <head> PER PAGE

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>...</title>
<meta name="description" content="...">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Nunito:wght@700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css">
</head>
```

## NAV (identical on every page)

Home (`index.html`), Install (`install.html`), Quick Start (`quickstart.html`),
Docs (`docs.html`), plus a GitHub button linking to
`https://github.com/mizazhaider-ceh/PenTrix-VulnLab`.
Set `aria-current="page"` on the current page's link.

## FOOTER (identical on every page)

"PenTrix VulnLab is intentionally vulnerable. Run it only on your own machine."
Links: GitHub repo, Install guide, Docs. Credit: "Built by Muhammad Izaz Haider
([@mizazhaider-ceh](https://github.com/mizazhaider-ceh))".

## FACTS (verified from the repo README, use exactly)

- 29 modules, 201 challenges, Express + SQLite, zero build step.
- Flags: `PENTRIX{` + 32 random hex, generated per install on first boot into a
  gitignored SQLite DB. No flag literal in any tracked file.
- Shortcuts earn nothing: bare beacons get 400, token replays get 400.
- 3 kill-chain scenarios: Shop Takeover, API Heist, Ghost in the CMS (staged unlock).
- 3 career paths: Zero to Web Pentester, API Hacker, Authentication Assassin,
  with verifiable PNG certificates (code like `PTX-XXXXXXXX`, bound to the install).
- Break-then-fix mode: patch the bug, the lab re-runs the exploit in a sandbox.
- One-command setup: `docker compose up --build`, open http://localhost:3000.
  Localhost-only binding, healthcheck, drops Linux capabilities, 512M/1 CPU limit.
- Node 20+ for local run. SESSION_SECRET env for shared use.
- Safety: never deploy publicly. Run on your own machine or isolated lab network.
- Comparison table (columns: PenTrix VulnLab, Juice Shop, WebGoat, PortSwigger Academy):
  Challenges: 201 / 100+ / Lesson-based / Extensive.
  Flags random per install: Yes / No / No / N/A.
  Shortcut exploits rejected: Yes / Partial / No / Yes.
  Break-then-fix mode: In development / No / No / No.
  Kill-chain scenarios: Yes, 3 / No / No / Partial.
  Guided career paths: Yes, 3 with certificates / No / Lessons / Yes.
  One-command local setup: Yes / Yes / Yes / Browser only.
  Fully open source: Yes / Yes / Yes / No.
- FAQ answers: safe to run (localhost-only, capability-dropped container, keep off
  shared networks); never deploy to the internet; flags are per-install random;
  no flag? the exploit was not genuine; no Burp needed (curl + browser suffice);
  start with Zero to Web Pentester.
- Demo payload (quickstart): username `admin' -- ` (with trailing space), any password.

## SCREENSHOTS (filenames page builders reference)

`assets/img/shot-home.png`, `shot-sqli-module.png`, `shot-login.png`,
`shot-flag-captured.png`, `shot-scoreboard.png`, `shot-scenarios.png`,
`shot-paths.png`, `shot-certificate.png`.
Desktop renders at 1440px wide. Alt text on every `<img>`.

## SCREENSHOT PIPELINE (for screenshot workers)

A shared lab instance runs at `http://127.0.0.1:3399/` (booted by the
coordinator, fresh DB). Render with:
```bash
curl -s http://127.0.0.1:3399/<page> -o /tmp/shots/<name>.html
~/.local/bin/weasyprint --base-url http://127.0.0.1:3399/ /tmp/shots/<name>.html /tmp/shots/<name>.pdf
pdftoppm -png -r 60 -singlefile /tmp/shots/<name>.pdf ~/workspace/pentrix-website/assets/img/<name>.png
```
The `--base-url` flag is REQUIRED or the CSS will not load. VIEW every PNG
with the read tool before accepting it. If WeasyPrint is missing, reinstall:
`pip install --break-system-packages -q weasyprint`.

Certificate: generate with node, no server needed:
```js
const { renderCertificate } = require('/home/hatch/workspace/pentrix-vulnlab/lib/certpng.js');
const buf = renderCertificate({ pathName: 'Zero to Web Pentester',
  studentName: 'Muhammad Izaz Haider', dateStr: '2026-10-19',
  installFingerprint: 'a3f9c2e14b7d', verifyCode: 'PTX-A3F9C2E1',
  pathId: 'zero-to-web-pentester' });
require('fs').writeFileSync('/home/hatch/workspace/pentrix-website/assets/img/shot-certificate.png', buf);
```
Note: this uses demo fingerprint/code values; the real ones come from the install.

Flag-captured shot: read `~/workspace/pentrix-vulnlab/modules/sqli/challenges/login-bypass.js`
to find the login POST route, POST username `admin' -- ` (trailing space) with any
password via curl, save the response HTML, render it with the pipeline above.
If the POST flow proves too complex, fall back to the plain login page shot and
say so in your report.

Mobile check: render each finished site page at 390px wide with
`@page { size: 390px ... }` (inject a `<style>@page{size:390px 800px}</style>`
into the HTML copy before WeasyPrint). Save to /tmp/mobile-check/, VIEW them,
report any overflow or breakage to the coordinator.

## WORKER FILE ASSIGNMENTS

- CSS worker: `assets/css/site.css` only.
- index.html worker: `index.html` only.
- install.html worker: `install.html` only.
- quickstart.html worker: `quickstart.html` only.
- docs.html worker: `docs.html` only.
- Screenshot worker A: `assets/img/shot-home.png`, `shot-sqli-module.png`,
  `shot-login.png`, `shot-flag-captured.png`, `shot-scoreboard.png`.
- Screenshot worker B: `assets/img/shot-scenarios.png`, `shot-paths.png`,
  `shot-certificate.png`.
- JS worker: `assets/js/site.js` only (copy buttons on `pre` code blocks,
  `aria-current` nav highlighting from URL, smooth anchor scroll). The topbar nav
  wraps gracefully on mobile via CSS (no hamburger needed).
- Page builders: include `<script src="assets/js/site.js" defer></script>` before
  `</body>`, and wrap code samples in `<pre><code>...</code></pre>` so the JS
  worker's copy buttons attach.
- Brand worker: `assets/img/favicon.svg` (clay orb, violet gradient circle)
  and `404.html` (on-brand not-found page).
- Mobile checker: renders only, writes to /tmp/mobile-check/, reports issues.
- Reviewers: read-only, report issues, do not edit.
