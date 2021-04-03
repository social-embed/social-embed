/** @type {import('@docusaurus/types').DocusaurusConfig} */
// const typegenOptions = require('./typedoc.js');
// console.log({typegenOptions});
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

    // [
    //   'docusaurus-plugin-typedoc',
    //
    //   // Plugin / TypeDoc options
    //   {
    //     ...typegenOptions,
    //     sidebar: {
    //       sidebarFile: 'typedoc-sidebar.js',
    //       fullNames: false,
    //     },
    //   },
    // ],
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
          href: 'https://social-embed.git-pull.com/api/',
          label: 'API Reference',
          position: 'left',
          to: 'https://social-embed.git-pull.com/api/',
          items: [
            {
              href: 'https://social-embed.git-pull.com/api/modules/lib.html',
              label: 'library (lib)',
            },
            {
              href: 'https://social-embed.git-pull.com/api/modules/wc.html',
              label: 'web component (wc)',
            },
          ],
        },
        {
          href:
            'https://github.com/social-embed/social-embed/blob/master/CHANGES.md',
          label: 'Release notes',
          position: 'left',
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
          label: 'GitHub',
          position: 'right',
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
