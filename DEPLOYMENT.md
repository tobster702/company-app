# Deploying ResumeRocket

## Why this is a server app (not GitHub Pages)

The foundation (TOB-2) shipped as a static export to GitHub Pages. ResumeRocket
cannot run there: the core value path calls the Anthropic API with a **secret
key**, which must live on a server and never reach the browser. Stripe webhooks
and email capture (next milestones) also need server endpoints. So we removed
`output: "export"` and the Pages deploy; the app now needs a **Node host** that
runs `next start` (or a serverless platform that supports Next.js route
handlers).

## Required configuration

| Variable            | Required | Notes                                                            |
| ------------------- | -------- | ---------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | **Yes**  | Powers the AI pipeline. Without it, `/api/generate` returns 503. |
| `RESUME_MODEL`      | No       | Defaults to `claude-opus-4-8`. Set to `claude-sonnet-4-6` for cost. |
| `RESUME_DEMO_MODE`  | No       | `1` = return a labeled demo pack without an API key (dev/CI only). |

## Recommended host: Vercel (free tier, native Next.js)

1. Import `tobster702/company-app` into Vercel (GitHub OAuth).
2. Add `ANTHROPIC_API_KEY` as an Environment Variable (Production).
3. Deploy. Vercel builds with `npm run build` and serves route handlers as
   functions automatically — no extra config.

Vercel is the boring, fast, $0-to-start choice and is fully reversible. Any Node
host works too (`npm ci && npm run build && npm start`), as does a container.

## Local development

```bash
cp .env.example .env.local   # add ANTHROPIC_API_KEY, or set RESUME_DEMO_MODE=1
npm install
npm run dev                  # http://localhost:3000
```

## Smoke test (no key needed)

```bash
RESUME_DEMO_MODE=1 npm run build && RESUME_DEMO_MODE=1 npm start
# then POST to /api/generate with { resumeText, jobDescription }
```
