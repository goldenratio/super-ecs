import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import sourceMaps from 'rollup-plugin-sourcemaps'
import generateDeclarations from 'rollup-plugin-generate-declarations';

const pkg = require('./package.json');

/**
 * @return {*[]}
 */
const plugins = () => {
  const defaultPlugins = [
    // Allow json resolution
    json(),

    // Compile TypeScript files
    typescript(),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    sourceMaps(),
    generateDeclarations()
  ];

  return defaultPlugins;
};

export const bundle = () => {
  return {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'esm', sourcemap: true },
      { file: pkg.umd, format: 'umd', name: 'superECS', sourcemap: true },
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'src/**',
    },
    plugins: plugins()
  }
};

export default commandLineArgs => {
  return bundle();
}
