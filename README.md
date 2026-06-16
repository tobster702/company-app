# Company App — Technical Foundation

The company's web foundation: a boring, fast-to-ship stack the first product MVP
can grow into. Built for time-to-first-revenue and reversibility.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Vitest ·
ESLint + Prettier. Postgres is the chosen database for when we add server-side
data (not yet wired — see [Roadmap](#roadmap--adding-postgres)).

## Prerequisites

- Node.js 20+ (developed on Node 24)
- npm 10+

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:3000
```

Edit `src/app/page.tsx` and the page hot-reloads.

## Everyday commands

| Command              | What it does                             |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Dev server with hot reload               |
| `npm run build`      | Production build → static site in `out/` |
| `npm test`           | Run the Vitest test suite once           |
| `npm run test:watch` | Run tests in watch mode                  |
| `npm run lint`       | ESLint                                   |
| `npm run format`     | Format the repo with Prettier            |
| `npm run typecheck`  | TypeScript type-check (no emit)          |

## Project structure

```
src/
  app/            # Next.js App Router: routes, layouts, pages
    layout.tsx    # Root layout + metadata
    page.tsx      # Landing page (hello world)
    globals.css   # Tailwind + theme tokens
  lib/            # Framework-free helpers + business logic (unit-tested here)
    site.ts       # Site config + pure helpers
    site.test.ts  # Vitest unit tests
public/           # Static assets served at /
.github/workflows # CI (build/lint/test) + GitHub Pages deploy
```

The first product MVP grows into `src/app` (routes/UI) and `src/lib`
(logic/data access). Add `src/components` for shared UI as it appears.

## Testing

[Vitest](https://vitest.dev) is the test runner. Tests live next to the code as
`*.test.ts` / `*.test.tsx` under `src/`. Run `npm test`. The smallest test
(`src/lib/site.test.ts`) asserts the landing-page greeting.

## Deploy

The app builds to a fully static site (`output: "export"` in `next.config.ts`)
and deploys to **GitHub Pages** via GitHub Actions — zero hosting cost and no
extra credentials.

- **Automatic:** every push to `main` runs the
  [`deploy`](.github/workflows/deploy.yml) workflow, which builds and publishes
  to GitHub Pages. Live URL: see the repo's **Settings → Pages** (and the
  TOB-2 task comment).
- **Repeatable local build** (produces the exact artifact that gets deployed):
  ```bash
  PAGES_BASE_PATH="/$(basename "$PWD")" npm run build   # static site in ./out
  ```
  Locally, just `npm run build` serves from `/`.

### Roadmap — adding Postgres / a server host

Static export has no server runtime, so it can't talk to Postgres directly.
When the MVP needs a database, API routes, or auth:

1. Remove `output: "export"` from `next.config.ts`.
2. Move to a server host (Vercel, Railway, or Fly.io) — this needs hosting +
   database credentials, tracked as a separate governance ticket to the CEO.
3. Add the Postgres client and a `DATABASE_URL` env var (kept out of the repo).

This keeps today's foundation reversible: the hello-world ships now for free,
and the production path is a documented, incremental upgrade.

## Secrets

No secrets live in the repo. Runtime config goes in `.env*` files (gitignored).
Provision real secrets in the host/CI secret store.
