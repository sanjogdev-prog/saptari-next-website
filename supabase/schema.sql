-- ============================================================
-- Saptari Next — database schema for Supabase
-- Run this once in your Supabase project: SQL Editor → New query
-- ============================================================

-- Projects & programs shown on the Progress page
create table if not exists projects (
  id          bigint generated always as identity primary key,
  title       text not null,
  title_ne    text,
  pillar      text not null default 'Project',   -- Project | Program | Poll | Publication
  status      text not null default 'planned',   -- planned | ongoing | completed
  progress    int  not null default 0 check (progress between 0 and 100),
  location    text,
  summary     text,
  start_date  date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Public updates published by the office
create table if not exists updates (
  id          bigint generated always as identity primary key,
  project_id  bigint references projects(id) on delete set null,
  title       text not null,
  body        text,
  published   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Reports & requests from the public Report page
create table if not exists reports (
  id           bigint generated always as identity primary key,
  name         text not null,
  contact      text not null,
  municipality text,
  category     text not null default 'progress', -- progress | issue | data | idea
  message      text not null,
  status       text not null default 'new',      -- new | reviewed | actioned | archived
  created_at   timestamptz not null default now()
);

-- Supporters / partners from Get Involved
create table if not exists members (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text not null,
  phone      text,
  type       text not null default 'individual', -- individual | organisation | diaspora
  interest   text,
  message    text,
  created_at timestamptz not null default now()
);

-- ---------------- Row Level Security ----------------
alter table projects enable row level security;
alter table updates  enable row level security;
alter table reports  enable row level security;
alter table members  enable row level security;

-- Public (anonymous) visitors: can READ projects and published updates
create policy "public read projects"  on projects for select using (true);
create policy "public read published updates" on updates for select using (published = true);

-- Public visitors: can SUBMIT reports and registrations (but never read them)
create policy "public submit reports" on reports for insert with check (true);
create policy "public submit members" on members for insert with check (true);

-- Signed-in admins (any authenticated user): full access
create policy "admin all projects" on projects for all to authenticated using (true) with check (true);
create policy "admin all updates"  on updates  for all to authenticated using (true) with check (true);
create policy "admin all reports"  on reports  for all to authenticated using (true) with check (true);
create policy "admin all members"  on members  for all to authenticated using (true) with check (true);

-- ============================================================
-- After running this:
-- 1. Authentication → Users → Add user → create the admin account
--    (e.g. sanjogdev@gmail.com + a strong password).
-- 2. Authentication → Sign In / Up → disable public sign-ups,
--    so only accounts you create can log in to the dashboard.
-- ============================================================
