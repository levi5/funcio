import { taskImplementation, validationImplementation } from '@/content/implementations'
import type { ModuleDoc } from '@/content/types'

export const asyncValidation: ModuleDoc = {
  id: 'async-validation',
  title: '_Task / _Validation',
  tagline: 'Cancellable tasks and composable schemas, including asynchronous validation.',
  api: [
    {
      name: '_Task.fromPromise(fn)',
      signature: '_Task.fromPromise<T>(fn: (signal?: AbortSignal) => Promise<T>): _Task<T>',
      description:
        'Lifts a promise into a lazy chainable task resolving to Either<Error, T>. Each run executes the operation again.'
    },
    {
      name: '.map / .flatMap / .mapLeft / .orElse / .run(signal?)',
      description:
        'Transform, sequence async steps, map errors or recover, then await task.run(signal). Cancellation returns Left(AbortError); pass the signal to APIs such as fetch to stop underlying work.'
    },
    {
      name: '.retry(retries, delayMs?) / .timeout(ms)',
      implementation: taskImplementation,
      description:
        'Retry failed operations with an optional delay. timeout returns Left(TimeoutError). Put timeout before retry for a per-attempt limit, or after it for a total limit. Invalid counts and delays throw RangeError.'
    },
    {
      name: '_Task.parallel(tasks, concurrency?)',
      description:
        'Preserves input order with optional bounded concurrency (unlimited by default). Stops queued work after failure; already-running tasks may finish.'
    },
    {
      name: '_Validation.string() / number() / object() / array()',
      implementation: validationImplementation,
      description:
        'Composable schemas: safeParse returns Either<ValidationIssue[], T>, accumulating nested paths. parse throws on invalid input. Normal validators never coerce.'
    },
    {
      name: '_Validation.boolean() / enum(values) / union(schemas)',
      description:
        'Validate booleans, a non-empty tuple of string literals or the first successful alternative. Union failures accumulate every alternative issue.'
    },
    {
      name: '.optional() / .nullable() / .default(value) / .refine(fn, message?)',
      description:
        'Accept undefined or null, default only undefined, or check parsed values. Infer<typeof schema> gives the output type. Apply type-specific checks before generic modifiers.'
    },
    {
      name: '.transform(fn) / .transformAsync(fn)',
      description:
        'Transform only successfully validated values, inferring the new output type. Thrown transformation errors become issues.'
    },
    {
      name: '.refineAsync(fn, message?) / .safeParseAsync(value) / .parseAsync(value)',
      description:
        'Async checks compose through objects, arrays, unions, tuples, records and modifiers. Use async parsing throughout; synchronous parsing of an async schema throws rather than skipping checks.'
    },
    {
      name: '_Validation.literal(value) / tuple(schemas) / record(schema) / date()',
      description:
        'Exact primitive literals, fixed-length tuples, string-keyed records and valid Date copies. Coercion remains opt-in.'
    },
    {
      name: '_Validation.coerce.string() / number() / boolean() / date()',
      description:
        'Explicit JavaScript conversions followed by validation. Boolean("false") is true, because nonempty strings are truthy.'
    },
    {
      name: 'object(shape).strict() / .strip() / .passthrough()',
      description:
        'Reject unknown keys, strip them (the unchanged default) or preserve them. These policies return new schemas without mutating the original.'
    }
  ],
  examples: [
    {
      id: 'validation-transform',
      title: 'Validate first, then transform',
      description: 'The output type follows the transformation; invalid inputs do not run the transform.',
      expected: '[5, 42, true]',
      code: `import { _Validation as v } from 'funcio'

const length = v.string().min(2).transform((text) => text.length)
const age = v.coerce.number().refine((n) => n >= 18, 'Must be an adult')

[length.parse('hello'), age.parse('42'), length.safeParse('x').isLeft()]`
    },
    {
      id: 'validation-async',
      title: 'Asynchronous validation inside an object',
      description: 'Async parsing propagates through nested schemas and reports the field path on failure.',
      expected: '[{ name: "ANA" }, [{ path: "name", message: "Name unavailable" }]]',
      code: `import { _Validation as v } from 'funcio'

const name = v.string()
  .refineAsync(async (value) => value !== 'taken', 'Name unavailable')
  .transformAsync(async (value) => value.toUpperCase())
const user = v.object({ name })
const good = await user.parseAsync({ name: 'ana' })
const bad = await user.safeParseAsync({ name: 'taken' })

[good, bad.value]`
    },
    {
      id: 'validation-extra-schemas',
      title: 'Tuples, records, literals and dates',
      description: 'Tuples require an exact length; records validate each own string key.',
      expected: '[["ok", 42], { score: 10 }, 2024]',
      code: `import { _Validation as v } from 'funcio'

const response = v.tuple([v.literal('ok'), v.number()])
const scores = v.record(v.number().positive())
const date = v.coerce.date().parse('2024-01-01')

[response.parse(['ok', 42]), scores.parse({ score: 10 }), date.getUTCFullYear()]`
    },
    {
      id: 'validation-object-policies',
      title: 'Choose an unknown-key policy',
      description: 'Stripping is still the default. strict and passthrough create new schemas.',
      expected: '[{ name: "Ana" }, true, { name: "Ana", extra: 1 }]',
      code: `import { _Validation as v } from 'funcio'

const user = v.object({ name: v.string() })
const input = { name: 'Ana', extra: 1 }

[user.parse(input), user.strict().safeParse(input).isLeft(), user.passthrough().parse(input)]`
    },
    {
      id: 'validation-modifiers',
      title: 'Optional fields, defaults and alternatives',
      description: 'Defaults apply only to undefined; nullable explicitly accepts null.',
      expected: '{ name: "Ana", nickname: undefined, email: null, active: true, role: "user", id: 42 }',
      code: `import { _Validation as v } from 'funcio'

const user = v.object({
  name: v.string(),
  nickname: v.string().optional(),
  email: v.string().email().nullable(),
  active: v.boolean().default(true),
  role: v.enum(['admin', 'user']),
  id: v.union([v.string(), v.number()])
})

user.parse({ name: 'Ana', email: null, role: 'user', id: 42 })`
    },
    {
      id: 'task-controls',
      title: 'Retry and parallel execution',
      description: 'Tasks are lazy; retry allows additional attempts, and parallel can bound concurrency.',
      expected: '[3, 3, [1, 2]]',
      code: `import { _Task } from 'funcio'

let attempts = 0
const request = _Task.fromPromise(async () => {
  if (++attempts < 3) throw new Error('Temporary failure')
  return attempts
})
const result = await request.retry(2).run()
const parallel = await _Task.parallel([_Task.of(1), _Task.of(2)], 1).run()

[result.getOrElse(0), attempts, parallel.getOrElse([])]`
    },
    {
      id: 'task-timeout',
      title: 'Timeouts are values too',
      description: 'A timed-out task resolves to Left with a TimeoutError; no unhandled rejection.',
      expected: 'TimeoutError',
      code: `import { _Task } from 'funcio'

const task = _Task.fromPromise(() => new Promise(() => {}))
const result = await task.timeout(5).run()

result.match({ left: (error) => error.name, right: () => 'done' })`
    },
    {
      id: 'task-chain',
      title: 'Task chains',
      description: 'Each step runs only when the previous one succeeded.',
      expected: '10',
      code: `import Funcio from 'funcio'

const result = await Funcio._Task
  .fromPromise(async () => 5)
  .map((v) => v * 2)
  .run()

result.getOrElse(0)`
    },
    {
      id: 'validation-object',
      title: 'Validation accumulates errors',
      description: 'Unlike `Either.try`, an object schema reports every bad field at once.',
      expected: '[true, 2]',
      code: `import Funcio from 'funcio'

const schema = Funcio._Validation.object({
  name: Funcio._Validation.string().min(2),
  age: Funcio._Validation.number().positive()
})

const bad = schema.safeParse({ name: 'x', age: -1 })

[bad.isLeft(), bad.value.length]`
    }
  ]
}
