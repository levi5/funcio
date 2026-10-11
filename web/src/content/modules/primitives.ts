import type { ModuleDoc } from '../types'

export const primitives: ModuleDoc = {
  id: 'primitives',
  title: '_String / _Number',
  tagline: 'Small pure helpers for everyday string and number shaping.',
  api: [
    {
      name: '_String.capitalize / slugify / toCamelCase / toSnakeCase',
      description: 'Case conversion and URL slugs without a second dependency.'
    },
    {
      name: '_Number.clamp / inRange / sum / avg / roundTo',
      description: 'Bounds, aggregates and fixed-precision rounding.'
    }
  ],
  examples: [
    {
      id: 'primitives-demo',
      title: 'Strings and numbers',
      description: 'Pure functions that slot straight into a `_pipe`.',
      expected: '["Hello", "ola-mundo", 10, 3]',
      code: `import Funcio from 'funcio'

[
Funcio._String.capitalize('hello'),
Funcio._String.slugify('Olá Mundo!'),
Funcio._Number.clamp(0, 10, 15),
Funcio._Number.avg([2, 4])
]`
    }
  ]
}
