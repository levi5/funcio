const assert = require('node:assert/strict')
const { pathToFileURL } = require('node:url')
const { resolve } = require('node:path')
const { readdirSync, readFileSync } = require('node:fs')
const pkg = require('../package.json')

async function check () {
  const lib = resolve(__dirname, '../lib')
  for (const file of readdirSync(lib, { recursive: true })) {
    if (!/\.(?:js|d\.ts)$/.test(file)) continue
    const content = readFileSync(resolve(lib, file), 'utf8')
    assert.ok(!/(?:from\s*|require\()\s*['"]@funcio\//.test(content), `Unresolved alias in ${file}`)
  }
  const cjs = require(resolve(__dirname, '..', pkg.main))
  const esm = await import(pathToFileURL(resolve(__dirname, '..', pkg.module)).href)
  for (const api of [cjs, esm]) {
    assert.equal(api._Either.right(42).getOrThrow(), 42)
    assert.equal(api._Maybe.of(3).toEither('missing').getOrThrow(), 3)
    assert.equal(api._Either.toMaybe(api._Either.right(2)).getOrElse(0), 2)
    assert.equal(await api._pipe.async(2, async (x) => x * 3), 6)
    assert.deepEqual(api._Array.lazy([1, 2, 3]).take(2).toArray(), [1, 2])
    assert.equal(api._curry((a, b, c) => a + b + c)(1, api._placeholder, 3)(2), 6)
    assert.equal(api._Validation.coerce.number().parse('42'), 42)
    assert.equal(api.default._Task, api._Task)
  }
  console.log('CommonJS and ESM entry points and rewritten aliases OK')
}

check().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
