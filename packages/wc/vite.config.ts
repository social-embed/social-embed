import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/OEmbedElement.ts',
      formats: ['es', 'umd'],
      name: 'oembed',
      fileName: 'OEmbedElement',
    },
    minify: false,
    manifest: false,
  },
  plugins: [dts()],
});
