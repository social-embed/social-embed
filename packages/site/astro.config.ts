import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import starlightDocSearch from "@astrojs/starlight-docsearch";
import tailwind from "@astrojs/tailwind";
import type { AstroUserConfig } from "astro/config";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Experimental fonts API configuration
  experimental: {
    fonts: [
      // IBM Plex Sans
      {
        cssVariable: "--font-ibm-plex-sans",
        fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
        name: "IBM Plex Sans",
        optimizedFallbacks: true,
        provider: "local",
        variants: [
          {
            display: "swap",
            src: [
              {
                url: "../../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2",
              },
            ],
            style: "normal",
            weight: "400",
          },
          {
            display: "swap",
            src: [
              {
                url: "../../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2",
              },
            ],
            style: "normal",
            weight: "600",
          },
        ],
      },
      // IBM Plex Mono
      {
        cssVariable: "--font-ibm-plex-mono",
        fallbacks: ["ui-monospace", "monospace"],
        name: "IBM Plex Mono",
        optimizedFallbacks: true,
        provider: "local",
        variants: [
          {
            display: "swap",
            src: [
              {
                url: "../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
              },
            ],
            style: "normal",
            weight: "400",
          },
          {
            display: "swap",
            src: [
              {
                url: "../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2",
              },
            ],
            style: "normal",
            weight: "600",
          },
        ],
      },
    ],
  },
  integrations: [
    starlight({
      components: {
        Footer: "./src/components/Footer.astro",
        Head: "./src/components/Head.astro",
        Search: "./src/components/Search.astro",
      },
      credits: true,
      customCss: [
        // Path to your Tailwind base styles:
        "./src/tailwind.css",
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
      social: [
        { icon: "codeberg", link: "https://codeberg.org/social-embed/social-embed" },
        { icon: "github", link: "https://github.com/social-embed/social-embed" },
        { icon: "gitlab", link: "https://gitlab.com/social-embed/social-embed" },
      ],
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
} satisfies AstroUserConfig);
