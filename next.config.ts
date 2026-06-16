import type { NextConfig } from "next";

// `PAGES_BASE_PATH` is set by the GitHub Pages deploy workflow to the repo
// name (e.g. "/company-app") so static assets resolve under the project page
// URL. Locally and on a server host it is unset, so the app serves from "/".
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Emit a fully static site into `out/` for zero-cost hosting (GitHub Pages).
  // Swap to the default server output (or remove this) once we add server-side
  // features (API routes, Postgres, auth) and deploy to a server host.
  output: "export",
  basePath: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
