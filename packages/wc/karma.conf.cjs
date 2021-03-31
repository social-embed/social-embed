const {createDefaultConfig} = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = (config) => {
  config.set(
    merge(createDefaultConfig(config), {
      frameworks: ['esm', 'mocha', 'chai'],
      client: {
        mocha: {ui: 'tdd'},
      },
      plugins: [require.resolve('@open-wc/karma-esm')],
      browsers: ['ChromeHeadlessNoSandbox'],
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
          base: 'ChromeHeadless',
          flags: [
            '--no-sandbox', //default karma-esm configuration
            '--disable-setuid-sandbox', //default karma-esm configuration
            '--enable-experimental-web-platform-features', // necessary when using importMap option
          ],
        },
      },

      files: [
        {
          pattern: config.grep ? config.grep : 'dist/test/**/*_test.js',
          type: 'module',
        },
      ],
      // See the karma-esm docs for all options
      esm: {
        nodeResolve: true,
        importMap: {
          '@social-embed/lib': '../lib/dist/index.js',
        },
      },
    })
  );
  return config;
};
