import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import starlightDocSearch from "@astrojs/starlight-docsearch";
import tailwind from "@astrojs/tailwind";
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://social-embed.git-pull.com",
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
        // Fontsource files for to regular and semi-bold font weights.
        "@fontsource/ibm-plex-sans/400.css",
        "@fontsource/ibm-plex-sans/600.css",
        "@fontsource/ibm-plex-mono/400.css",
        "@fontsource/ibm-plex-mono/600.css",
      ],
      social: {
        github: "https://github.com/social-embed/social-embed",
        gitlab: "https://gitlab.com/social-embed/social-embed",
        codeberg: "https://codeberg.org/social-embed/social-embed",
      },
      editLink: {
        baseUrl:
          "https://github.com/social-embed/social-embed/edit/master/packages/site/",
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
    starlightDocSearch({
      appId: "BIATGF4K4K",
      apiKey: "a59a27c90979939bd097dcb51d8f22e3",
      indexName: "social-embed",
    }),
  ],
});
