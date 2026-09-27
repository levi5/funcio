import { heroExample, modules } from '../src/content'
import { execute } from '../src/playground/execute'
import { libScope } from '../src/playground/lib-scope'

interface Failure {
  label: string
  reason: string
}

const failures: Failure[] = []
let checked = 0

function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

async function check(label: string, code: string, expected: string | undefined): Promise<void> {
  checked++

  const result = await execute(code, libScope)

  if (!result.ok) {
    const where = result.error?.line ? ` (line ${result.error.line})` : ''
    failures.push({
      label,
      reason: `threw ${result.error?.name ?? 'Error'}${where}: ${result.error?.message ?? 'unknown'}`
    })
    return
  }

  for (const log of result.logs) {
    failures.push({ label, reason: `unexpected console.${log.level}: ${log.text}` })
  }

  if (expected === undefined) {
    if (result.value === null) failures.push({ label, reason: 'produced no value and declares no expectation' })
    return
  }

  const actual = result.value ?? 'undefined'
  if (normalize(actual) !== normalize(expected)) {
    failures.push({ label, reason: `expected ${expected} but got ${actual}` })
  }
}

async function main(): Promise<void> {
  await check('hero', heroExample, 'no email')

  for (const module of modules) {
    for (const example of module.examples) {
      await check(`${module.title} / ${example.title}`, example.code, example.expected)
    }
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} of ${checked} examples failed:\n`)
    for (const failure of failures) console.error(`  x ${failure.label}\n    ${failure.reason}\n`)
    process.exitCode = 1
    return
  }

  console.log(`All ${checked} examples produced their documented output.`)
}

void main()
