-- Durf Dungeon LLC: initial schema.
--
-- Apply with either:
--   1. Supabase dashboard -> SQL Editor -> paste this file -> Run, or
--   2. `supabase link --project-ref <ref>` then `supabase db push` (reads supabase/migrations/).
--
-- The app reaches these tables only from the server with the service role key, which bypasses
-- RLS. RLS is enabled with no policies so the anon/authenticated roles can't touch anything.
-- The TypeScript mirror of this schema is the `Database` type in lib/supabase.ts.

-- ---------------------------------------------------------------------------
-- tokens: one row per QR code. Lifecycle: active -> claimed -> processing -> done.
-- ---------------------------------------------------------------------------
create table if not exists public.tokens (
  token       text primary key,
  status      text not null check (status in ('active', 'claimed', 'processing', 'done')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists tokens_active_idx on public.tokens (status) where status = 'active';

alter table public.tokens enable row level security;

-- ---------------------------------------------------------------------------
-- results: one row per finished match. `payload` is the full MatchResult JSON (lib/types.ts);
-- the scalar columns are denormalised copies for indexing and the per-resident tally.
-- ---------------------------------------------------------------------------
create table if not exists public.results (
  id              uuid primary key,
  token           text not null,
  submitter_name  text not null,
  member_id       text not null,
  score           int not null,
  model           text not null,
  payload         jsonb not null,
  created_at      timestamptz not null default now()
);

create index if not exists results_created_at_idx on public.results (created_at desc);
create index if not exists results_member_id_idx on public.results (member_id);

alter table public.results enable row level security;

-- Public bucket for submitter photos. Uploads go through the service role; reads are public URLs.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Atomic token operations, called via supabase.rpc(). Both take the same transaction-scoped
-- advisory lock, so "which token is active" can only change in one transaction at a time.
-- ---------------------------------------------------------------------------

-- Returns the current active token, minting p_candidate if there isn't one.
create or replace function public.ensure_active_token(p_candidate text)
returns text
language plpgsql
set search_path = ''
as $$
declare
  v_token text;
begin
  perform pg_advisory_xact_lock(hashtext('durf.tokens.active'));

  select t.token into v_token
  from public.tokens t
  where t.status = 'active'
  order by t.created_at
  limit 1;

  if v_token is not null then
    return v_token;
  end if;

  insert into public.tokens (token, status)
  values (p_candidate, 'active')
  on conflict (token) do nothing;

  select t.token into v_token
  from public.tokens t
  where t.status = 'active'
  order by t.created_at
  limit 1;

  return v_token;
end;
$$;

-- A phone opened /s/<p_token>. If it is the active token, retire it (claimed) and mint p_next.
-- Returns the token's status after the call, or null if the token is unknown. Two phones hitting
-- it at once are serialised by the advisory lock plus the row lock: the second sees 'claimed'
-- and nothing is minted twice.
create or replace function public.claim_token(p_token text, p_next text)
returns text
language plpgsql
set search_path = ''
as $$
declare
  v_status text;
begin
  perform pg_advisory_xact_lock(hashtext('durf.tokens.active'));

  select t.status into v_status
  from public.tokens t
  where t.token = p_token
  for update;

  if v_status is null then
    return null;
  end if;

  if v_status = 'active' then
    update public.tokens
    set status = 'claimed', updated_at = now()
    where token = p_token;

    insert into public.tokens (token, status)
    values (p_next, 'active')
    on conflict (token) do nothing;

    return 'claimed';
  end if;

  return v_status;
end;
$$;

-- Per-resident tally for /history. Done in SQL so it isn't capped by PostgREST's max-rows.
create or replace function public.count_by_member()
returns table (member_id text, n bigint)
language sql
stable
set search_path = ''
as $$
  select r.member_id, count(*) as n
  from public.results r
  group by r.member_id;
$$;

-- Only the server (service role) may call these. Postgres grants EXECUTE to public by default,
-- which would let anyone holding the project's anon key mint or claim tokens.
revoke execute on function public.ensure_active_token(text) from public, anon, authenticated;
revoke execute on function public.claim_token(text, text) from public, anon, authenticated;
revoke execute on function public.count_by_member() from public, anon, authenticated;
grant execute on function public.ensure_active_token(text) to service_role;
grant execute on function public.claim_token(text, text) to service_role;
grant execute on function public.count_by_member() to service_role;
