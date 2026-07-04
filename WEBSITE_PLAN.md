# Saptari Next — Website Plan

A phased plan for building the campaign's digital home: publishing platform, research library, progress tracker, and campaign management system. The Manual's four pillars (Project, Program, Poll, Publication) are the site's organising logic.

## What exists today

- **saptarinext.vercel.app** — the earlier Next.js vision site (six-theme framing, founder note). Its content has been folded into this build as "focus areas" and campaign stories.
- **This build (v1)** — a complete bilingual (EN/NE) site in the `website/` folder: 8 public pages + admin dashboard + Supabase schema. Runs in demo mode until the database is connected.

## Site map (v1 — built)

| Page | Purpose |
|---|---|
| Home | Vision 2030/40/50, four pillars, focus areas, district stats, stories |
| About | Campaign identity, partnership approach, roadmap, **convener profile (Sanjog Dev)** |
| District Profile | Module 1 & 2 headline data: geography, people, municipalities, economy |
| Library (Open Source) | Manual (EN/NE), profile modules, maps, research archive, CC BY-SA policy |
| Progress | Public project tracker with pillar filters, progress bars, published updates |
| Report & Request | Citizens/researchers submit progress reports, issues, data, material requests |
| Get Involved | Join / Contribute / Adopt / Inform + registration form |
| Admin (`/admin/`) | Login-protected dashboard: manage projects, publish updates, review reports and registrations |

## Architecture

- **Frontend:** plain HTML/CSS/JS — deliberately framework-free so anyone in the office can edit a page with a text editor. Shared header/footer and the EN⇄NE toggle are injected by `assets/js/app.js`; translations live in one file (`assets/js/i18n.js`).
- **Backend:** Supabase (free tier) — Postgres + auth + row-level security. Tables: `projects`, `updates`, `reports`, `members`. Public can read projects/updates and submit reports/registrations; only signed-in admins can do anything else.
- **Hosting:** Vercel (replaces/updates the current deployment) or GitHub Pages; later attach `saptarinext.com`.
- **Open source:** publish the repo on GitHub under CC BY-SA 4.0 (content) / MIT (code) — link from the Library page.

## Phase 2 — Go live (next 2–4 weeks)

1. Create the Supabase project, run `supabase/schema.sql`, add admin account, paste keys into `config.js` (see SETUP.md).
2. Push `website/` to GitHub; deploy on Vercel; retire or redirect the old deployment.
3. Enter real projects and current progress in the admin dashboard; publish the first updates.
4. Replace the draft convener bio with the final version; add more campaign photos.
5. Point `saptarinext.com` (or `.org`) at the deployment.

## Phase 3 — Deepen the platform (1–3 months)

- **Publications engine:** a `publications` table + upload to Supabase Storage so new PDFs can be published from the admin panel without editing HTML.
- **Poll pillar online:** simple poll/survey module (questions table + public voting page + results charts) to run the baseline priorities poll.
- **Report workflow:** status field surfaced in admin (new → reviewed → actioned), email notifications on new reports (Supabase Edge Function).
- **Researcher accounts:** optional sign-in tier granting access to the fuller research archive (large PDFs in Supabase Storage with signed URLs).
- **Maps:** interactive district map (Leaflet + OpenStreetMap) with municipality boundaries, project pins and Koshi Tappu overlay.
- **Full NE parity:** complete Nepali translations of District Profile and Library pages; consider Maithili as a third language.

## Phase 4 — Campaign operations (3–12 months)

- **Progress dashboard v2:** ward/municipality-level indicators per focus area, annual data snapshots — the "radical transparency" dashboard.
- **Endowment fund page:** fund status, governance documents, contribution pathways (bank/QR details; formal donation processing needs a registered entity — get legal advice on fundraising rules first).
- **Member area:** newsletters, volunteer task board, diaspora chapter pages.
- **Media library:** photo/video archive (the Farm, Trust, exhibitions) with attribution metadata.
- **Analytics:** privacy-respecting analytics (e.g. Plausible/Umami) to report reach in campaign publications.

## Content sources used

Campaign Manual First Edition (EN/NE, July 2026); District Profile Modules 1–2 (Bikash, profiling series); Saptari background PDFs; okfa WEBSITE photo set; saptarinext.vercel.app (founder note, stories); Facebook page linked throughout.
