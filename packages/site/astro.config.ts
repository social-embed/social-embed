import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import type { ViteUserConfig } from "astro";
import { defineConfig, fontProviders } from "astro/config";
import expressiveCode from "astro-expressive-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { pagefindIntegration } from "./plugins/astro-pagefind-integration";
import { rehypeSkipFirstHeading } from "./plugins/rehype-skip-first-heading";
import { localCdnPlugin } from "./plugins/vite-plugin-local-cdn";
import { viteMdxMergeHeadings } from "./plugins/vite-plugin-mdx-merge-headings";

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

/**
 * Get current git commit SHA for cache-busting esm.sh URLs.
 * Safe: uses execFileSync (no shell), no user input.
 */
function getGitSha(): string {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf-8",
    }).trim();
  } catch {
    return "";
  }
}

type VitePlugin = NonNullable<ViteUserConfig["plugins"]>[number];
const tailwindPlugin = tailwindcss() as unknown as VitePlugin;
const localCdn = localCdnPlugin() as unknown as VitePlugin;
const mdxMergeHeadings = viteMdxMergeHeadings() as unknown as VitePlugin;

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
        options: {
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
        provider: fontProviders.local(),
      },
      // IBM Plex Mono
      {
        cssVariable: "--font-ibm-plex-mono",
        fallbacks: ["ui-monospace", "monospace"],
        name: "IBM Plex Mono",
        optimizedFallbacks: true,
        options: {
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
        provider: fontProviders.local(),
      },
    ],
  },
  integrations: [
    expressiveCode({
      styleOverrides: {
        borderRadius: "0.5rem",
        codeFontFamily: "var(--font-mono)",
        codeFontSize: "0.875rem",
        codePaddingBlock: "1rem",
        codePaddingInline: "1rem",
        frames: {
          shadowColor: "transparent",
        },
      },
      themeCssSelector: (theme) => `[data-theme="${theme.type}"]`,
      themes: ["github-dark", "github-light"],
    }),
    mdx(),
    react(),
    pagefindIntegration(),
  ],
  // Markdown processing for pure Astro pages
  markdown: {
    rehypePlugins: [
      rehypeSkipFirstHeading,
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          content: {
            children: [{ type: "text", value: "#" }],
            properties: { ariaHidden: "true", className: ["anchor-icon"] },
            tagName: "span",
            type: "element",
          },
          properties: {
            className: ["anchor-link"],
          },
        },
      ],
    ],
  },
  redirects: {
    "/playground": "/wc/playground/",
  },
  site: "https://social-embed.org",
  vite: {
    define: {
      __GIT_BRANCH__: JSON.stringify(getGitBranch()),
      __GIT_SHA__: JSON.stringify(getGitSha()),
    },
    // Astro uses Vite 6 while @tailwindcss/vite targets Vite 7 types.
    plugins: [tailwindPlugin, localCdn, mdxMergeHeadings],
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
