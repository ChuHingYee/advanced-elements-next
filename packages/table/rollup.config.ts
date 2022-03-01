import { createConfig } from '../../shared/rollup.config'
import pkg from './package.json'

export default {
  ...createConfig(pkg),
}
