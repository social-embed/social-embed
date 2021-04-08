/** @type {import('@docusaurus/types').DocusaurusConfig} */
const path = require('path');
module.exports = {
  title: '@social-embed',
  tagline: 'Instantly integrate with embed-friendly websites',
  url: 'https://social-embed.git-pull.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  onBrokenLinks: 'warn', // ignore until we find a way to support /api/
  scripts: ['/js/o-embed.bundled.js'],

  plugins: [
    path.resolve(__dirname, 'plugins', 'more-mdx-paths'),
    '@docusaurus/theme-live-codeblock',
    '@docusaurus/plugin-google-gtag',
    [
      'docusaurus-plugin-typedoc',

      // Plugin / TypeDoc options
      {
        id: 'lib-api',
        out: `lib/api`,
        docsRoot: 'docs',
        watch: process.env.TYPEDOC_WATCH,
        entryPoints: [`../lib/src/index.ts`],
        allReflectionsHaveOwnDocument: false,
        readme: 'none',
        tsconfig: require.resolve(`./tsconfig.json`),
        sidebar: {
          sidebarFile: 'typedoc-sidebar-lib.js',
        },
      },
    ],
    [
      'docusaurus-plugin-typedoc',

      // Plugin / TypeDoc options
      {
        id: 'wc-api',
        out: `wc/api`,
        docsRoot: 'docs',
        readme: 'none',
        tsconfig: require.resolve(`./tsconfig.json`),
        watch: process.env.TYPEDOC_WATCH,
        entryPoints: [`../wc/index.ts`],
        excludeExternals: true,
        allReflectionsHaveOwnDocument: false,
        sidebar: {
          sidebarFile: 'typedoc-sidebar-wc.js',
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: '@social-embed',
      logo: {
        alt: 'git-pull',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
          items: [
            {
              // type and docId not working...
              type: 'doc',
              docId: 'lib/index',

              to: '/docs/lib/',
              label: 'library (lib)',
            },
            {
              // type and docId not working...
              type: 'doc',
              docId: 'wc/index',

              to: '/docs/wc/',
              label: 'web component (wc)',
            },
          ],
        },
        {
          label: 'API Reference',
          position: 'left',
          items: [
            {
              href: '/docs/lib/api',
              label: 'library (lib)',
            },
            {
              href: '/docs/wc/api',
              label: 'web component (wc)',
            },
          ],
        },
        {
          to: '/docs/news/',
          label: 'Release notes',
          position: 'left',
          items: [
            {
              href: '/docs/lib/release-notes',
              label: 'library (lib)',
            },
            {
              href: '/docs/wc/release-notes',
              label: 'web component (wc)',
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
          label: 'NPM',
          position: 'right',
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
              href:
                'https://github.com/social-embed/social-embed/tree/master/packages/lib',
              label: '@social-embed/lib',
            },
            {
              href:
                'https://github.com/social-embed/social-embed/tree/master/packages/wc',
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
    algolia: {
      apiKey: '4139ba128ad8360b86a316425c20ff50',
      indexName: 'social-embed',
      contextualSearch: true,
    },
    gtag: {trackingID: 'G-6LZEGR7SKM'},
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/social-embed/social-embed/edit/master/packages/site/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
