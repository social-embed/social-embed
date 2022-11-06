// Import rollup plugins
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import {getBabelOutputPlugin} from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {summary} from 'rollup-plugin-summary';

export default {
  // Entry point for application build; can specify a glob to build multiple
  input: './src/OEmbedElement.ts',
  plugins: [
    // htmlPlugin,
    replace({'Reflect.decorate': 'undefined'}),
    // Resolve bare module specifiers to relative paths
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      outputToFilesystem: true,
    }),

    // Minify JS
    terser({
      ecma: 2017,
      module: true,
      warnings: true,
    }),
    // Print bundle summary
    summary(),
  ],
  output: [
    {
      // Modern JS bundles (no JS compilation, ES module output)
      format: 'esm',
      name: 'oembed',
      file: 'dist/OEmbedElement.js',
    },
    {
      // Legacy JS bundles (ES5 compilation and SystemJS module output)
      format: 'esm',
      name: 'oembed',

      file: 'dist/OEmbedElement.legacy.js',
      plugins: [
        getBabelOutputPlugin({
          compact: true,
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  ie: '11',
                },
                modules: 'systemjs',
              },
            ],
          ],
        }),
      ],
    },
    {
      file: 'dist/OEmbedElement.umd.js',
      name: 'oembed',
      format: 'umd',
    },
  ],
  preserveEntrySignatures: false,
};
