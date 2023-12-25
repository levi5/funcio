import { type Chainify } from '../../@Types/Object'

/**
 * Creates a chainable proxy for the given object.
 *
 * @param object - The object to chainify.
 * @returns A chainified version of the object.
 * @typeParam T - The type of the object.
 * @public
 */
export const _chainify = <T extends Record<string, any>>(object: T): Chainify<T> => new Proxy(object, {
  /**
   * Gets a property from the target object.
   *
   * @param target - The target object.
   * @param property - The property to get.
   * @param receiver - The receiver object.
   * @returns The value of the property or a chainable function if the property is a function.
   * @public
   */
  get (target, property, receiver) {
    if (typeof property !== 'string') return Reflect.get(target, property, receiver)
    if (typeof target[property] !== 'function') return target[property]

    /**
     * Invokes the method on the target object with the given arguments.
     *
     * @param args - The arguments to pass to the method.
     * @returns The result of the method or the receiver object.
     * @public
     */
    return (...args: any[]) => {
      const result = target[property](...args)
      return result === undefined ? receiver : result
    }
  }
})
