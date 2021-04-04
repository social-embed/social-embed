process.env.NODE_ENV = 'test';
import {defaultReporter} from '@web/test-runner';
import {esbuildPlugin} from '@web/dev-server-esbuild';
import {importMapsPlugin} from '@web/dev-server-import-maps';
import {default as specReporter} from './spec-reporter.js';

export default {
  plugins: [
    esbuildPlugin({ts: true}),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            '@social-embed/wc': './index.ts',
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
