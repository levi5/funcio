import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const pkg = JSON.parse(readFileSync(resolve('../package.json'), 'utf-8'))
writeFileSync(resolve('src/version.ts'), `export const VERSION = "${pkg.version}"`)
console.log(`Generated version.ts with ${pkg.version}`)