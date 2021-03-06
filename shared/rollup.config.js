import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const isDev = process.env.NODE_ENV !== 'production'

const plugins = [
  typescript({
    tsconfig: 'tsconfig.json',
  }),
  vue({ target: 'browser' }),
  nodeResolve({
    extensions: ['.mjs', '.js', '.json', '.ts'],
  }),
  commonjs(),
  esbuild({
    sourceMap: true,
    target: 'es2018',
  }),
  postcss({
    plugins: [require('autoprefixer')],
    minimize: !isDev,
  }),
  !isDev && terser({ toplevel: true }),
]

function createBanner(pkg) {
  return `/*! Advanced Elements ${pkg.name}-v${pkg.version} */\n`
}

function createOutput(option, pkg) {
  return {
    ...option,
    globals: {
      vue: 'vue',
      'element-plus': 'element-plus',
      'vue-router': 'vue-router',
    },
    banner: createBanner(pkg),
  }
}

export function createConfig(pkg) {
  return {
    input: 'index.ts',
    output: [
      createOutput(
        {
          name: pkg.name,
          file: 'es/index.mjs',
          format: 'esm',
          sourcemap: isDev,
        },
        pkg
      ),
      createOutput(
        {
          name: pkg.name,
          file: 'lib/index.js',
          format: 'umd',
          sourcemap: isDev,
          exports: 'named',
        },
        pkg
      ),
    ],
    external: ['vue', 'element-plus'],
    plugins,
  }
}
