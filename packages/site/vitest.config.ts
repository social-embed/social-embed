import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    // Build-time globals needed by cdnSources.ts
    __GIT_BRANCH__: JSON.stringify("test-branch"),
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
