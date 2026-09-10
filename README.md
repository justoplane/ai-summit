# Durf Dungeon LLC

Enterprise-grade romantic compatibility inference. Series A pending.

A party app: guests scan a QR on the big screen, fill in a short intake form on their phone
(name, description, most impressive achievement, a selfie, optional notes), and an LLM decides which of the six Durf Dungeon
residents they're most compatible with. The verdict is revealed on the big screen. Every run is
logged to the results ledger.

## Run it locally

```bash
pnpm install
cp .env.example .env.local   # then fill in the keys you have
pnpm dev                     # http://localhost:3000
```

With no keys set, the app runs entirely in memory with a deterministic mock matcher, which is
enough to build UI against. Add `OPENAI_API_KEY` for real verdicts. Add `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` to persist tokens, results, and photos (see `supabase/README.md`).

The host screen password is `APP_PASSWORD` (default `change-me`).

## Fill in the residents

Everything about the six residents lives in `content/members.ts`: name, company title, one-line
achievement, a paragraph description, and their 16personalities type code (like `INFP-T`). The
reference notes for each type live in `doc/personality_quiz_context.md`; only the sections for
types the residents actually have are sent to the model, as background. Drop photos in `public/members/` and update the
`photo` paths.

## Pages

| Route | What |
| --- | --- |
| `/login` | Password gate for the host screen |
| `/` | Public landing page with a Sign in button |
| `/floor` | Host display: live QR plus the latest match reveal |
| `/s/[token]` | Phone intake flow (public) |
| `/history` | Results ledger and resident leaderboard |

## Deploy

Push to `main`. Vercel builds it. Set the same env vars in the Vercel project settings.

See `CLAUDE.md` for architecture, conventions, and how the code is split for parallel work.
