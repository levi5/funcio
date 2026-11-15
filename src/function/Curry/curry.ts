import type { Curry } from '@funcio/@Types/Curry/index.js'

/** Leave an argument open when partially applying a curried function. */
export const _placeholder: unique symbol = Symbol('funcio.placeholder')

/**
 * Curry a function, allowing partial application of its arguments.
 *
 * @param {(...args: P) => R} fn - The function to curry.
 * @returns {Curry.TResponse<P, R>} The curried function.
 */

// overloaded function
function curry<P extends any[], R> (
  fn: (...args: P) => R
): Curry.TResponse<P, R>

/**
 * Curry a function, allowing partial application of its arguments.
 *
 * @param {(...args: any) => any} fn - The function to curry.
 * @returns {Curry.TResponse<any[], any>} The curried function.
 */
function curry (fn: (...args: any) => any) {
  const collect = (previous: any[]): any => (...incoming: any[]) => {
    const args = previous.slice()
    let next = 0
    // Only fill holes from earlier calls; holes from this call remain open.
    for (let index = 0; index < args.length && next < incoming.length; index++) {
      if (args[index] === _placeholder) args[index] = incoming[next++]
    }
    args.push(...incoming.slice(next))
    return args.length >= fn.length && !args.slice(0, fn.length).includes(_placeholder)
      ? Reflect.apply(fn, null, args)
      : collect(args)
  }
  return fn.length === 0 ? fn() : collect([])
}

/**
 * Export the curried function.
 */
const placeholder: { placeholder: typeof _placeholder } = { placeholder: _placeholder }
export const _curry = Object.assign(curry, placeholder)
