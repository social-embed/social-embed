// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // By default, Vitest uses happy-dom, but many prefer jsdom
    environment: "jsdom",

    // If you need global test APIs (e.g., `describe`, `it`, etc.)
    // without importing from 'vitest', you can set this:
    globals: true,

    // If you have a "test/" folder with *.test.ts or *.spec.ts, Vitest will pick them up.
    include: ["test/**/*.test.ts", "test/**/*.spec.ts"],
  },
});
