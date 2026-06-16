/**
 * Central place for site-wide constants and small pure helpers.
 * Keep this dependency-free so it is trivial to unit test.
 */

export const siteConfig = {
  name: "Company App",
  tagline: "Foundation is live. Ready to ship product.",
} as const;

/**
 * Returns the landing-page greeting. Pure function so the test runner can
 * assert on it without rendering React.
 */
export function getGreeting(name: string = siteConfig.name): string {
  return `Hello, ${name} 👋`;
}
