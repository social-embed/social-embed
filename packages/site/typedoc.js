const path = require(`path`);

// Credit: yarn-berry https://github.com/yarnpkg/berry/tree/ac93d15/packages/gatsby
module.exports = {
  name: `@social-embed`,
  tsconfig: require.resolve(`./tsconfig.json`),
  entryPoints: [`../lib/src/index.ts`, `../wc/src/OEmbedElement.ts`],
  // entryPoints: [`../../`],
  // entryPoints: [`../`],
  // inputFiles: [`./packages/`],
  out: `./dist/api`,
  theme: `${path.dirname(
    require.resolve(`typedoc-neo-theme/package.json`)
  )}/bin/default`,
  customStyles: [
    {
      path: '/typedoc-style.css',
    },
  ],
  plugin: [`typedoc-neo-theme`, `@strictsoftware/typedoc-plugin-monorepo`],
  'external-modulemap': `.*packages/([^/]+)/.*`,
  links: [
    {
      label: `Back to homepage`,
      url: `../`,
    },
    {
      label: `API`,
      url: `/api/`,
    },
    {
      label: `GitHub`,
      url: `https://github.com/social-embed/social-embed`,
    },
  ],
  outline: [
    {
      'Generic Packages': {
        '@social-embed/lib': `lib`,
      },
      'UI Packages': {
        '@social-embed/wc': `wc`,
      },
    },
  ],
  source: [
    {
      path: `https://github.com/social-embed/social-embed/tree/master/`,
      line: `L`,
    },
  ],
  exclude: [
    '**/*+(index|.spec|test|.e2e).ts',
    '**/node_modules/**',
    '**test**',
    '**/lib/test/**'
  ],
  externalPattern: '**/(node_modules|test|diff|doc)/**',
  excludeExternals: true,
};
// module.exports = {
//   name: `@social-embed`,
//   tsconfig: require.resolve(`../../tsconfig.json`),
//   inputFiles: [`./packages/`, `./packages/lib/src/providers`],
//   mode: `modules`,
//   docsRoot: 'docs',
//   out: `api`,
//   // theme: `${path.dirname(
//   //   require.resolve(`typedoc-neo-theme/package.json`)
//   // )}/bin/default`,
//   // customStyles: [
//   //   {
//   //     path: '/typedoc-style.css',
//   //   },
//   // ],
//   // plugin: [
//   //   // `typedoc-neo-theme`,
//   //   `@strictsoftware/typedoc-plugin-monorepo`,
//   // ],
//   // 'external-modulemap': `.*packages/([^/]+)/.*`,
//   exclude: '**/*+(index|.spec|test|.e2e).ts',
//   source: [
//     {
//       path: `https://github.com/social-embed/social-embed/tree/master/`,
//       line: `L`,
//     },
//   ],
// };
