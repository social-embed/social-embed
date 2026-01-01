/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import { viteMdxMergeHeadings } from "./plugins/vite-plugin-mdx-merge-headings";

// Use getViteConfig for Astro component testing support with AstroContainer
export default getViteConfig({
  define: {
    // Build-time globals needed by cdnSources.ts
    __GIT_BRANCH__: JSON.stringify("test-branch"),
    __GIT_SHA__: JSON.stringify("abc1234567890"),
  },
  // biome-ignore lint/suspicious/noExplicitAny: Astro/Vite Plugin type version mismatch
  plugins: [viteMdxMergeHeadings() as any],
  // @ts-expect-error: Vitest 'test' property not recognized in Astro's Vite config type
  test: {
    // happy-dom provides DOM APIs for React component tests
    environment: "happy-dom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "plugins/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
