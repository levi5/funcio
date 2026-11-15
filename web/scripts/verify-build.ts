import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse } from 'acorn'
import { VERSION } from '@/version'

const dist = new URL('../dist/', import.meta.url)
const html = readFileSync(new URL('index.html', dist), 'utf8')
assert.ok(html.includes(`<meta name="funcio-version" content="${VERSION}"`), 'HTML must use the library version')
assert.ok(!html.includes('%FUNCIO_VERSION%'), 'Version placeholders must be resolved')
assert.ok(!html.includes('cdn.jsdelivr.net/npm/funcio'), 'The playground must use the same library as the docs')

let workers = 0
for (const path of readdirSync(dist, { recursive: true })) {
  if (typeof path !== 'string' || !path.endsWith('.js')) continue
  const code = readFileSync(new URL(path, dist), 'utf8')
  const module = parse(code, { ecmaVersion: 'latest', sourceType: 'module' })
  for (const statement of module.body) {
    if (!('source' in statement) || !statement.source) continue
    const source = statement.source.value
    assert.ok(
      typeof source !== 'string' || (source !== 'funcio' && !source.startsWith('@funcio/')),
      `Unresolved library import in ${path}`
    )
  }
  if (path.includes('replay.worker')) workers++
}
assert.ok(workers > 0, 'The playground worker must be bundled')
console.log(`Verified ${fileURLToPath(dist)}: version ${VERSION}, bundled playground and workers`)
