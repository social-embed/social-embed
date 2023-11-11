import path from "path";

import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes } from "prism-react-renderer";

const { github: lightCodeTheme, dracula: darkCodeTheme } = themes;

const config: Config = {
  title: "@social-embed",
  tagline: "Instantly integrate with embed-friendly websites",
  url: "https://social-embed.git-pull.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "social-embed", // Usually your GitHub org/user name.
  projectName: "social-embed", // Usually your repo name.

  scripts: ["/js/o-embed.bundled.js"],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    path.resolve(__dirname, "plugins", "more-mdx-paths"),
    "@docusaurus/theme-live-codeblock",
  ],

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsed: false,
          editUrl:
            "https://github.com/social-embed/social-embed/edit/master/packages/site/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        googleAnalytics: {
          trackingID: "G-6LZEGR7SKM",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "@social-embed",
      logo: {
        alt: "git-pull",
        src: "img/logo.svg",
      },
      items: [
        {
          docid: "lib/index",

          to: "/docs/lib",
          label: "Library (lib)",
          activeBaseRegex: "^/docs/lib",
        },
        {
          docid: "wc/index",

          to: "/docs/wc",
          label: "Web Component (wc)",
          activeBaseRegex: "^/docs/wc",
        },
        {
          to: "/docs/news/",
          label: "Release notes",
          position: "left",
          items: [
            {
              href: "/docs/lib/release-notes",
              label: "Library (lib)",
              docid: "lib/release-notes",
            },
            {
              href: "/docs/wc/release-notes",
              label: "Web Component (wc)",
              docid: "wc/release-notes",
            },
          ],
        },
        {
          label: "Playground",
          position: "right",
          items: [
            {
              href: "https://codepen.io/attachment/pen/VwPPrNq",
              label: "lib on codepen",
            },
            {
              href: "https://codepen.io/attachment/pen/poRRpdp?editors=0010",
              label: "lib on codepen (w/ console)",
            },
            {
              href: "https://jsfiddle.net/gitpull/pcLagbsm/",
              label: "lib on jsfiddle",
            },
            {
              href: "https://codepen.io/attachment/pen/poRRwdy",
              label: "web component on codepen",
            },
            {
              href: "https://jsfiddle.net/gitpull/vc13Lhkz/",
              label: "web component on jsfiddle",
            },
          ],
        },

        {
          position: "right",
          className: "header-npm-link",
          "aria-label": "NPM",
          items: [
            {
              href: "https://www.npmjs.com/package/@social-embed/lib",
              label: "@social-embed/lib",
            },
            {
              href: "https://www.npmjs.com/package/@social-embed/wc",
              label: "@social-embed/wc",
            },
          ],
        },
        {
          to: "https://github.com/social-embed/social-embed",
          className: "header-github-link",
          "aria-label": "GitHub repository",
          position: "right",
          items: [
            {
              href: "https://github.com/social-embed/social-embed/tree/master/packages/lib",
              label: "@social-embed/lib",
            },
            {
              href: "https://github.com/social-embed/social-embed/tree/master/packages/wc",
              label: "@social-embed/wc",
            },
          ],
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "docs/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub Discussions",
              href: "https://github.com/social-embed/social-embed/discussions",
            },
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/social-embed",
            },
          ],
        },
      ],
      copyright: `Copyright © 2021-${new Date().getFullYear()} <a href="https://www.git-pull.com" target="_blank" class="footer__link-item">Tony Narlock</a>. Built with Docusaurus.`,
    },

    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
    algolia: {
      appId: "BIATGF4K4K",
      apiKey: "a59a27c90979939bd097dcb51d8f22e3",
      indexName: "social-embed",
      facetFilters: ["type:content", "type:hierarchy"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
