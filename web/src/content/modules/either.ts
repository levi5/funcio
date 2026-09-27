import type { ModuleDoc } from '../types'

export const either: ModuleDoc = {
  id: 'either',
  title: '_Either',
  tagline: 'Two possible outcomes, with a guaranteed way out.',
  api: [
    {
      name: '_Either.right(value)',
      description: 'The success case. `map`, `flatMap` and `match` all run their callbacks here.'
    },
    {
      name: '_Either.left(value)',
      description: 'The failure case. `map` is skipped and the error is preserved; use `mapLeft` to transform it.'
    },
    {
      name: 'isRight() / isLeft()',
      description: 'Which side you are holding.'
    },
    {
      name: '_Either.try.sync(fn)',
      signature: '_try.sync<T>(fn: () => T): Either<Error, T>',
      description:
        'Runs `fn` and wraps the outcome: `Right` with the result, or `Left` with the thrown error. Rejects a function that returns a `Promise`.'
    },
    {
      name: '_Either.try.async(fn)',
      signature: '_try.async<T>(fn: () => Promise<T>): Promise<Either<Error, T>>',
      description: 'The asynchronous counterpart of `try.sync`.'
    },
    {
      name: 'match({ right, left })',
      description: 'Exhaustively handles both sides in one call, and keeps the result type-safe.'
    },
    {
      name: '_Either.unwrap(either)',
      description: 'Returns the wrapped value, following nested `Either` values.'
    }
  ],
  examples: [
    {
      id: 'either-sides',
      title: 'Both sides',
      description: 'An `Either` is a plain object with a `flag`, so you can carry a value of any type on either side.',
      expected: '[true, true, 42, "boom"]',
      code: `import Funcio from 'funcio'

const ok = Funcio._Either.right(42)
const ko = Funcio._Either.left('boom')

[ok.isRight(), ko.isLeft(), Funcio._Either.unwrap(ok), Funcio._Either.unwrap(ko)]`
    },
    {
      id: 'either-match',
      title: 'Exhaustive match',
      description: 'One call handles success and failure, which is where the type safety pays off.',
      expected: '["Success: 10", "Error: Something went wrong"]',
      code: `import Funcio from 'funcio'

const handle = (either) =>
either.match({
  right: (value) => \`Success: \${value}\`,
  left: (error) => \`Error: \${error}\`
})

[handle(Funcio._Either.right(10)), handle(Funcio._Either.left('Something went wrong'))]`
    },
    {
      id: 'either-try-sync',
      title: 'try.sync',
      description: 'Turn a throwing function into a value. No `try`/`catch` at the call site.',
      expected: '["Right: 3", "Left: Division by zero"]',
      code: `import Funcio from 'funcio'

const divide = (a, b) => {
if (b === 0) throw new Error('Division by zero')
return a / b
}

const show = (either) =>
either.match({
  right: (value) => \`Right: \${value}\`,
  left: (error) => \`Left: \${error.message}\`
})

[
show(Funcio._Either.try.sync(() => divide(6, 2))),
show(Funcio._Either.try.sync(() => divide(6, 0)))
]`
    },
    {
      id: 'either-try-async',
      title: 'try.async',
      description: 'The same idea around a promise, including a rejected one.',
      expected: '["name: John", "error: SyntaxError"]',
      code: `import Funcio from 'funcio'

const parse = async (text) => JSON.parse(text)

const show = (either) =>
either.match({
  right: (value) => \`name: \${value.name}\`,
  left: (error) => \`error: \${error.name}\`
})

const valid = await Funcio._Either.try.async(() => parse('{"name":"John","age":30}'))
const invalid = await Funcio._Either.try.async(() => parse('{"name":"John",}'))

[show(valid), show(invalid)]`
    },
    {
      id: 'either-map',
      title: 'map, mapLeft and flatMap',
      description:
        '`map` transforms a `Right`, `mapLeft` transforms a `Left`, and `flatMap` composes steps that already return an `Either`.',
      expected: '[20, "Error: Invalid payload", 5]',
      code: `import Funcio from 'funcio'

const mapped = Funcio._Either.right(10).map((value) => value * 2)

const normalized = Funcio._Either.left('Invalid payload')
.mapLeft((error) => \`Error: \${error}\`)
.match({ right: (value) => value, left: (error) => error })

const divide = (a, b) =>
b === 0
  ? Funcio._Either.left('Division by zero')
  : Funcio._Either.right(a / b)

const chained = Funcio._Either.right(10).flatMap((value) => divide(value, 2))

[mapped.getOrElse(0), normalized, chained.getOrElse(0)]`
    }
  ]
}
