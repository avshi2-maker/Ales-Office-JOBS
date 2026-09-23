-- ============================================================
-- Ales Office JOBS — Phase 1: finish chapter + testimonial per job
-- Run once in Supabase (project oqqviohkynhmbfsqntxr) -> SQL Editor
-- Safe to re-run.
-- ============================================================

alter table public.ales_jobs
  add column if not exists status       text not null default 'open',
  add column if not exists finished_at  timestamptz,
  add column if not exists finish_date  date,
  add column if not exists after_media  jsonb not null default '[]'::jsonb,
  add column if not exists testimonial  jsonb not null default '{}'::jsonb,  -- {rating, quote, first_name, voice:{url,public_id}}
  add column if not exists consent      jsonb not null default '{}'::jsonb;  -- {photos, name_city, quote, stamped_at}

do $$ begin
  alter table public.ales_jobs add constraint ales_jobs_status_chk check (status in ('open','finished'));
exception when duplicate_object then null; end $$;

create index if not exists ales_jobs_status_idx on public.ales_jobs (status);

-- The ONLY write path after insert. Narrow by design:
--   * only jobs still 'open', never standalone testimonial rows
--   * only the finish columns are written
--   * at least 1 after-install photo required
create or replace function public.finish_job(p_id uuid, p_payload jsonb)
returns public.ales_jobs
language plpgsql
security definer
set search_path = public
as $$
declare r public.ales_jobs;
begin
  if coalesce(jsonb_array_length(p_payload->'after_media'), 0) < 1 then
    raise exception 'נדרשת לפחות תמונה אחת אחרי ההתקנה';
  end if;

  update public.ales_jobs set
    status      = 'finished',
    finished_at = now(),
    finish_date = coalesce(nullif(p_payload->>'finish_date','')::date, (now() at time zone 'Asia/Jerusalem')::date),
    after_media = p_payload->'after_media',
    testimonial = coalesce(p_payload->'testimonial', '{}'::jsonb),
    consent     = coalesce(p_payload->'consent', '{}'::jsonb) || jsonb_build_object('stamped_at', now())
  where id = p_id and status = 'open' and job_type <> 'testimonial'
  returning * into r;

  if r.id is null then
    raise exception 'העבודה כבר סומנה כהסתיימה או לא נמצאה';
  end if;
  return r;
end $$;

revoke all on function public.finish_job(uuid, jsonb) from public;
grant execute on function public.finish_job(uuid, jsonb) to anon, authenticated;
