process.env.NODE_ENV = 'test';
import {defaultReporter} from '@web/test-runner';
import {esbuildPlugin} from '@web/dev-server-esbuild';
import {importMapsPlugin} from '@web/dev-server-import-maps';

export default {
  plugins: [
    esbuildPlugin({ts: true}),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            '@social-embed/wc': './src/OEmbedElement.ts',
          },
        },
      },
    }),
  ],
  reporters: [
    defaultReporter({reportTestResults: true, reportTestProgress: true}),
  ],
};
