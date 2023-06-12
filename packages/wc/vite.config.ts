import {defineConfig} from 'vite';

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
});
