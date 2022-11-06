import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import styles from 'rollup-plugin-styles';
import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import {visualizer} from 'rollup-plugin-visualizer';

import pkg from './package.json' assert {type: 'json'};

const extensions = ['.js', '.ts', '.jsx', '.tsx'];
const resolveConfig = {
  extensions,
  preferBuiltins: true,
  mainFields: ['browser'],
};

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default {
  input: ['./src/index.ts'],
  output: {
    dir: 'dist',
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true,
    assetFileNames: 'assets/[name][extname]',
  },
  plugins: [
    copy({
      targets: [{src: 'src/styles/**/*', dest: 'dist/assets'}],
    }),
    resolve(resolveConfig),
    commonjs(),
    styles({
      mode: ['extract', 'all.css'],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      outputToFilesystem: true,
    }),
    terser(),
    visualizer({
      filename: 'bundle-analysis.html',
      open: false,
    }),
  ],
  external,
};
