import chalk from 'chalk'
import { join } from 'path'
import { execSync as exec } from 'child_process'
import { docsRoot } from '../shared/paths'
const filesPath = join(docsRoot, '.vitepress', 'dist')
const { log } = console

const buildFile = () => {
  log(chalk`{bgCyan Building Files}`)
  exec('pnpm docs:build')
}

const commit = () => {
  log(chalk`{bgCyan Committing}`)
  exec('git init', {
    stdio: 'inherit',
    cwd: filesPath,
  })
  exec('git add -D', {
    stdio: 'inherit',
    cwd: filesPath,
  })
  exec('git commit -m deploy', {
    stdio: 'inherit',
    cwd: filesPath,
  })
}

const publish = async () => {
  log(chalk`{bgCyan Publish Changes}`)
  exec(
    'git push -f git@github.com:ChuHingYee/advanced-elements-next.git master:gh-pages',
    {
      stdio: 'inherit',
      cwd: filesPath,
    }
  )
}

;(() => {
  try {
    log(chalk`{bgYellow Releasing Docs\n}`)
    buildFile()
    commit()
    publish()
  } catch (e) {
    log(e)
    process.exit(1)
  }
})()
