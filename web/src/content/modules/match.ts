import type { ModuleDoc } from '../types'

export const match: ModuleDoc = {
  id: 'match',
  title: '_match',
  tagline: 'Pattern matching with a fluent builder.',
  api: [
    {
      name: '_match',
      signature: '_match<T, R>(value: T): { with(pattern, fn): ...; _(default): ...; exec(): R }',
      description:
        'Registers patterns with `.with(pattern, handler)` and a fallback with `._(fn)`. `.exec()` returns the first handler whose pattern matches. A pattern is a literal (string, number, boolean, symbol, null) or an object shape compared key by key, recursively.'
    }
  ],
  examples: [
    {
      id: 'match-values',
      title: 'Matching literals',
      description: 'Patterns are tried in order and the first match wins.',
      expected: 'Not Found',
      code: `import Funcio from 'funcio'

const describeStatus = (status) =>
Funcio._match(status)
  .with(200, () => 'OK')
  .with(404, () => 'Not Found')
  .with(500, () => 'Server Error')
  ._(() => 'Unknown')
  .exec()

describeStatus(404)`
    },
    {
      id: 'match-objects',
      title: 'Matching object shapes',
      description: 'An object pattern is a deep partial comparison, so only the keys you list have to match.',
      expected: '["pong", "already there", "unknown command"]',
      code: `import Funcio from 'funcio'

const run = (command) =>
Funcio._match(command)
  .with({ type: 'ping' }, () => 'pong')
  .with({ type: 'move', to: { x: 0, y: 0 } }, () => 'already there')
  ._(() => 'unknown command')
  .exec()

[
{ type: 'ping' },
{ type: 'move', to: { x: 0, y: 0 } },
{ type: 'move', to: { x: 3, y: 4 } }
].map(run)`
    },
    {
      id: 'match-strings',
      title: 'Matching strings',
      description: 'String literals work as patterns, and the handler receives the matched value.',
      expected: '["Hey, boss", "Hey, teammate", "Hello, stranger"]',
      code: `import Funcio from 'funcio'

const greeting = (name) =>
Funcio._match(name)
  .with('Alice', (value) => \`Hey, \${value === 'Alice' ? 'boss' : 'there'}\`)
  .with('Bob', () => 'Hey, teammate')
  ._(() => 'Hello, stranger')
  .exec()

[greeting('Alice'), greeting('Bob'), greeting('Carol')]`
    }
  ]
}
