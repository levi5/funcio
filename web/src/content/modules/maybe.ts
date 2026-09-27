import type { ModuleDoc } from '../types'

export const maybe: ModuleDoc = {
  id: 'maybe',
  title: '_Maybe',
  tagline: 'Model a value that may be absent, without null checks.',
  api: [
    {
      name: '_Maybe.of',
      signature: '_Maybe.of<T>(value: T): Just<T> | Nothing<T>',
      description: 'Builds a `Just` for any value other than `null`/`undefined`, and a `Nothing` otherwise.'
    },
    {
      name: 'Just / Nothing',
      description:
        '`Just` holds a value, `Nothing` holds none. Both expose `isJust()`, `isNothing()`, `get()`, `getOrElse()`, `map()`, `flatMap()` and `chain()`.'
    },
    {
      name: '.get()',
      description:
        'Returns the wrapped value. On a `Nothing` it returns an `ExtractValueError` describing the failure instead of throwing.'
    },
    {
      name: '.getOrElse(default)',
      signature: 'getOrElse<R>(value: R): T | R',
      description: 'The value when present, the fallback when not. The safe way to leave the monad.'
    },
    {
      name: '.map(fn) / .flatMap(fn) / .chain(fn)',
      description:
        '`map` transforms the wrapped value. `flatMap` and its alias `chain` compose steps that themselves return a `Maybe`, keeping the chain flat. All three short-circuit on `Nothing`.'
    },
    {
      name: '.unwrap()',
      description: 'Digs the raw value out, following nested `Just`/`Nothing` wrappers.'
    },
    {
      name: '.when(predicate)',
      signature: 'when<U>(predicate: boolean | ((value: T) => boolean)): WhenBuilder<T, U>',
      description:
        'A fluent conditional. Chain `.then(fn)` and `.else(fn)`, then finish with `unwrap()`, `getOrElse()`, `toMaybe()`, `map()` and friends.'
    }
  ],
  examples: [
    {
      id: 'maybe-basics',
      title: 'of and getOrElse',
      description: '`of` picks the variant for you: anything that is not `null` or `undefined` becomes a `Just`.',
      expected: '[true, true, 42, 0]',
      code: `import Funcio from 'funcio'

const present = Funcio._Maybe.of(42)
const absent = Funcio._Maybe.of(null)

[
present.isJust(),
absent.isNothing(),
present.get(),
absent.getOrElse(0)
]`
    },
    {
      id: 'maybe-map',
      title: 'map short-circuits',
      description: 'The callback only runs for a `Just`, so you never have to write the `if (value === null)` dance.',
      expected: '[10, "Value is empty"]',
      code: `import Funcio from 'funcio'

const double = (x) => x * 2
const label = (maybe) => maybe.getOrElse('Value is empty')

const doubled = Funcio._Maybe.of(5).map(double)
const doubledEmpty = Funcio._Maybe.of(null).map(double)

[doubled, doubledEmpty].map(label)`
    },
    {
      id: 'maybe-flatmap',
      title: 'Reaching into nested data safely',
      description:
        'Each `flatMap` unwraps one level. As soon as a value is missing the chain becomes `Nothing` and the rest is skipped.',
      expected: 'anonymous',
      code: `import Funcio from 'funcio'

const response = { data: { user: null } }

Funcio._Maybe.of(response)
.flatMap((res) => Funcio._Maybe.of(res.data))
.flatMap((data) => Funcio._Maybe.of(data.user))
.flatMap((user) => Funcio._Maybe.of(user.name))
.getOrElse('anonymous')`
    },
    {
      id: 'maybe-chain',
      title: 'chain is an alias for flatMap',
      description: 'Use whichever name reads better in your pipeline.',
      expected: '6',
      code: `import Funcio from 'funcio'

Funcio._Maybe.of(3)
.chain((value) => Funcio._Maybe.of(value * 2))
.getOrElse(0)`
    },
    {
      id: 'maybe-when',
      title: 'when / then / else',
      description: 'A conditional that understands `Nothing`: the `else` branch always runs when the value is absent.',
      expected: '[10, "fallback"]',
      code: `import Funcio from 'funcio'

const doubled = Funcio._Maybe.of(5)
.when(true)
.then((x) => x * 2)
.else((x) => x)
.unwrap()

const fallback = Funcio._Maybe.of(null)
.when(true)
.then((x) => x * 2)
.else(() => 'fallback')
.unwrap()

[doubled, fallback]`
    },
    {
      id: 'maybe-when-predicate',
      title: 'when with a predicate',
      description:
        'The predicate receives the wrapped value, and the result is chainable with the regular `Maybe` API.',
      expected: '11',
      code: `import Funcio from 'funcio'

Funcio._Maybe.of(5)
.when((x) => x > 3)
.then((x) => x * 2)
.else((x) => x)
.map((x) => x + 1)
.getOrElse(0)`
    },
    {
      id: 'maybe-unwrap',
      title: 'unwrap and toMaybe',
      description:
        '`unwrap()` returns the raw value. `toMaybe()` hands a `Maybe` back, which avoids double-wrapping when a branch already returns one.',
      expected: '[42, true, 10]',
      code: `import Funcio from 'funcio'

const raw = Funcio._Maybe.of(42).unwrap()

const maybe = Funcio._Maybe.of(5)
.when(true)
.then((x) => Funcio._Maybe.of(x * 2))
.else((x) => Funcio._Maybe.of(x))
.toMaybe()

[raw, maybe.isJust(), maybe.getOrElse(0)]`
    }
  ]
}
