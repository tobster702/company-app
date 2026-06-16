# ResumeRocket

AI résumé & career toolkit. Paste your resume + a job description and get an
ATS-optimized tailored resume, a matching cover letter, likely interview
questions with answer guidance, and optimized LinkedIn copy — in under a minute.

**Stack:** Next.js 16 (App Router, server runtime) · TypeScript · Tailwind CSS
v4 · Anthropic SDK (Claude) · Zod · Vitest · ESLint + Prettier.

## Prerequisites

- Node.js 20+
- npm 10+
- An Anthropic API key (or `RESUME_DEMO_MODE=1` for keyless local UI work)

## Getting started

```bash
cp .env.example .env.local   # add ANTHROPIC_API_KEY (or set RESUME_DEMO_MODE=1)
npm install
npm run dev                  # http://localhost:3000
```

## Everyday commands

| Command              | What it does                          |
| -------------------- | ------------------------------------- |
| `npm run dev`        | Dev server with hot reload            |
| `npm run build`      | Production (server) build             |
| `npm start`          | Run the production server             |
| `npm test`           | Run the Vitest test suite once        |
| `npm run lint`       | ESLint                                |
| `npm run typecheck`  | TypeScript type-check (no emit)       |

## How it works

```
src/
  app/
    page.tsx                  # Landing page + the tool
    layout.tsx                # Root layout + metadata
    _components/
      ResumeTool.tsx          # Client: form → /api/generate → results
      CopyButton.tsx          # Copy-to-clipboard helper
    api/generate/route.ts     # POST: validates input, runs the AI pipeline
  lib/
    resume/
      schema.ts               # Zod request + application-pack contracts
      prompt.ts               # Pure prompt assembly (unit-tested)
      generate.ts             # Server-only: calls Claude (structured output)
    site.ts                   # Site config + pure helpers
```

The value path: `ResumeTool` POSTs `{ resumeText, jobDescription }` to
`/api/generate`, which validates with Zod, calls Claude with a structured-output
contract (`applicationPackSchema`), and returns a typed pack the UI renders.

## Deployment

This is a **server app** — it can't run on static GitHub Pages because the AI
pipeline uses a secret API key. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the host
setup (recommended: Vercel free tier).

## Secrets

No secrets in the repo. Set `ANTHROPIC_API_KEY` in `.env.local` (gitignored) for
local dev and in the host's secret store for production.
