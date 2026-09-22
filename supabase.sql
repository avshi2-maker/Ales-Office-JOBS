-- ============================================================
-- Ales Office JOBS — Supabase schema
-- Run once in Supabase -> SQL Editor -> New query -> Run
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.ales_jobs (
  id          uuid primary key default gen_random_uuid(),
  job_type    text not null,               -- sinks | renovation | doors | testimonial
  title       text,
  city        text,
  customer    text,
  fields      jsonb default '{}'::jsonb,    -- per-type dynamic fields
  notes       text,
  ales_quote  text,                         -- price / quote (free text, may include ₪)
  rating      int,                          -- testimonials only (1-5)
  permission  boolean default false,        -- customer approved publishing
  media       jsonb default '[]'::jsonb,    -- [{url, type, public_id}]
  created_at  timestamptz default now()
);

create index if not exists ales_jobs_type_idx  on public.ales_jobs (job_type);
create index if not exists ales_jobs_city_idx  on public.ales_jobs (city);
create index if not exists ales_jobs_created_idx on public.ales_jobs (created_at desc);

-- Row Level Security.
-- This is a PIN-gated private field tool; the anon key is used from the
-- browser. We allow anon read + insert (no update/delete from client).
alter table public.ales_jobs enable row level security;

drop policy if exists ales_jobs_read   on public.ales_jobs;
drop policy if exists ales_jobs_insert on public.ales_jobs;

create policy ales_jobs_read
  on public.ales_jobs for select
  to anon, authenticated
  using (true);

create policy ales_jobs_insert
  on public.ales_jobs for insert
  to anon, authenticated
  with check (true);
