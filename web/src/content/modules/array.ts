import type { ModuleDoc } from '../types'

export const array: ModuleDoc = {
  id: 'array',
  title: '_Array',
  tagline: 'Async-friendly array helpers.',
  api: [
    {
      name: '_Array.mapAsync',
      signature: 'mapAsync<T, R>(array: T[], fn: (x: T) => Promise<R>): Promise<R[]>',
      description: '`Promise.all` over the array, preserving order.'
    },
    {
      name: '_Array.filterAsync',
      signature: 'filterAsync<T>(array: T[], fn: (x: T) => Promise<boolean>): Promise<T[]>',
      description: 'Resolves every predicate and keeps the elements whose predicate was truthy, preserving order.'
    },
    {
      name: '_Array.forEachAsync',
      signature: 'forEachAsync<T>(array: T[], fn: (x: T) => any): Promise<any>',
      description: 'Runs the callback over each element strictly in sequence, awaiting each one before the next.'
    },
    {
      name: '_Array.chunk / uniq / groupBy / partition',
      description: 'Sync collection helpers: paginate, dedupe, bucket by key, or split by predicate.'
    },
    {
      name: '_Array.zip / range / sortBy / take / drop / flatMap',
      description: 'Pair lists, build numeric ranges, sort by derived key, slice, or map-and-flatten.'
    },
    {
      name: '_Array.reduceAsync',
      description: 'Sequential async fold over an array.'
    }
  ],
  examples: [
    {
      id: 'array-async',
      title: 'Mapping and filtering with async callbacks',
      description: 'The callbacks return promises, and the helpers keep the original order.',
      expected: '[2, 4, 6, 2, 4]',
      code: `import Funcio from 'funcio'

const doubled = await Funcio._Array.mapAsync([1, 2, 3], async (value) => value * 2)
const evens = await Funcio._Array.filterAsync([1, 2, 3, 4], async (value) => value % 2 === 0)

[...doubled, ...evens]`
    },
    {
      id: 'array-foreach',
      title: 'Sequential side effects',
      description: '`forEachAsync` awaits each callback before starting the next, unlike `Promise.all`.',
      expected: '["start 1", "end 1", "start 2", "end 2"]',
      code: `import Funcio from 'funcio'

const order = []

await Funcio._Array.forEachAsync([1, 2], async (value) => {
order.push(\`start \${value}\`)
await new Promise((resolve) => setTimeout(resolve, 10))
order.push(\`end \${value}\`)
})

order`
    },
    {
      id: 'array-sync',
      title: 'Sync collection helpers',
      description: 'Chunking, grouping and zipping without pulling in another utility library.',
      expected: '[[[1, 2], [3]], { odd: [1, 3], even: [2] }, [[1, "a"]]]',
      code: `import Funcio from 'funcio'

const chunks = Funcio._Array.chunk(2, [1, 2, 3])
const grouped = Funcio._Array.groupBy((x) => (x % 2 === 0 ? 'even' : 'odd'), [1, 2, 3])
const zipped = Funcio._Array.zip([1], ['a'])

[chunks, grouped, zipped]`
    }
  ]
}
