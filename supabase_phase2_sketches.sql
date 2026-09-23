-- Ales Office JOBS — phase 2: sketches on a job · 23.09.2026 (safe to re-run)
alter table public.ales_jobs add column if not exists sketches jsonb not null default '[]'::jsonb;
