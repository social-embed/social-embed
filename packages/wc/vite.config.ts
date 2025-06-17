import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

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
});
