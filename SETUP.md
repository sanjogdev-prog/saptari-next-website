# Saptari Next Website — Setup Guide

The site works out of the box in **demo mode** (sample data, no logins persisted).
Two short steps make it fully live.

## 0. Preview locally

Open `index.html` in any browser, or run a tiny server for cleaner behaviour:

```bash
cd website
python3 -m http.server 8000   # then open http://localhost:8000
```

## 1. Connect the database (Supabase, free)

1. Go to https://supabase.com → Start your project → create a project called `saptari-next` (choose a region near Singapore/Mumbai).
2. In the project: **SQL Editor → New query** → paste the whole of `supabase/schema.sql` → Run.
3. **Authentication → Users → Add user** → create your admin account (email + strong password). Then in **Authentication → Sign In / Up**, disable public sign-ups.
4. **Project Settings → API** → copy the `Project URL` and the `anon public` key.
5. Open `assets/js/config.js` and paste them into `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

That's it — the Report form, Get Involved form, Progress dashboard and Admin login now run on the real database. The anon key is safe to publish; row-level security in the schema controls what the public can do (read projects/updates, submit reports/registrations — nothing else).

## 2. Publish the site

Any static host works. Two easy options:

**Vercel** (you already use it for saptarinext.vercel.app):
- Push the `website/` folder to a GitHub repository, then in Vercel: New Project → import the repo → Framework preset: "Other" → deploy.
- Or without GitHub: `npm i -g vercel && vercel` from inside `website/`.

**GitHub Pages:** push to a repo → Settings → Pages → deploy from branch.

When ready, point the `saptarinext.com` domain at the deployment (Vercel → Project → Domains).

## Demo mode details

Until Supabase keys are set:
- Admin login: any email + password `saptari-demo` (data saved only in that browser).
- Report / Get Involved forms fall back to opening an email to the campaign address.
- Progress page shows sample projects.

## Everyday editing

- Text and pages: edit the `.html` files — they are plain HTML.
- Nepali translations: `assets/js/i18n.js`.
- Contact details / links: `assets/js/config.js`.
- New library materials: drop files into `materials/` and add a card in `library.html`.
- Projects, updates, reports, members: manage from `/admin/` once logged in.
