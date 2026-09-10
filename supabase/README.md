# Supabase

Production storage for the app (`lib/store/supabase.ts`). Local dev needs none of this; leave the env vars blank and the in-memory store is used.

## Tables

- `codes`: named, reusable intake QR codes. `slug` is the URL (`/s/<slug>`); `archived_at` stops the link but keeps attribution.
- `visits`: one row per phone opening an intake link, `opened -> processing -> done`. Results point back at a visit.
- `results`: one row per match; `payload` holds the full `MatchResult` JSON, the other columns are indexed copies. `code_id` / `visit_id` are null for rows that predate codes.
- `settings`: operator key/value rows (`floor_code_id`, `floor_follow`, `shlayte_maxxing`).

## Storage

- `photos` bucket (public): submitter photos, one object per result id.

## Functions (service role only)

- `count_by_member(p_code_id uuid default null) -> (member_id text, n bigint)`: per-resident tally, optionally for one code.
- `code_stats() -> (code_id uuid, scans bigint, submissions bigint)`: visits and results per code, zeros included.

## Applying

Run the migrations in order: `migrations/0001_init.sql`, then `migrations/0002_intake_codes.sql`. Either paste each into the dashboard SQL Editor, or `supabase link --project-ref <ref> && supabase db push`. 0002 drops the old `tokens` table and its functions, seeds a `Floor display` code, and carries the ShlayteMaxxing flag into `settings`.

The TypeScript mirror of the schema is the `Database` type in `lib/supabase.ts`; change both together.

## Env

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Project Settings -> API) in Vercel / `.env.local`. Server-side only; the service role key must never reach the browser.
