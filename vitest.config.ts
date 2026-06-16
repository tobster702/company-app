import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // Default to a fast Node environment; component tests can opt into jsdom
    // per-file with a `// @vitest-environment jsdom` pragma once we add them.
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
