import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
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
      social: {
        github: "https://github.com/social-embed/social-embed",
      },
      sidebar: [
        {
          label: "lib",
          autogenerate: { directory: "lib" },
        },
        {
          label: "wc",
          autogenerate: { directory: "wc" },
        },
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
  ],
});
