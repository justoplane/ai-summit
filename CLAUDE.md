# CLAUDE.md

Simple Next.js webapp deployed on Vercel. No database, no auth, no backend services.
Optimize for fast iteration: small files, clear ownership boundaries, parallel subagents.

## Stack

- Next.js (App Router) + TypeScript (strict) + Tailwind CSS
- pnpm for packages (never npm/yarn)
- Node 24
- Deployed on Vercel via git push (preview on branches, production on `main`)

## Commands

```bash
pnpm install          # install deps
pnpm dev              # local dev server at http://localhost:3000
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm build            # production build (must pass before any PR/merge)
```

Definition of done for any change: `pnpm lint && pnpm typecheck && pnpm build` all pass.

## Layout

```
app/                  # routes only: page.tsx, layout.tsx, loading.tsx, route.ts
  (marketing)/        # route groups for grouping, not nesting
components/           # shared UI, one component per file, PascalCase filename
  ui/                 # primitives (Button, Card, ...) with no app-specific logic
lib/                  # pure helpers, constants, types. No React imports.
content/              # static data (JSON/TS) that pages render from
public/               # static assets
```

Rules:
- A route's `page.tsx` stays thin: compose components, pass data. Logic lives in `lib/` or the component.
- One exported component per file. Filename matches the export.
- Server Components by default. Add `"use client"` only when you need state, effects, or browser APIs.
- No global state libraries. URL params and local `useState` are enough.
- Static content goes in `content/` as typed TS objects, not hardcoded in JSX.
- Tailwind only. No CSS modules, no styled-components, no inline `style=` except for dynamic values.

## Working in parallel (subagents)

The whole point of this file is letting several agents work at once without stepping on each other.

### How the orchestrator splits work

1. Define the shared contract first, alone: types in `lib/types.ts`, content shape in `content/`, and the route list. Commit that before fanning out.
2. Split by **file ownership**, never by "feature" that spans files. Each subagent gets an explicit list of files/directories it owns and must not touch anything else.
3. Good splits: one agent per route, one per component group, one for `lib/` helpers, one for tests.
4. Bad splits: two agents both editing `app/layout.tsx`, or both adding to the same `content/` file.
5. Run independent subagents in a single message so they actually execute concurrently.
6. After they return, the orchestrator (not the subagents) runs `pnpm lint && pnpm typecheck && pnpm build` and fixes integration issues.

### Rules for every subagent

- Only edit files in your assigned scope. If you need a change outside it, report it back instead of making it.
- Don't add dependencies. If you think one is needed, say so in your report and let the orchestrator decide.
- Don't modify `package.json`, `tsconfig.json`, `next.config.*`, `tailwind.config.*`, or `app/layout.tsx` unless explicitly assigned.
- Import shared types from `lib/types.ts`. Never redefine them locally.
- Run `pnpm typecheck` on your own files before reporting done. Don't run `pnpm build` (the orchestrator does that once).
- Report: files created/changed, anything you needed but couldn't touch, and any assumptions you made.

### Shared files (edit with care, usually orchestrator-only)

- `app/layout.tsx` — root layout, nav, fonts, metadata
- `app/globals.css` — Tailwind directives and CSS variables only
- `lib/types.ts` — shared types; add, don't rename
- `package.json` — deps and scripts

## Conventions

- TypeScript strict. No `any`. Prefer `type` over `interface` unless extending.
- Named exports for components; default export only where Next.js requires it (`page.tsx`, `layout.tsx`).
- Props type is declared inline above the component as `type Props = { ... }`.
- Accessible by default: semantic HTML, `alt` on images, labels on inputs, visible focus states.
- Use `next/image` for images and `next/link` for internal links.
- Keep files under ~150 lines. Split when larger.
- No comments that restate the code. Comment only the "why".

## Vercel

- Preview deploys happen automatically on every branch push.
- Production deploys from `main`. Don't push to `main` directly; open a PR.
- Environment variables (if any) go in the Vercel dashboard, mirrored in `.env.example` with empty values. Never commit `.env*.local`.
- Edge/serverless functions are not expected. If a `route.ts` is needed, keep it stateless.

## Git

- Branch per task: `feat/<short-name>`, `fix/<short-name>`.
- Small commits with imperative messages ("Add hero section", not "Added hero section").
- Never force-push shared branches.
