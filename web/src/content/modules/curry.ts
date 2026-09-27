import type { ModuleDoc } from '../types'

export const curry: ModuleDoc = {
  id: 'curry',
  title: '_curry',
  tagline: 'Turn any function into a chain of single-argument steps.',
  api: [
    {
      name: '_curry',
      signature: '_curry<P extends any[], R>(fn: (...args: P) => R): Curry.TResponse<P, R>',
      description:
        'Wraps a function so arguments can be applied one at a time. Each partial application returns another curried function.'
    }
  ],
  examples: [
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
