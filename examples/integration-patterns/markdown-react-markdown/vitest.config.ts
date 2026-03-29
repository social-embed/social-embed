import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ["src/**/*.browser.test.ts"],
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
  },
});
