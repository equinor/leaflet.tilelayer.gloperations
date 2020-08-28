import autoprefixer from 'autoprefixer';
import typescript from 'typescript';

import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';
import glslifyPlugin from './rollup-plugin-glslify-cli';
import resolve from '@rollup/plugin-node-resolve';
import postcssPlugin from 'rollup-plugin-postcss';
import typescriptPlugin from 'rollup-plugin-typescript2';

import pkg from './package.json';

const commonPlugins = [
  glslifyPlugin(),
  postcssPlugin({
    plugins: [autoprefixer],
  }),
  typescriptPlugin({
    clean: true,
    typescript,
  }),
];

export default [
  {
    input: 'src/index.ts',
    output: [
      // CommonJS bundle
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      // ES Module bundle
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    onwarn: function (warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: commonPlugins,
  },
  // IIFE bundle, for use in a <script> tag. Dependencies other than Leaflet are bundled too.
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.min.js',
      format: 'iife',
      name: 'L.TileLayer.GLOperations',
      globals: { leaflet: 'L' },
      sourcemap: true,
    },
    onwarn: function (warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    },
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      resolve({
        mainFields: ['browser', 'jsnext:main', 'module', 'main'],
        preferBuiltins: false,
      }),
      commonjs(),
      ...commonPlugins,
      terser(),
    ],
  },
];
