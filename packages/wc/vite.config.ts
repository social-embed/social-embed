import { defineConfig } from "vite";

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
});
