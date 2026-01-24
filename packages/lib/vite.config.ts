import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        "browser/index": resolve(__dirname, "src/browser/index.ts"),
        index: resolve(__dirname, "src/index.ts"),
      },
      fileName: (format, entryName) => {
        const ext = format === "es" ? "js" : "cjs";
        return `${entryName}.${ext}`;
      },
      formats: ["es", "cjs"],
      name: "SocialEmbedLib",
    },
    sourcemap: true,
  },
  plugins: [dts()],
});
