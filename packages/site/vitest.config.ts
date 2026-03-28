/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import { viteMdxMergeHeadings } from "./plugins/vite-plugin-mdx-merge-headings";

// Use getViteConfig for Astro component testing support with AstroContainer
export default getViteConfig({
  define: {
    // Build-time globals needed by cdnSources.ts
    __GIT_BRANCH__: JSON.stringify("test-branch"),
  },
  // Vite 8: Astro 6 still sets esbuild.jsx via @vitejs/plugin-react, but
  // Vite 8 uses Oxc instead. Explicitly configure Oxc JSX for test files.
  // @ts-expect-error: Astro 6 types target Vite 7 and don't include Vite 8's oxc property
  oxc: {
    jsx: "automatic",
  },
  // biome-ignore lint/suspicious/noExplicitAny: Astro/Vite Plugin type version mismatch
  plugins: [viteMdxMergeHeadings() as any],
  test: {
    // happy-dom provides DOM APIs for React component tests
    environment: "happy-dom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "plugins/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
