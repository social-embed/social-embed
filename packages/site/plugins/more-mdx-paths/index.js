// credit: @slorber
// https://github.com/facebook/docusaurus/issues/3272#issuecomment-688409489
// This lets us resolve symlinks from outside (root-level repo, packages/*/CHANGES.md)
module.exports = (context, options) => ({
    name: "more-mdx-paths",
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          symlinks: false,
        },
      };
    },
  });
