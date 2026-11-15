import type { Chainify } from '@funcio/@Types/Object/index.js'

/**
 * Creates a chainable proxy for the given object.
 *
 * @param object - The object to chainify.
 * @returns A chainified version of the object.
 * @typeParam T - The type of the object.
 * @public
 */
export const _chainify = <T extends object>(object: T): Chainify<T> => new Proxy(object, {
  get (target, property, receiver) {
    if (typeof property !== 'string') return Reflect.get(target, property, receiver)
    const method: unknown = Reflect.get(target, property, receiver)
    if (typeof method !== 'function') return method

    return (...args: unknown[]) => {
      const result: unknown = Reflect.apply(method, target, args)
      return result === undefined ? receiver : result
    }
  }
}) as Chainify<T>
