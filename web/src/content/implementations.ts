import arraySource from '@funcio/Array/asyncMethods.ts?raw'
import currySource from '@funcio/function/Curry/curry.ts?raw'
import pipeSource from '@funcio/function/Pipe/pipe.ts?raw'
import type { ImplementationDoc } from './types'

const excerpt = (source: string, start: string, end?: string): string => {
  const from = source.indexOf(start)
  const to = end === undefined ? source.length : source.indexOf(end, from + start.length)
  if (from === -1 || to === -1) throw new Error(`Implementation excerpt not found: ${start}`)
  return source.slice(from, to).trimEnd()
}

export const curryImplementation: ImplementationDoc = {
  source: 'src/function/Curry/curry.ts',
  techniques: ['Closures', 'Partial application', 'Recursion', 'Immutable argument collection'],
  steps: [
    {
      title: 'Represent a missing argument',
      code: excerpt(currySource, 'export const _placeholder:', '\n\n'),
      explanation:
        'A unique symbol marks a hole without confusing it with ordinary values such as undefined. The same symbol is exposed as _curry.placeholder.'
    },
    {
      title: 'Capture arguments without mutating previous calls',
      code: excerpt(currySource, 'function curry (fn:', '    // Only fill holes'),
      explanation:
        'collect returns a closure over previous arguments. slice creates a fresh array for each call, so a partial application can be reused without later calls changing its saved arguments.'
    },
    {
      title: 'Fill earlier holes, then append new arguments',
      code: excerpt(currySource, '    // Only fill holes', '    return args.length'),
      explanation:
        'The loop consumes incoming arguments from left to right to fill existing placeholders. Remaining arguments are appended. Holes introduced by the current call stay open until another call.'
    },
    {
      title: 'Execute or return another partial application',
      code: excerpt(currySource, '    return args.length', '\n\nconst placeholder:'),
      explanation:
        'Once the required positions are present and contain no placeholders, Reflect.apply invokes the function. Otherwise collect creates the next closure. Zero-arity functions execute immediately.'
    },
    {
      title: 'Expose the placeholder on the public function',
      code: excerpt(currySource, 'const placeholder:'),
      explanation: 'Object.assign attaches the shared placeholder symbol to curry and exports the resulting function.'
    }
  ],
  tradeoffs:
    'Arity comes from fn.length: default and rest parameters can make that smaller than expected. Each partial call copies arguments, trading allocation for reusable state. Reflect.apply uses null as this; method receivers are not preserved.'
}

export const pipeImplementation: ImplementationDoc = {
  source: 'src/function/Pipe/pipe.ts',
  techniques: ['Function composition', 'Left fold (reduce)', 'TypeScript overloads'],
  steps: [
    {
      title: 'Describe the pipeline result',
      code: excerpt(pipeSource, 'function pipe<T,', '\nfunction pipe ('),
      explanation:
        'The public overload relates the input and function tuple to Pipeline, a type-level helper. These types are erased at runtime; the implementation below performs the actual work.'
    },
    {
      title: 'Pass each result to the next function',
      code: excerpt(pipeSource, 'function pipe (', '\n\nexport const _pipe'),
      explanation:
        'reduce starts with input and processes functions left to right. Each return value becomes previousValue for the next step. An empty pipeline returns input unchanged. Reflect.apply invokes each step with the function itself as this.'
    },
    {
      title: 'Attach the asynchronous variant',
      code: excerpt(pipeSource, 'export const _pipe'),
      explanation:
        'The intersection type describes a callable function with an async property. The assignment attaches asyncPipe at runtime; it is available as _pipe.async.'
    },
    {
      title: 'Await each asynchronous step in order',
      code: excerpt(pipeSource, 'export async function asyncPipe (', '\n\nfunction pipe<T,'),
      explanation:
        'The promise accumulator starts with Promise.resolve(input). Every callback awaits the preceding result before invoking the next step, accepting synchronous and asynchronous functions. A thrown error or rejected promise rejects the pipeline.'
    }
  ],
  tradeoffs:
    'The synchronous variant does not await promises. The async variant is deliberately sequential, not parallel. Both visit every step once; exceptions stop subsequent steps.'
}

export const mapAsyncImplementation: ImplementationDoc = {
  source: 'src/Array/asyncMethods.ts',
  techniques: ['Worker pool', 'Closures', 'Indexed result storage', 'Cooperative cancellation'],
  steps: [
    {
      title: 'Define concurrency and cancellation options',
      code: excerpt(arraySource, 'export interface AsyncArrayOptions', '/** Preserves input order'),
      explanation:
        'Callers can set a concurrency limit and an AbortSignal. The aborted helper creates an Error named AbortError, used consistently for cancellation.'
    },
    {
      title: 'Validate options before starting work',
      code: excerpt(arraySource, 'export const mapAsync', '  return await new Promise'),
      explanation:
        'The callback may return a value or a promise. Concurrency defaults to Infinity and must be a positive integer or Infinity. An already-aborted signal rejects before any callback starts.'
    },
    {
      title: 'Prepare ordered storage and shared scheduling state',
      code: excerpt(arraySource, '  return await new Promise', '    const cleanup'),
      explanation:
        'Results are allocated up front. Only existing array indices are queued, so sparse slots become undefined without invoking the callback for a hole. Workers share next and stopped through a closure.'
    },
    {
      title: 'Centralize failure and clean up the abort listener',
      code: excerpt(arraySource, '    const cleanup', '    const worker'),
      explanation:
        'fail stops queued work, removes the listener and rejects with the original error. The abort listener uses the same path. Cancellation does not forcibly terminate callbacks that are already running.'
    },
    {
      title: 'Let workers claim indices and await callbacks',
      code: excerpt(arraySource, '    const worker', '    Promise.all'),
      explanation:
        'Each worker claims an index before awaiting, so another worker cannot claim that same item. Results are written to their original positions, preserving input order regardless of completion order. Callback failures enter the shared failure path.'
    },
    {
      title: 'Start a bounded pool and finish together',
      code: excerpt(arraySource, '    Promise.all', '\n\nexport const filterAsync'),
      explanation:
        'At most min(number of queued indices, concurrency) workers start. Promise.all waits for them, cleans up the listener and resolves the ordered result. If failure already rejected the outer promise, a later resolve cannot change it.'
    }
  ],
  tradeoffs:
    'Input indices and results require O(n) storage. Unlimited concurrency can overwhelm external services; set a limit for network work. Already-running callbacks may continue after rejection: pass their fourth argument, signal, to abort-aware operations such as fetch.'
}
