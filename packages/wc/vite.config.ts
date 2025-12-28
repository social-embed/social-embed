import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/OEmbedElement.ts",
      fileName: "OEmbedElement",
      formats: ["es"],
    },
    manifest: false,
    minify: true,
    sourcemap: true,
  },
  plugins: [
    dts({
      include: ["src/**/*.ts"],
    }),
  ],
});
