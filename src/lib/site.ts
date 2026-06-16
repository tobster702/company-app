/**
 * Site-wide constants and small pure helpers. Dependency-free so it's trivial
 * to unit test and safe to import from both server and client components.
 */

export const siteConfig = {
  name: "ResumeRocket",
  tagline: "Tailor your resume to any job in 60 seconds — and land more interviews.",
} as const;

/** Page <title> for a given section, e.g. "Pricing — ResumeRocket". */
export function pageTitle(section?: string): string {
  return section ? `${section} — ${siteConfig.name}` : siteConfig.name;
}
