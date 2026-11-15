import type { ModuleDoc } from '@/content/types'

export const curry: ModuleDoc = {
  id: 'curry',
  title: '_curry',
  tagline: 'Partial application with grouped arguments and placeholders.',
  api: [
    {
      name: '_curry',
      signature: '_curry<P extends any[], R>(fn: (...args: P) => R): Curry.TResponse<P, R>',
      description:
        'Apply arguments one at a time, in groups or all at once. Each partial application is reusable. Required arity follows fn.length; default and rest parameters are not counted after the first default.'
    },
    {
      name: '_placeholder / _curry.placeholder',
      description: 'The same unique symbol leaves an argument open. Later calls fill earlier holes from left to right.'
    }
  ],
  examples: [
    {
      id: 'curry-placeholders',
      title: 'Grouped arguments and placeholders',
      description: 'Keep unary application or leave a hole wherever an argument should be supplied later.',
      expected: '[6, 6, 6, 9]',
      code: `import { _curry, _placeholder } from 'funcio'

const sum = _curry((a, b, c) => a + b + c)
const partial = sum(1, _placeholder, 3)

[sum(1)(2)(3), sum(1, 2)(3), partial(2), partial(5)]`
    },
    {
      id: 'curry-basics',
      title: 'Partial application',
      description: 'Curry a three-argument function, fix the first two, and call the result with the last one.',
      expected: '22',
      code: `import Funcio from 'funcio'

const add = (a, b, c) => a + b + c

const curriedAdd = Funcio._curry(add)

const addFive = curriedAdd(5)
const addTen = addFive(10)

addTen(7)`
    },
    {
      id: 'curry-pipeline',
      title: 'Curried steps in a pipeline',
      description: 'A curried function is single-argument, which makes it a drop-in step for `_pipe`.',
      expected: '18',
      code: `import Funcio from 'funcio'

const add = Funcio._curry((a, b) => a + b)
const multiply = Funcio._curry((a, b) => a * b)
const byThree = multiply(3)

Funcio._pipe(
4,
add(2),   // 6
byThree   // 18
)`
    }
  ]
}
