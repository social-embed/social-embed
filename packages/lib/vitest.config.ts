import { resolve } from "node:path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      name: "SocialEmbedLib",
    },
  },
  plugins: [dts()],
  test: {
    environment: "node",
    globals: true,
    include: ["**/*.{test,spec}.ts", "**/*.test-d.ts"],
    typecheck: {
      checker: "tsc",
      enabled: true,
      ignoreSourceErrors: true,
      include: ["**/*.test-d.ts"],
      isolatedPackages: true,
      tsconfigSearchPath: import.meta.dirname,
    },
    watch: false,
  },
});
