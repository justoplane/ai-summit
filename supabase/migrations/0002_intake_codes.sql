-- Durf Dungeon LLC: named, reusable intake codes replace single-use rotating tokens.
--
-- Apply after 0001_init.sql with either:
--   1. Supabase dashboard -> SQL Editor -> paste this file -> Run, or
--   2. `supabase link --project-ref <ref>` then `supabase db push` (reads supabase/migrations/).
--
-- Safe to run once on the existing project: every statement is `if [not] exists` / `on conflict`
-- guarded, the seed only fires on an empty `codes` table, and the old ShlayteMaxxing flag is
-- carried over before `tokens` is dropped. The TypeScript mirror is `Database` in lib/supabase.ts.

-- ---------------------------------------------------------------------------
-- codes: one row per intake QR. `slug` is the URL (/s/<slug>); archiving stops the link but keeps
-- every result attributed to it.
-- ---------------------------------------------------------------------------
create table if not exists public.codes (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  created_at   timestamptz not null default now(),
  archived_at  timestamptz
);

create index if not exists codes_archived_at_idx on public.codes (archived_at);

alter table public.codes enable row level security;

-- ---------------------------------------------------------------------------
-- visits: one row per phone opening an intake link. Lifecycle: opened -> processing -> done.
-- ---------------------------------------------------------------------------
create table if not exists public.visits (
  id          uuid primary key default gen_random_uuid(),
  code_id     uuid not null references public.codes (id),
  status      text not null default 'opened' check (status in ('opened', 'processing', 'done')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists visits_code_status_idx on public.visits (code_id, status);

alter table public.visits enable row level security;

-- ---------------------------------------------------------------------------
-- settings: operator key/value rows (floor_code_id, floor_follow, shlayte_maxxing).
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

alter table public.settings enable row level security;

-- ---------------------------------------------------------------------------
-- results: attribute each run to a code and a visit. Nullable so rows that predate codes stay.
-- `token` used to be the QR id; new rows don't have one, so it may be null from here on.
-- ---------------------------------------------------------------------------
alter table public.results
  add column if not exists code_id  uuid references public.codes (id),
  add column if not exists visit_id uuid references public.visits (id);

alter table public.results alter column token drop not null;

create index if not exists results_code_created_idx on public.results (code_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Seed: a first code for the floor display, and point the floor at the oldest code.
-- ---------------------------------------------------------------------------
insert into public.codes (slug, name)
select substr(md5(random()::text), 1, 8), 'Floor display'
where not exists (select 1 from public.codes);

insert into public.settings (key, value)
select 'floor_code_id', c.id::text
from public.codes c
order by c.created_at
limit 1
on conflict (key) do nothing;

-- Carry the old sentinel-row flag over before the tokens table goes away.
-- Dynamic SQL because a plain query would fail to parse once `tokens` no longer exists.
do $$
begin
  if to_regclass('public.tokens') is not null then
    execute $q$
      insert into public.settings (key, value)
      select 'shlayte_maxxing', '1'
      where exists (select 1 from public.tokens where token = 'flag:shlayteMaxxing')
      on conflict (key) do nothing
    $q$;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Retire the rotating-token machinery.
-- ---------------------------------------------------------------------------
drop function if exists public.claim_token(text, text);
drop function if exists public.ensure_active_token(text);
drop table if exists public.tokens;

-- ---------------------------------------------------------------------------
-- Tallies, done in SQL so they aren't capped by PostgREST's max-rows.
-- ---------------------------------------------------------------------------

-- Per-resident tally, optionally for one code. Replaces the zero-arg version from 0001.
drop function if exists public.count_by_member();

create or replace function public.count_by_member(p_code_id uuid default null)
returns table (member_id text, n bigint)
language sql
stable
set search_path = ''
as $$
  select r.member_id, count(*) as n
  from public.results r
  where p_code_id is null or r.code_id = p_code_id
  group by r.member_id;
$$;

-- Scans (visits) and submissions (results) per code. Left joins so every code appears with zeros.
create or replace function public.code_stats()
returns table (code_id uuid, scans bigint, submissions bigint)
language sql
stable
set search_path = ''
as $$
  select
    c.id as code_id,
    (select count(*) from public.visits v where v.code_id = c.id) as scans,
    (select count(*) from public.results r where r.code_id = c.id) as submissions
  from public.codes c;
$$;

-- Only the server (service role) may call these; Postgres grants EXECUTE to public by default.
revoke execute on function public.count_by_member(uuid) from public, anon, authenticated;
revoke execute on function public.code_stats() from public, anon, authenticated;
grant execute on function public.count_by_member(uuid) to service_role;
grant execute on function public.code_stats() to service_role;
