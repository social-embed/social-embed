import {defineConfig} from 'vite';

// https://vitejs.dev/config/

// Library build
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    minify: false,
  },
});

// Application build
// export default defineConfig({});
