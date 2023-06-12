process.env.NODE_ENV = 'test';
import {defaultReporter} from '@web/test-runner';
import {esbuildPlugin} from '@web/dev-server-esbuild';
import {importMapsPlugin} from '@web/dev-server-import-maps';
import {puppeteerLauncher} from '@web/test-runner-puppeteer';

export default {
  browsers: [
    puppeteerLauncher({concurrency: 1, launchOptions: {headless: 'new'}}),
  ],
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
