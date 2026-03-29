import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["src/**/*.browser.test.ts"],
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
