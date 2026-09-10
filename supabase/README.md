# Supabase

Production storage for the app (`lib/store/supabase.ts`). Local dev needs none of this; leave the env vars blank and the in-memory store is used.

- `tokens` table: one row per QR code, `active -> claimed -> processing -> done`. Mutated only through the `ensure_active_token` / `claim_token` SQL functions so two phones can't race.
- `results` table: one row per match; `payload` holds the full `MatchResult` JSON, the other columns are indexed copies.
- `photos` storage bucket (public): submitter photos, one object per result id.

Apply `migrations/0001_init.sql` via the dashboard SQL Editor, or `supabase link --project-ref <ref> && supabase db push`.

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Project Settings -> API) in Vercel / `.env.local`. Server-side only; the service role key must never reach the browser.
