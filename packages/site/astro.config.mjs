import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import starlightDocSearch from "@astrojs/starlight-docsearch";
import tailwind from "@astrojs/tailwind";
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      components: {
        Footer: "./src/components/Footer.astro",
        Search: "./src/components/Search.astro",
      },
      credits: true,
      customCss: [
        // Path to your Tailwind base styles:
        "./src/tailwind.css",
        // Fontsource files for to regular and semi-bold font weights.
        "@fontsource/ibm-plex-sans/400.css",
        "@fontsource/ibm-plex-sans/600.css",
        "@fontsource/ibm-plex-mono/400.css",
        "@fontsource/ibm-plex-mono/600.css",
      ],
      editLink: {
        baseUrl:
          "https://github.com/social-embed/social-embed/edit/master/packages/site/",
      },
      favicon: "/favicon.ico",
      head: [
        {
          attrs: {
            client: "load",
            src: "/js/o-embed.bundled.js",
            type: "module",
          },
          tag: "script",
        },
      ],
      logo: {
        src: "./src/assets/img/logo.svg",
      },
      sidebar: [
        "getting-started",
        {
          autogenerate: { directory: "lib" },
          badge: { text: "lib", variant: "note" },
          label: "Library",
        },
        {
          autogenerate: { directory: "wc" },
          badge: { text: "wc", variant: "tip" },
          label: "Web Component",
        },
        "migration",
        "news",
      ],
      social: {
        codeberg: "https://codeberg.org/social-embed/social-embed",
        github: "https://github.com/social-embed/social-embed",
        gitlab: "https://gitlab.com/social-embed/social-embed",
      },
      title: "social-embed",
    }),
    react(),
    tailwind({
      // Disable the default base styles:
      applyBaseStyles: false,
    }),
    starlightDocSearch({
      apiKey: "a59a27c90979939bd097dcb51d8f22e3",
      appId: "BIATGF4K4K",
      indexName: "social-embed",
    }),
  ],
  site: "https://social-embed.git-pull.com",
});
