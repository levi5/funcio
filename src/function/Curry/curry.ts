/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Curry } from '../../@Types/Curry'

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
  return fn.length === 0
    ? fn()
    : (x: any) => curry(fn.bind(null, x))
}

/**
 * Export the curried function.
 */
export const _curry = curry
