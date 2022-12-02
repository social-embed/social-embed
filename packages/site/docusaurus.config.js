// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '@social-embed',
  tagline: 'Instantly integrate with embed-friendly websites',
  url: 'https://social-embed.git-pull.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'social-embed', // Usually your GitHub org/user name.
  projectName: 'social-embed', // Usually your repo name.

  scripts: ['/js/o-embed.bundled.js'],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: ['@docusaurus/theme-live-codeblock'],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarCollapsed: false,
          editUrl:
            'https://github.com/social-embed/social-embed/edit/master/packages/site/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'G-6LZEGR7SKM',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '@social-embed',
        logo: {
          alt: 'git-pull',
          src: 'img/logo.svg',
        },
        items: [
          {
            docId: 'lib/index',

            to: '/docs/lib',
            label: 'Library (lib)',
            activeBaseRegex: '^/docs/lib',
          },
          {
            docId: 'wc/index',

            to: '/docs/wc',
            label: 'Web Component (wc)',
            activeBaseRegex: '^/docs/wc',
          },
          {
            to: '/docs/news/',
            label: 'Release notes',
            position: 'left',
            items: [
              {
                href: '/docs/lib/release-notes',
                label: 'Library (lib)',
                docId: 'lib/release-notes',
              },
              {
                href: '/docs/wc/release-notes',
                label: 'Web Component (wc)',
                docId: 'wc/release-notes',
              },
            ],
          },
          {
            label: 'Playground',
            position: 'right',
            items: [
              {
                href: 'https://codepen.io/attachment/pen/VwPPrNq',
                label: 'lib on codepen',
              },
              {
                href: 'https://codepen.io/attachment/pen/poRRpdp?editors=0010',
                label: 'lib on codepen (w/ console)',
              },
              {
                href: 'https://jsfiddle.net/gitpull/pcLagbsm/',
                label: 'lib on jsfiddle',
              },
              {
                href: 'https://codepen.io/attachment/pen/poRRwdy',
                label: 'web component on codepen',
              },
              {
                href: 'https://jsfiddle.net/gitpull/vc13Lhkz/',
                label: 'web component on jsfiddle',
              },
            ],
          },

          {
            position: 'right',
            className: 'header-npm-link',
            'aria-label': 'NPM',
            items: [
              {
                href: 'https://www.npmjs.com/package/@social-embed/lib',
                label: '@social-embed/lib',
              },
              {
                href: 'https://www.npmjs.com/package/@social-embed/wc',
                label: '@social-embed/wc',
              },
            ],
          },
          {
            to: 'https://github.com/social-embed/social-embed',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
            position: 'right',
            items: [
              {
                href: 'https://github.com/social-embed/social-embed/tree/master/packages/lib',
                label: '@social-embed/lib',
              },
              {
                href: 'https://github.com/social-embed/social-embed/tree/master/packages/wc',
                label: '@social-embed/wc',
              },
            ],
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: 'docs/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/social-embed/social-embed/discussions',
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/social-embed',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Tony Narlock. Built with Docusaurus.`,
      },

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: 'BIATGF4K4K',
        apiKey: '4139ba128ad8360b86a316425c20ff50',
        indexName: 'social-embed',
        facetFilters: ['type:content', 'type:hierarchy'],
      },
    }),
};

module.exports = config;
