const path = require(`path`);

// Credit: yarn-berry https://github.com/yarnpkg/berry/tree/ac93d15/packages/gatsby

module.exports = {
  name: `@social-embed`,
  tsconfig: require.resolve(`../../tsconfig.json`),
  inputFiles: [`./packages/`, `./packages/lib/src/providers`],
  mode: `modules`,
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
  ignoreCompilerErrors: true,
  preserveConstEnums: 'true',
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
};
