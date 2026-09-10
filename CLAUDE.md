# CLAUDE.md

Durf Dungeon LLC: a single-purpose Next.js app on Vercel that matches party guests with one of
six "residents" via an LLM, using a QR-code phone flow. Optimize for fast iteration: small files,
clear ownership boundaries, parallel subagents.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript (strict) + Tailwind 4 (CSS-first config in `app/globals.css`)
- pnpm 10 (never npm/yarn). Node 24.
- OpenAI SDK v7 (Responses API + `zodTextFormat` structured outputs), `@supabase/supabase-js`, `zod` v4, `qrcode.react`, `canvas-confetti`
- Deployed on Vercel via git push (preview on branches, production on `main`)

**Next 16 differs from your training data.** Before writing Next-specific code, read the relevant
guide in `node_modules/next/dist/docs/01-app/`. Known gotchas: `cookies()`, `headers()`, `params`,
and `searchParams` are all async (await them). `middleware.ts` is now `proxy.ts` (we don't use
either). Route handlers use Web `Request`/`Response`. Layouts/pages get typed `LayoutProps<"/">`
and `PageProps<"/route">` helpers.

## Commands

```bash
pnpm install          # install deps
pnpm dev              # local dev server at http://localhost:3000
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm build            # production build (must pass before any PR/merge)
```

Definition of done for any change: `pnpm lint && pnpm typecheck && pnpm build` all pass.

## How the app works

- `/login` — password-only form. Compares to `APP_PASSWORD`, sets the `dd_session` cookie (see `lib/auth.ts`).
- `/` — host display (requires cookie). Polls `GET /api/state` every ~2s, renders a QR for `/s/<activeToken>`.
  When `latestResultId` changes, fetches `GET /api/results/latest` and plays the reveal.
- `/s/[token]` — phone flow, public. On load `POST /api/token/claim` (retires that QR, mints the next).
  Form: name, trait chips, description, photo (resized + compressed in the browser). `POST /api/submit`.
- `/history` — requires cookie. Server Component listing past results newest-first with a per-member tally.
- Token lifecycle: `active -> claimed -> processing -> done`. See `lib/types.ts`.
- Storage goes through the `Store` interface in `lib/types.ts`. `lib/store/memory.ts` for dev,
  `lib/store/supabase.ts` for prod, chosen by `getStore()` based on env.
- Matching goes through `matchSubmission()` in `lib/match/index.ts`. Falls back to `lib/match/mock.ts` without an API key.

## Layout

```
app/
  page.tsx                  host display (agent C)
  login/                    password page (agent E)
  history/                  past results (agent F)
  s/[token]/                phone flow (agent D)
  api/state, api/token/claim, api/results/latest, api/submit   route handlers (orchestrator)
  api/login                 sets the cookie (agent E)
  layout.tsx, globals.css   root layout + design tokens (shared; see below)
components/
  ui/                       primitives: Button, Card, Badge, GlowText, Input, Textarea, Spinner
  host/                     QR panel, reveal card, polling hook (agent C)
  submit/                   form, trait picker, photo input (agent D)
  history/                  result rows, tally strip (agent F)
  chrome/                   top bar, ticker, marquee, footer (agent E)
content/
  members.ts                the six residents (placeholders; the owner fills these in)
  traits.ts                 trait chips for the phone form
lib/
  types.ts                  THE shared contract. Add, don't rename.
  env.ts, auth.ts, tokens.ts, cn.ts, format.ts, mock.ts
  store/                    memory.ts, supabase.ts, index.ts
  match/                    index.ts, mock.ts, prompt/schema/openai (agent B)
supabase/migrations/        SQL (agent A)
public/members/             resident photos (placeholders are .svg)
```

Rules:
- A route's `page.tsx` stays thin: compose components, pass data. Logic lives in `lib/` or the component.
- One exported component per file. Filename matches the export.
- Server Components by default. Add `"use client"` only when you need state, effects, or browser APIs.
- No global state libraries. URL params and local `useState` are enough.
- Static content goes in `content/` as typed TS objects, not hardcoded in JSX.
- Tailwind only. Theme tokens (`bg-surface`, `text-muted`, `text-cyan`, `font-display`, `glass`, `text-gradient`,
  `glow`, `gradient-border`, `animate-*`) are defined in `app/globals.css`. Use them rather than raw hex.
- Dark theme only. Don't add light-mode variants.
- User photos are data URLs or remote Supabase URLs: render with `next/image` + `unoptimized`, or a plain
  `<img>` with an eslint-disable comment. Resident photos in `public/` use `next/image` normally.

## Working in parallel (subagents)

The whole point of this file is letting several agents work at once without stepping on each other.

### How the orchestrator splits work

1. Define the shared contract first, alone: `lib/types.ts`, `content/`, route list, UI primitives. Commit before fanning out.
2. Split by **file ownership**, never by "feature" that spans files. Each subagent gets an explicit list of
   files/directories it owns and must not touch anything else.
3. Run independent subagents in a single message so they actually execute concurrently.
4. After they return, the orchestrator (not the subagents) runs `pnpm lint && pnpm typecheck && pnpm build`
   and fixes integration issues.

### Rules for every subagent

- Only edit files in your assigned scope. If you need a change outside it, report it back instead of making it.
- Don't add dependencies. If you think one is needed, say so in your report.
- Don't modify `package.json`, `tsconfig.json`, `next.config.ts`, `app/globals.css`, `app/layout.tsx`, or
  `lib/types.ts` unless explicitly assigned.
- Import shared types from `lib/types.ts`. Never redefine them locally.
- Build against `lib/mock.ts` data when your backend counterpart isn't merged yet.
- Run `pnpm typecheck` and `pnpm lint` before reporting done. Don't run `pnpm build` (the orchestrator does that once).
- Report: files created/changed, anything you needed but couldn't touch, and any assumptions you made.

## Conventions

- TypeScript strict. No `any`. Prefer `type` over `interface` unless extending.
- Named exports for components; default export only where Next.js requires it (`page.tsx`, `layout.tsx`, `route.ts` handlers are named).
- Props type is declared inline above the component as `type Props = { ... }`.
- Accessible by default: semantic HTML, `alt` on images, labels on inputs, visible focus states.
- Use `next/link` for internal links.
- Keep files under ~150 lines. Split when larger.
- No comments that restate the code. Comment only the "why".

## Voice and theme

Over-the-top Silicon Valley launch-page energy. Everything is "enterprise-grade", "at the edge",
"Series A pending", "patent pending". Fake metrics with too many decimal places. Dark glass panels,
violet/cyan/magenta glow, monospace uppercase labels, gratuitous gradients. Confetti on reveal.
Funny, never mean: the joke is the startup, not the guests.

## Vercel

- Preview deploys happen automatically on every branch push. Production deploys from `main`.
- Env vars live in the Vercel dashboard and are mirrored (empty) in `.env.example`. Never commit `.env*.local`.
- `app/api/submit` sets `maxDuration` because the LLM call is slow. Keep route handlers stateless.

## Git

- Small commits with imperative messages ("Add hero section", not "Added hero section").
- Never force-push shared branches.
