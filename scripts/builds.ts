import { join } from 'path'
import execa from 'execa'
import { existsSync } from 'fs'
import chalk from 'chalk'
import yargs from 'yargs-parser'
import { pkgRoot } from '../build/paths'
const { log } = console

const clean = async function (
  cwd: string,
  packageName: string,
  shortName: string
) {
  log(chalk`{cyan Cleaning ${packageName}} from {grey packages/${shortName}}\n`)
  await execa('rimraf', [join(cwd, 'es')], { stdio: 'inherit' })
  await execa('rimraf', [join(cwd, 'lib')], { stdio: 'inherit' })
}

const build = async function (packageName: string, shortName: string) {
  log(chalk`{cyan Building ${packageName}} from {grey packages/${shortName}}\n`)
  await execa(
    'rollup',
    [
      '-c',
      '--environment',
      [`PKG:${shortName}`, 'NODE_ENV:production'].filter(Boolean).join(','),
    ],
    { stdio: 'inherit' }
  )
}

;(async () => {
  try {
    const argv = yargs(process.argv.slice(2))
    const packageName = argv.pkg
    if (!packageName) {
      throw new RangeError('pkg must be specified via --pkg packageName.')
    }
    const shortName = packageName.replace(/^@.+\//, '')
    const cwd = join(pkgRoot, shortName)
    if (!cwd || !existsSync(cwd)) {
      throw new RangeError(`Could not find directory for package: ${shortName}`)
    }
    await clean(cwd, packageName, shortName)
    await build(packageName, shortName)
  } catch (e) {
    log(e)
    process.exit(1)
  }
})()
