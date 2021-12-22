import path from 'path'
import { pkgRoot } from './paths'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
if (!process.env.PKG) {
  throw new Error('pkg package must be specified via --environment flag.')
}
const packageDir = path.resolve(pkgRoot, process.env.PKG)
const resolve = (p) => path.resolve(packageDir, p)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(path.resolve(packageDir, 'package.json'))
const { name, version } = pkg
const isDev = process.env.NODE_ENV !== 'production'

const plugins = [
  typescript({
    cwd: packageDir,
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
const banner = `/*! Advanced Elements ${name}-v${version} */\n`
const config = {
  input: resolve('index.ts'),
  output: [
    {
      name,
      file: resolve('es/index.mjs'),
      format: 'esm',
      sourcemap: isDev,
      globals: {
        vue: 'vue',
        'element-plus': 'element-plus',
        'vue-router': 'vue-router',
      },
      banner,
    },
    {
      name,
      file: resolve('lib/index.js'),
      format: 'umd',
      sourcemap: isDev,
      exports: 'named',
      globals: {
        vue: 'vue',
        'element-plus': 'element-plus',
        'vue-router': 'vue-router',
      },
      banner,
    },
  ],
  external: ['vue', 'element-plus'],
  plugins,
}

export default config
