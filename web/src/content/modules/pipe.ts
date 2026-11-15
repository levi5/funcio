import {
  asyncPipeImplementation,
  composeImplementation,
  fnUtilsImplementation,
  pipeFnImplementation,
  pipeImplementation
} from '@/content/implementations'
import type { ModuleDoc } from '@/content/types'

export const pipe: ModuleDoc = {
  id: 'pipe',
  title: '_pipe',
  tagline: 'Compose functions left to right, sync or async.',
  api: [
    {
      name: '_pipe',
      implementation: pipeImplementation,
      signature: '_pipe<T, FNS extends FN[]>(input: T, ...fns: FNS): ReturnType<Pipeline<FNS>>',
      description:
        'Passes each result to the next function. Result inference uses the function tuple; it does not validate every input or chain at the call site.'
    },
    {
      name: '_pipe.async',
      implementation: asyncPipeImplementation,
      signature:
        '_pipe.async<T, A, B>(input: T, a: (value: Awaited<T>) => A, b: (value: Awaited<A>) => B): Promise<Awaited<B>>',
      description:
        'Mix sync and async steps with inferred resolved output types. Promise inputs are awaited too. TypeScript rejects incompatible steps; annotate steps in longer variadic pipelines when needed.'
    },
    {
      name: '_compose(...fns)',
      implementation: composeImplementation,
      signature: '_compose(...fns: FN[]): (input: unknown) => unknown',
      description: 'Right-to-left composition: compose(f, g)(x) is f(g(x)). The result is typed as unknown.'
    },
    {
      name: '_pipeFn(...fns)',
      implementation: pipeFnImplementation,
      signature: '_pipeFn(...fns: FN[]): (input: unknown) => unknown',
      description: 'Reusable data-last pipe: pipeFn(f, g)(x) is g(f(x)). The result is typed as unknown.'
    },
    {
      name: '_tap / _once / _memoize / _flip',
      implementation: fnUtilsImplementation,
      description: 'Small function helpers: side-effect passthrough, run-once, cached pure fn, swapped binary args.'
    }
  ],
  examples: [
    {
      id: 'pipe-composition',
      title: 'Composition',
      description:
        'The output of each step becomes the input of the next, and the inferred return type follows the pipeline.',
      expected: '6',
      code: `import Funcio from 'funcio'

const addTwo = (x) => x + 2
const square = (x) => x * x
const subtractTen = (x) => x - 10

Funcio._pipe(
2,
addTwo,      // 2 -> 4
square,      // 4 -> 16
subtractTen  // 16 -> 6
)`
    },
    {
      id: 'pipe-parallel',
      title: 'Branching pipelines',
      description:
        'The last argument is a function receiving the piped value, which is handy for reusable transformations.',
      expected: 'user-1: Alice (admin)',
      code: `import Funcio from 'funcio'

const users = [
{ id: 1, name: 'Alice', role: 'admin' },
{ id: 2, name: 'Bob', role: 'viewer' }
]

const label = (user) => \`user-\${user.id}: \${user.name} (\${user.role})\`

Funcio._pipe(
users,
(list) => list.filter((user) => user.role === 'admin'),
(list) => list[0],
label
)`
    },
    {
      id: 'pipe-async',
      title: 'Async pipelines',
      description: '`_pipe.async` awaits every step, so sync and async functions can be mixed in a single chain.',
      expected: 'Value: 18',
      code: `import Funcio from 'funcio'

const result = await Funcio._pipe.async(
4,
(value) => value + 2,
async (value) => value * 3,
(value) => \`Value: \${value}\`
)

result`
    },
    {
      id: 'pipe-compose-reusable',
      title: 'Reusable pipelines',
      description: '`_pipeFn` and `_compose` build functions you can reuse instead of threading a value inline.',
      expected: '[16, 11]',
      code: `import Funcio from 'funcio'

const transform = Funcio._pipeFn(
(x) => x + 2,
(x) => x * x
)

const composed = Funcio._compose(
(x) => x + 1,
(x) => x * 2
)

[transform(2), composed(5)]`
    }
  ]
}
