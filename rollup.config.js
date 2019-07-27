import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'

const pkg = require('./package.json');

/**
 * @param {string} [tsConfigFile=tsconfig.json]
 * @return {*[]}
 */
const plugins = (tsConfigFile = 'tsconfig.json') => {
  const defaultPlugins = [
    // Allow json resolution
    json(),

    // Compile TypeScript files
    typescript({
      tsconfig: tsConfigFile,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        'sourceMap': true
      }
    }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve()
  ];

  return [
    ... defaultPlugins,
    sourceMaps()
  ];
};

export const bundle = () => {
  return {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'esm', sourcemap: true },
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
  const isProduction = commandLineArgs && commandLineArgs['config-production'] || false;
  return bundle();
}
