import { resolve } from "node:path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SocialEmbedLib",
    },
  },
  plugins: [dts()],
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.{test,spec}.ts", "**/*.test-d.ts"],
    watch: false,
    typecheck: {
      enabled: true,
      include: ["**/*.test-d.ts"],
      ignoreSourceErrors: true,
      tsconfigSearchPath: __dirname,
      isolatedPackages: true,
    },
  },
});
