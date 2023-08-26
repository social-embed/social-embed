import { esbuildPlugin } from "@web/dev-server-esbuild";
import { importMapsPlugin } from "@web/dev-server-import-maps";
import { defaultReporter } from "@web/test-runner";
import { puppeteerLauncher } from "@web/test-runner-puppeteer";

process.env.NODE_ENV = "test";

export default {
  browsers: [
    puppeteerLauncher({ concurrency: 1, launchOptions: { headless: "new" } }),
  ],
  plugins: [
    esbuildPlugin({ ts: true }),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            "@social-embed/wc": "./src/OEmbedElement.ts",
          },
        },
      },
    }),
  ],
  reporters: [
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
  ],
};
