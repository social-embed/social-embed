import react from "@vitejs/plugin-react";
import type { UserConfig as ViteUserConfig } from "vite";
import { defineConfig } from "vitest/config";

// FIXME: Type assertion required due to Vite version mismatch
// Astro bundles Vite 6, @vitejs/plugin-react targets Vite 7
// Remove when Astro upgrades to Vite 7 or use pnpm override
type VitePlugin = NonNullable<ViteUserConfig["plugins"]>[number];
const reactPlugin = react() as unknown as VitePlugin;

export default defineConfig({
  define: {
    // Build-time globals needed by cdnSources.ts
    __GIT_BRANCH__: JSON.stringify("test-branch"),
  },
  plugins: [reactPlugin],
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
