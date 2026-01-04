import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    // Build-time globals needed by cdnSources.ts
    __GIT_BRANCH__: JSON.stringify("test-branch"),
  },
  // FIXME: Type assertion required due to Vite version mismatch
  // Astro bundles Vite 6, @vitejs/plugin-react targets Vite 7
  // Remove when Astro upgrades to Vite 7 or use pnpm override
  plugins: [react() as any],
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
