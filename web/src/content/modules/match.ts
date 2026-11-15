import type { ModuleDoc } from '@/content/types'

export const match: ModuleDoc = {
  id: 'match',
  title: '_match',
  tagline: 'Pattern matching with a fluent builder.',
  api: [
    {
      name: '_match',
      signature: '_match<T, R>(value: T): MatchBuilder<T, R>',
      description:
        'Registers literal, constructor, predicate, array or partial-object patterns with `.with(pattern, handler)`. First match wins. `.exec()` preserves historical permissive typing and returns null if no pattern or fallback matches.'
    },
    {
      name: '.exhaustive()',
      signature: 'exhaustive(): R',
      description:
        'Available only after every literal/discriminated-union case is covered, or after an explicit fallback. Predicates alone do not prove coverage. Unsafe calls that bypass TypeScript throw when no branch matches.'
    }
  ],
  examples: [
    {
      id: 'match-exhaustive',
      title: 'Exhaustive constructor patterns',
      description:
        'In TypeScript, use _match<string | number, string>(value). Both primitive cases must be covered before exhaustive is callable.',
      expected: '["text: hello", "number: 42"]',
      code: `import { _match } from 'funcio'

const describe = (value) => _match(value)
  .with(String, (text) => \`text: \${text}\`)
  .with(Number, (number) => \`number: \${number}\`)
  .exhaustive()

[describe('hello'), describe(42)]`
    },
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
