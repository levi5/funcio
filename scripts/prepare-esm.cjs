const { writeFileSync } = require('node:fs')
const { join } = require('node:path')

writeFileSync(join(__dirname, '../lib/esm/package.json'), '{"type":"module"}\n')
