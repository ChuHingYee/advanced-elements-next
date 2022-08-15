import { createConfig } from '../../shared/rollup.config'
import pkg from './package.json'

const config = createConfig(pkg)

export default {
  ...config,
  external: [...config.external, 'lodash-es', '@vueuse/core'],
}
