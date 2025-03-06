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
      headless: true, // Always use headless mode by default
      instances: [
        {
          browser: "chromium",
          // Playwright-specific options for this browser instance
          launch: {
            // Any additional Playwright launch options can go here
          },
          context: {
            // Playwright context options (per test file)
          },
        },
      ],
    },
    // Setup files run before tests
    setupFiles: ["./test/browser-setup.ts"],
    globals: true, // Access test APIs like describe, it without imports
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
    // Include all test files
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)", "**/*.test-d.ts"],
    // Include test files in coverage
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.ts", "test/**/*.ts"],
      reporter: ["text", "html", "lcov"],
    },
    // Typecheck configuration - enable by default for all test runs
    typecheck: {
      enabled: true,
      include: ["**/*.test-d.ts"],
      ignoreSourceErrors: true,
      tsconfigSearchPath: __dirname,
      isolatedPackages: true,
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
