import { readFileSync } from 'node:fs'

// Minimal format-1 checks mirroring dsh-plugin-market-index's rules, so an
// index can be validated locally before it is hosted. Usage:
//   node market/validate-index.mjs market-index.json

const NAME = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/
const COMMIT = /^[0-9a-f]{40}$/
const LANGUAGE = /^[a-z]{2,8}(?:-[a-z0-9]{1,8})*$/

const file = process.argv[2] ?? 'market-index.json'
const value = JSON.parse(readFileSync(file, 'utf8'))
const errors = []
const check = (condition, path, reason) => {
  if (!condition) errors.push(`${path} ${reason}`)
}
const text = (v) => typeof v === 'string' && v.trim() !== ''

function localized(v, path) {
  if (typeof v === 'string') return text(v)
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false
  return Object.entries(v).every(([lang, s]) => LANGUAGE.test(lang) && text(s)) && text(v.en)
}

// Git version pinning is what the generator emits; npm entries are checked too.
function source(v, path) {
  if (v?.type === 'npm') return v.registry === undefined || /^https?:\/\//.test(v.registry)
  if (v?.type !== 'git') return false
  const urlOk = typeof v.url === 'string' && /^https:\/\/[^/]+\/[^/]+\/[^/]+$/.test(v.url)
  const pathOk = v.path === undefined || /^[A-Za-z0-9._@+-]+(?:\/[A-Za-z0-9._@+-]+)*$/.test(v.path)
  return urlOk && COMMIT.test(String(v.commit)) && pathOk
}

check(value.format === 1, '$.format', 'must be 1')
check(localized(value.title, '$.title'), '$.title', 'must be a string or a localized object containing en')
check(Array.isArray(value.plugins), '$.plugins', 'must be an array')

const names = new Set()
;(value.plugins ?? []).forEach((plugin, i) => {
  const at = `$.plugins[${i}]`
  check(text(plugin?.name) && NAME.test(plugin.name), `${at}.name`, 'must be a valid npm package name')
  if (plugin?.name !== undefined) {
    check(!names.has(plugin.name), `${at}.name`, `duplicates ${plugin.name}`)
    names.add(plugin.name)
  }
  if (plugin?.title !== undefined) check(localized(plugin.title, `${at}.title`), `${at}.title`, 'must contain en')
  if (plugin?.icon !== undefined) {
    const match = /^data:(?:image\/svg\+xml|image\/png|image\/jpeg|image\/webp);base64,([A-Za-z0-9+/]*={0,2})$/.exec(String(plugin.icon))
    check(match !== null, `${at}.icon`, 'must be a base64 image data URL')
    if (match !== null) {
      const bytes = Buffer.from(match[1], 'base64').length
      check(bytes > 0 && bytes <= 32 * 1024, `${at}.icon`, 'must not exceed 32 KiB decoded')
    }
  }
  if (plugin?.repository !== undefined) {
    check(/^https?:\/\//.test(String(plugin.repository.url)), `${at}.repository.url`, 'must be http(s)')
  }
  const versions = plugin?.versions
  check(Array.isArray(versions) && versions.length > 0, `${at}.versions`, 'must be a non-empty array')
  const seen = new Set()
  ;(Array.isArray(versions) ? versions : []).forEach((version, j) => {
    const vAt = `${at}.versions[${j}]`
    check(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(String(version?.version)), `${vAt}.version`, 'must be exact SemVer')
    check(!seen.has(version?.version), `${vAt}.version`, 'duplicates a version')
    seen.add(version?.version)
    check(Number.isInteger(version?.publishTimestamp) && version.publishTimestamp >= 0, `${vAt}.publishTimestamp`, 'must be Unix seconds')
    check(source(version?.source, `${vAt}.source`), `${vAt}.source`, 'must be a valid npm or commit-pinned git source')
  })
})

if (errors.length > 0) {
  console.error(`${file}: ${errors.length} problem(s)`)
  for (const error of errors) console.error(`  ${error}`)
  process.exit(1)
}
console.log(`${file}: valid format-1 index with ${(value.plugins ?? []).length} plugin(s)`)
