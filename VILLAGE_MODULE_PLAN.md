# One Village at a Time — Village Modules Plan

*A Saptari Next program under the Project + Publication pillars.*

## The idea

The village is the most basic unit of development. Before districts can be transformed, the ground nuances must be understood — the land and the people. "One Village at a Time" is a model where an individual or organisation **owns up a village**: documents it, builds its baseline, convenes its people and diaspora, and tracks its development live on the campaign website.

The convener starts with his own village — **Boria (Boriya)** — setting the template every subsequent village module will follow. Each village gets a public page that works like a living dashboard: profile + study threads + live progress + media.

## Module 01: Boria

**Status of place.** The former Boria VDC (nine wards) was split under federal restructuring into **Rajbiraj Municipality Ward 16** and **Bishnupur Rural Municipality Ward 5**. It sits just south-west of Rajbiraj city (26.5087° N, 86.7190° E — mapped on Google Maps as "Boriya, 56400"), framed by the **Ghordah river** and the **Koshi western canal**, with Rajbiraj Airport and Mahendra Bindeshwari Multiple Campus nearby and several road links including Kunauli Road. Ward 16's population is roughly 5,000 (VDM estimate) with a mixed Yadav, Tharu and Dalit community.

**Foundation document.** The *Comprehensive Village Development Model for Ward No. 16, Rajbiraj Municipality* (in the campaign archive) provides the framework: strategic pillars (governance, economic, social development), a 5-year implementation timeline, monitoring via community scorecards, and SDG alignment. The Boria module operationalises this VDM in public.

### The eight study threads

Each thread is a section on the village page with its own baseline write-up, progress bar, and eventually its own sub-page:

1. **Land & People (Demographics)** — population, households, caste/ethnic and language composition; how demographics are shifting as young people migrate out. Census 2011/2021 ward-level data to be compiled as the baseline.
2. **Human Resource & Diaspora** — mapping villagers at home and abroad: skills, occupations, destinations; organising the diaspora as a development constituency.
3. **The School** — separate write-up with photos and YouTube videos; tracked as its own project with independent progress (repairs, enrolment, quality).
4. **Ponds & Water** — the village ponds, their condition, fisheries potential and restoration; the Ghordah river and Koshi western canal as water assets and flood risks.
5. **Roads & Connectivity** — internal roads, links to Rajbiraj/airport/highway, drainage.
6. **Health Post** — services, staffing, upgrade needs (VDM Year-1 priority).
7. **Temples & Heritage** — shrines, sacred sites, festivals and their stories.
8. **Folk Arts & Songs** — Maithili folk traditions of the village, recorded and archived before they fade.

### Media & connection

- **Gaamak Baat** (गामक बात) — village conversations series: knowing the village and its people. Existing episodes (with Bipin Deo) embedded on the page; future episodes shot in Boria per thread.
- **Jani Apan Neta** (जानी अपन नेता) — knowing your leaders: connecting people with representatives who shape the village's future.
- Channel: youtube.com/channel/UC_-bkk2f_CMvpt_GLsaZXXQ — new uploads can be pulled automatically via the channel RSS feed in a later iteration.

## Website implementation

**v1 (now):** `villages.html` — program overview and village registry (Boria = Module 01, more villages invited). `village-boria.html` — the Boria dashboard: map embed, quick facts, eight threads with baseline progress bars, video embeds, VDM timeline, live project tracker filtered to Boria, and report/adopt calls-to-action. New "Villages" tab in the site navigation (EN/NE).

**Data model:** `projects.village` column added in Supabase — any project tagged `boria` appears automatically on the Boria page from the database. School tracking = a project row ("Boria School Development") whose progress the admin updates.

**v2 (1–3 months):** a `villages` table (name, wards, coordinates, summary, convener/owner) so new village modules can be added from the admin dashboard without coding; per-thread sub-pages starting with the School; photo galleries; ward-level census data tables; automatic YouTube feed.

**v3 (with the program):** village scorecards from the VDM's community-scorecard method — biannual public updates; diaspora registry per village; "Adopt a Village" onboarding flow where partners take up Module 02, 03, …

## Content pipeline (who does what)

Baseline write-ups per thread → campaign office (start from VDM + Bikash-style modules). Photos/video → Gaamak Baat shoots. Data → ward offices, Census 2021 ward tables, school records. Progress updates → admin dashboard (appear live). Diaspora inputs → Report page, tagged Boria.

## Next actions

1. Verify ward-level census figures for Rajbiraj-16 and Bishnupur-5 to replace draft numbers.
2. Draft the School write-up (photos + links) — first thread to go deep.
3. Shoot a Gaamak Baat episode in Boria walking the eight threads.
4. Enter "Boria School Development" and other Boria projects in the admin dashboard so the live tracker fills with real work.
