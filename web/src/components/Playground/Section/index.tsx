import { useState } from 'react'
import type { ModuleDoc } from '../../../content'
import { Section } from '../../Section'
import { Playground } from '../index'
import styles from './styles.css'

const SNIPPETS = [
  {
    id: 'maybe',
    label: 'Maybe',
    code: `import Funcio from 'funcio'

const findUser = (id) =>
  Funcio._Maybe.of({ 1: 'Alice', 2: 'Bob' }[id])

findUser(2).getOrElse('unknown')`
  },
  {
    id: 'either',
    label: 'Either',
    code: `import Funcio from 'funcio'

const parsePort = (raw) =>
  Funcio._Either.try.sync(() => {
    const port = Number(raw)
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('port out of range')
    }
    return port
  })

[parsePort('8080'), parsePort('99999')].map((either) =>
  either.match({
    right: (port) => \`listening on \${port}\`,
    left: (error) => error.message
  })
)`
  },
  {
    id: 'match',
    label: 'match',
    code: `import Funcio from 'funcio'

const httpMethod = (method) =>
  Funcio._match(method)
    .with('GET', () => 'read')
    .with('POST', () => 'create')
    .with('DELETE', () => 'remove')
    ._(() => 'unsupported')
    .exec()

['GET', 'POST', 'PATCH'].map(httpMethod)`
  },
  {
    id: 'curry',
    label: 'curry',
    code: `import Funcio from 'funcio'

const compose = Funcio._curry((f, g, x) => f(g(x)))
const double = (n) => n * 2
const increment = (n) => n + 1

compose(double)(increment)(10)`
  }
]

const SCAFFOLD = `import Funcio from 'funcio'

// Edit anything in here and press Run (or ⌘↵ / Ctrl+↵).
//
// Every Funcio export is already in scope, so you can also skip the import
// and write _pipe(...) directly.

Funcio._pipe(
  [1, 2, 3, 4, 5],
  (list) => list.filter((n) => n % 2 === 1),
  (list) => list.map((n) => n ** 2),
  (list) => list.reduce((total, n) => total + n, 0)
)`

const module: ModuleDoc = {
  id: 'playground',
  title: 'Playground',
  tagline: 'A blank page with the whole library loaded.',
  api: [],
  examples: []
}

export const PlaygroundSection = () => {
  const [code, setCode] = useState(SCAFFOLD)

  return (
    <Section module={module} index={0} badge="✎">
      <div className={styles.snippets}>
        {SNIPPETS.map((snippet) => (
          <button
            key={snippet.id}
            type="button"
            className={styles.snippet}
            onClick={() => {
              setCode(snippet.code)
            }}
          >
            {snippet.label}
          </button>
        ))}
      </div>

      <Playground code={code} onChange={setCode} />
    </Section>
  )
}
