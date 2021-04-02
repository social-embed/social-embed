process.env.NODE_ENV = 'test';
import {defaultReporter} from '@web/test-runner';
import {default as specReporter} from './spec-reporter.js';
import {importMapsPlugin} from '@web/dev-server-import-maps';

export default {
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            // mock a dependeny
            '../dist/index.js': './dist/index.js',
            '@social-embed/wc': './dist/index.js',
            'package-a': '/mocks/package-a.js',
            // mock a module in your own code
            '/src/my-module.js': '/mocks/my-module.js',
          },
        },
      },
    }),
  ],
  reporters: [
    defaultReporter({reportTestResults: true, reportTestProgress: true}),
    specReporter(),
  ],
};
