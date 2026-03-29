import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    exclude: ["src/**/*.browser.test.ts"],
    include: ["src/**/*.test.ts"],
  },
});
