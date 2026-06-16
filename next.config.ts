import type { NextConfig } from "next";

// ResumeRocket needs a server runtime: the `/api/generate` route handler calls
// the Anthropic API with a secret key (which must never ship to the browser),
// and later Stripe webhooks + email capture need server endpoints too. That
// rules out `output: "export"` (static GitHub Pages) — a static bundle can't run
// route handlers or hold secrets. We deploy to a Node host (see DEPLOYMENT.md).
const nextConfig: NextConfig = {
  // Leave image optimization off for now — we have no remote image pipeline yet
  // and it keeps the build host-agnostic.
  images: { unoptimized: true },
};

export default nextConfig;
