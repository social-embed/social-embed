/** @type {import('@docusaurus/types').DocusaurusConfig} */
// const typegenOptions = require('./typedoc.js');
// console.log({typegenOptions});
module.exports = {
  title: '@social-embed',
  tagline: 'Easy embedding',
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
        },
        {
          href: 'https://social-embed.git-pull.com/api/',
          label: 'API Reference',
          position: 'left',
          items: [
            {
              href: 'https://social-embed.git-pull.com/api/',
              label: 'Homepage',
            },
            {
              href: 'https://social-embed.git-pull.com/api/modules/lib.html',
              label: 'utility functions (lib)',
            },
            {
              href: 'https://social-embed.git-pull.com/api/modules/wc.html',
              label: '<o-embed> web component (wc)',
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
          href: 'https://github.com/social-embed/social-embed',
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
