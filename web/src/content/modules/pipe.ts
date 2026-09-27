import type { ModuleDoc } from '../types'

export const pipe: ModuleDoc = {
  id: 'pipe',
  title: '_pipe',
  tagline: 'Compose functions left to right, sync or async.',
  api: [
    {
      name: '_pipe',
      signature: '_pipe<T, FNS extends FN[]>(input: T, ...fns: FNS): ReturnType<Pipeline<FNS>>',
      description:
        'Threads a value through each function, using the result of one as the input of the next. Fully typed end to end.'
    },
    {
      name: '_pipe.async',
      signature: '_pipe.async<T>(input: T, ...fns: AsyncFN[]): Promise<any>',
      description:
        'The same idea for pipelines that mix sync and async steps. Each step receives the resolved value from the previous one.'
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
    }
  ]
}
