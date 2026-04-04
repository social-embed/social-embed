import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    exclude: ["src/**/*.browser.test.ts"],
    include: ["src/**/*.test.ts"],
  },
});
