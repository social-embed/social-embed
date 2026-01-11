import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import starlightDocSearch from "@astrojs/starlight-docsearch";
import tailwindcss from "@tailwindcss/vite";
import type { ViteUserConfig } from "astro";
import { defineConfig } from "astro/config";
import { localCdnPlugin } from "./plugins/vite-plugin-local-cdn";

/**
 * Get current git branch for esm.sh GitHub URLs.
 * Safe: uses execFileSync (no shell), no user input.
 */
function getGitBranch(): string {
  try {
    return execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      encoding: "utf-8",
    }).trim();
  } catch {
    return "master";
  }
}

type VitePlugin = NonNullable<ViteUserConfig["plugins"]>[number];
const tailwindPlugin = tailwindcss() as unknown as VitePlugin;
const localCdn = localCdnPlugin() as unknown as VitePlugin;

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
        Header: "./src/components/Header.astro",
        PageFrame: "./src/components/PageFrame.astro",
        Search: "./src/components/Search.astro",
        ThemeSelect: "./src/components/ThemeSelect.astro",
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
            src: "/cdn/o-embed.js",
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
          badge: { text: "try it", variant: "success" },
          collapsed: false,
          items: [
            { label: "Interactive", link: "/lib/playground/" },
            { label: "More Sandboxes", link: "/lib/playground/external" },
          ],
          label: "Lib Playground",
        },
        {
          autogenerate: { directory: "wc" },
          badge: { text: "wc", variant: "tip" },
          label: "Web Component",
        },
        {
          badge: { text: "try it", variant: "success" },
          collapsed: false,
          items: [
            { label: "Interactive", link: "/wc/playground/" },
            { label: "More Sandboxes", link: "/wc/playground/external" },
          ],
          label: "WC Playground",
        },
        "migration",
        "news",
      ],
      social: [
        {
          href: "https://codeberg.org/social-embed/social-embed",
          icon: "codeberg",
          label: "Codeberg",
        },
        {
          href: "https://github.com/social-embed/social-embed",
          icon: "github",
          label: "GitHub",
        },
        {
          href: "https://gitlab.com/social-embed/social-embed",
          icon: "gitlab",
          label: "GitLab",
        },
      ],
      title: "social-embed",
    }),
    react(),
    starlightDocSearch({
      apiKey: "a59a27c90979939bd097dcb51d8f22e3",
      appId: "BIATGF4K4K",
      indexName: "social-embed",
    }),
  ],
  redirects: {
    "/playground": "/wc/playground/",
  },
  site: "https://social-embed.org",
  vite: {
    define: {
      __GIT_BRANCH__: JSON.stringify(getGitBranch()),
    },
    // Astro uses Vite 6 while @tailwindcss/vite targets Vite 7 types.
    plugins: [tailwindPlugin, localCdn],
    resolve: {
      alias: {
        "@social-embed/lib": resolve(
          import.meta.dirname,
          "../lib/src/index.ts",
        ),
      },
    },
  },
});
