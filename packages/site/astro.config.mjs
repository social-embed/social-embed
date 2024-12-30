import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "social-embed",
      favicon: "/favicon.ico",
      logo: {
        src: "./src/assets/img/logo.svg",
      },
      customCss: [
        // Path to your Tailwind base styles:
        "./src/tailwind.css",
      ],
      social: {
        github: "https://github.com/social-embed/social-embed",
      },
      sidebar: [
        "getting-started",
        {
          label: "lib",
          autogenerate: { directory: "lib" },
        },
        {
          label: "wc",
          autogenerate: { directory: "wc" },
        },
        "news",
      ],
      head: [
        {
          tag: "script",
          attrs: {
            src: "/js/o-embed.bundled.js",
            type: "module",
            client: "load",
          },
        },
      ],
    }),
    react(),
    tailwind({
      // Disable the default base styles:
      applyBaseStyles: false,
    }),
  ],
});
