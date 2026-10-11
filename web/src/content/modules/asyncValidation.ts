import type { ModuleDoc } from '../types'

export const asyncValidation: ModuleDoc = {
  id: 'async-validation',
  title: '_Task / _Validation',
  tagline: 'Async chains without try/catch soup, plus error-accumulating validation.',
  api: [
    {
      name: '_Task.fromPromise(fn)',
      signature: '_Task.fromPromise<T>(fn: () => Promise<T>): _Task<T>',
      description: 'Lifts a promise into a chainable task that resolves to `Either<Error, T>`.'
    },
    {
      name: '.map / .flatMap / .orElse / .run()',
      description: 'Transform, sequence async steps, recover, then `await task.run()`.'
    },
    {
      name: '_Validation.string() / number() / object() / array()',
      description: 'Tiny schemas with `safeParse` returning `Either<ValidationIssue[], T>` holding every failure.'
    }
  ],
  examples: [
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
