import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Builds a plugin-market format-1 index for every bundle package in this repo.
// Usage: node market/build-index.mjs https://github.com/<you>/<repo>
// The install targets are pinned to the CURRENT HEAD commit, so commit the
// packages first, then run this, then commit the generated market-index.json.

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const repo = process.argv[2]

if (typeof repo !== 'string' || !/^https:\/\/[^/]+\/[^/]+\/[^/]+$/.test(repo)) {
  console.error('usage: node market/build-index.mjs https://github.com/<you>/<repo>')
  console.error('The repository URL must be an https URL with at least two path segments.')
  process.exit(2)
}

const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root }).toString().trim()
if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error(`unexpected commit: ${commit}`)

const timestamp = Math.floor(Date.now() / 1000)
const plugins = []

for (const name of readdirSync(root).sort()) {
  const dir = join(root, name)
  if (name === 'market' || !statSync(dir).isDirectory()) continue
  const manifestPath = join(dir, 'package.json')
  if (!existsSync(manifestPath)) continue
  const pkg = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (pkg.dsh?.bundle?.patch === undefined) {
    console.warn(`skip ${name}: not a bundle (no dsh.bundle.patch)`)
    continue
  }

  const iconPath = join(dir, 'icon.svg')
  let icon
  if (existsSync(iconPath)) {
    const svg = readFileSync(iconPath)
    if (svg.length > 24 * 1024) console.warn(`warn ${name}: icon over 32 KiB once decoded`)
    icon = `data:image/svg+xml;base64,${svg.toString('base64')}`
  }

  let title
  const localePath = join(dir, 'locale', 'en.json')
  if (existsSync(localePath)) {
    const meta = JSON.parse(readFileSync(localePath, 'utf8')).meta
    if (typeof meta?.title === 'string') title = meta.title
  }

  plugins.push({
    name: pkg.name,
    ...(title === undefined ? {} : { title }),
    ...(typeof pkg.description === 'string' ? { description: pkg.description } : {}),
    ...(icon === undefined ? {} : { icon }),
    repository: { url: repo, directory: name },
    metadata: { keywords: ['dsh', 'plugin'] },
    versions: [
      {
        version: pkg.version,
        publishTimestamp: timestamp,
        source: { type: 'git', url: repo, commit, path: name },
      },
    ],
  })
}

const index = {
  format: 1,
  title: { en: 'My DSH plugins', zh: '我的 DSH 插件' },
  description: { en: 'Local plugin bundles by the repository owner.' },
  plugins,
}

const out = join(root, 'market-index.json')
writeFileSync(out, `${JSON.stringify(index, null, 2)}\n`)
console.log(`wrote ${out}`)
console.log(`commit ${commit}`)
console.log(`plugins ${plugins.map((plugin) => plugin.name).join(', ')}`)
