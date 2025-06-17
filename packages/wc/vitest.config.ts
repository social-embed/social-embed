import dts from "vite-plugin-dts";
/// <reference types="@vitest/browser/providers/playwright" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: "src/OEmbedElement.ts",
      fileName: "OEmbedElement",
      formats: ["es", "umd"],
      name: "oembed",
    },
    manifest: false,
    minify: false,
  },
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
      headless: true,
      instances: [
        {
          browser: "chromium",
          context: {
            // Playwright context options (per test file)
          },
          // Playwright-specific options for this browser instance
          launch: {
            // Any additional Playwright launch options can go here
          },
        },
      ], // Always use headless mode by default
      provider: "playwright",
    },
    // Include test files in coverage
    coverage: {
      include: ["src/**/*.ts", "test/**/*.ts"],
      provider: "istanbul",
      reporter: ["text", "html", "lcov"],
    },
    // Dependencies to inline in the browser (using recommended approach)
    deps: {
      optimizer: {
        ssr: {
          include: ["@social-embed/lib"],
        },
      },
    }, // Access test APIs like describe, it without imports
    globals: true,
    // Include all test files
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)", "**/*.test-d.ts"],
    // Setup files run before tests
    setupFiles: ["./test/browser-setup.ts"],
    // Typecheck configuration - enable by default for all test runs
    typecheck: {
      enabled: true,
      ignoreSourceErrors: true,
      include: ["**/*.test-d.ts"],
      isolatedPackages: true,
      tsconfigSearchPath: __dirname,
    },
    // Default: tests run only if changed/affected
    watch: false,
  },
});
