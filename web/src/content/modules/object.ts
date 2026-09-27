import type { ModuleDoc } from '../types'

export const object: ModuleDoc = {
  id: 'object',
  title: '_Object',
  tagline: 'Immutable objects, path access and chainable APIs.',
  api: [
    {
      name: '_Object.makeImmutable',
      signature: 'makeImmutable<T extends object>(object: T): T',
      description: 'Deep copies an object and freezes it, recursively. Any later assignment throws a `TypeError`.'
    },
    {
      name: '_Object.getPathValue',
      signature: 'getPathValue(path: Array<string | number | symbol>, obj: OBJ): any',
      description: 'Reads a nested value by path, returning `undefined` when the path does not exist.'
    },
    {
      name: '_Object.setByPath',
      signature: 'setByPath(path: Array<string | number>, value: unknown, obj: O): O',
      description:
        'Writes a nested value by path and returns a new object, creating intermediate objects or arrays as needed. The original is left untouched.'
    },
    {
      name: '_Object.chainify',
      signature: 'chainify<T extends Record<string, any>>(object: T): Chainify<T>',
      description:
        'Wraps an object in a `Proxy` so any method returning `undefined` returns the proxy instead, letting calls chain.'
    }
  ],
  examples: [
    {
      id: 'object-paths',
      title: 'Reading and writing by path',
      description:
        '`getPathValue` and `setByPath` mirror each other. `setByPath` is immutable: it returns a new object.',
      expected: '["123 Main St", "undefined", "New York", "124 Main St", "123 Main St"]',
      code: `import Funcio from 'funcio'

const person = {
name: 'John Doe',
age: 30,
address: {
  street: '123 Main St',
  city: 'New York'
}
}

const street = Funcio._Object.getPathValue(['address', 'street'], person)
const missing = Funcio._Object.getPathValue(['address', 'null'], person)

const updated = Funcio._Object.setByPath(['address', 'street'], '124 Main St', person)

[street, \`\${missing}\`, updated.address.city, updated.address.street, person.address.street]`
    },
    {
      id: 'object-chainify',
      title: 'chainify for fluent APIs',
      description:
        'Methods that return `undefined` fall through to the proxy, so the chain continues instead of stopping.',
      expected: '30',
      code: `import Funcio from 'funcio'

class ExampleClass {
constructor(value) {
  this.value = value
}

setValue(newValue) {
  this.value = newValue
}

multiplyBy(factor) {
  this.value *= factor
}

getValue() {
  return this.value
}
}

Funcio._Object
.chainify(new ExampleClass(5))
.setValue(10)
.multiplyBy(3)
.getValue()`
    },
    {
      id: 'object-immutable',
      title: 'makeImmutable',
      description:
        'The returned object is a deep-frozen copy, so the write is rejected while your original data stays usable.',
      expected: '["TypeError", "Wonderland", "Wonderland", true]',
      code: `import Funcio from 'funcio'

const user = {
name: 'Alice',
address: { city: 'Wonderland' }
}

const immutableUser = Funcio._Object.makeImmutable(user)

let error
try {
immutableUser.address.city = 'Avalora'
} catch (caught) {
error = caught.name
}

[error, immutableUser.address.city, user.address.city, Object.isFrozen(immutableUser.address)]`
    }
  ]
}
