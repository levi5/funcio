import type { ModuleDoc } from '@/content/types'

export const array: ModuleDoc = {
  id: 'array',
  title: '_Array',
  tagline: 'Ordered async work, bounded concurrency and lazy iterables.',
  api: [
    {
      name: '_Array.mapAsync',
      signature:
        'mapAsync<T, R>(array: T[], fn: (value, index, array, signal?) => R | Promise<R>, options?: AsyncArrayOptions): Promise<R[]>',
      description:
        'Maps in input order with optional `{ concurrency, signal }`. Unlimited concurrency by default; failures stop queued work and preserve the original error.'
    },
    {
      name: '_Array.filterAsync',
      signature:
        'filterAsync<T>(array: T[], fn: (value, index, array, signal?) => boolean | Promise<boolean>, options?: AsyncArrayOptions): Promise<T[]>',
      description: 'Filters in input order with the same concurrency and cancellation options as `mapAsync`.'
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
    },
    {
      name: 'AsyncArrayOptions',
      signature: '{ concurrency?: number; signal?: AbortSignal }',
      description:
        'Concurrency must be a positive integer or Infinity. Abort rejects with AbortError immediately; pass the fourth callback argument to fetch to cancel underlying work. Already-running callbacks may continue.'
    },
    {
      name: '_Array.lazy(iterable)',
      signature: 'lazy<T>(source: Iterable<T>): LazyArray<T>',
      description:
        'Deferred map, filter, flatMap, take and drop; consume with reduce, toArray or for...of. take does not over-read. Counts must be non-negative integers. Arrays are reusable; generator instances are single-use.'
    }
  ],
  examples: [
    {
      id: 'array-bounded',
      title: 'Bounded concurrency, ordered results',
      description: 'Only two callbacks can be active at once. Results stay in input order.',
      expected: '[[6, 4, 2], 2]',
      code: `import { _Array } from 'funcio'

let active = 0
let peak = 0
const result = await _Array.mapAsync([3, 2, 1], async (value) => {
  peak = Math.max(peak, ++active)
  await Promise.resolve()
  active--
  return value * 2
}, { concurrency: 2 })

[result, peak]`
    },
    {
      id: 'array-cancel',
      title: 'Cancel queued work',
      description: 'Cancellation rejects with AbortError and skips callbacks when already aborted.',
      expected: 'AbortError',
      code: `import { _Array } from 'funcio'

const controller = new AbortController()
controller.abort()

await _Array.mapAsync([1, 2, 3], async (value) => value * 2, {
  concurrency: 1,
  signal: controller.signal
}).catch((error) => error.name)`
    },
    {
      id: 'array-lazy',
      title: 'Lazy pipelines over infinite input',
      description: 'No intermediate arrays: take stops the generator as soon as enough values are available.',
      expected: '[4, 8, 12]',
      code: `import { _Array } from 'funcio'

function* naturals() {
  for (let n = 1; ; n++) yield n
}

_Array.lazy(naturals())
  .filter((n) => n % 2 === 0)
  .map((n) => n * 2)
  .take(3)
  .toArray()`
    },
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
