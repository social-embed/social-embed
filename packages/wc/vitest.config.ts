import dts from "vite-plugin-dts";
/// <reference types="@vitest/browser/providers/playwright" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [dts()],
  // Module resolution aliases for both Vite and Vitest
  resolve: {
    alias: {
      "@social-embed/wc": "./src/OEmbedElement.ts",
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [
        {
          browser: "chromium",
          headless: true,
        },
      ],
    },
    // Setup files run before tests
    setupFiles: ["./test/browser-setup.ts"],
    globals: true, // Access test APIs like describe, it without imports
    environment: "node", // Use node environment first
    // Dependencies to inline in the browser (using recommended approach)
    deps: {
      optimizer: {
        ssr: {
          include: ["@social-embed/lib"],
        },
      },
    },
    // Default: tests run only if changed/affected
    watch: false,
    // Include test files in coverage
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.ts", "test/**/*.ts"],
      reporter: ["text", "html", "lcov"],
    },
  },
  build: {
    lib: {
      entry: "src/OEmbedElement.ts",
      formats: ["es", "umd"],
      name: "oembed",
      fileName: "OEmbedElement",
    },
    minify: false,
    manifest: false,
  },
});
