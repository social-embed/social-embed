import { defineConfig } from "vite";

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
});
