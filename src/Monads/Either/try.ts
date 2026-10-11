import { left, right } from './index.js'
import { type IEither } from '../../@Types/index.js'

/**
 * Wraps an asynchronous operation in a try-catch block, returning an Either monad.
 * @template T - The type of the result of the asynchronous operation.
 * @param {() => Promise<T>} fn - The asynchronous operation to be wrapped.
 * @returns {Promise<IEither.Either<Error, T>>} Either monad representing success or failure.
 */
export const asyncTry = async <T = any>(fn: () => Promise<T>): Promise<IEither.Either<Error, T>> => {
  try {
    const result: T = await fn()
    return right<Error, T>(result)
  } catch (error) {
    // Preserve the exact thrown value (historical behavior): no wrapping.
    return left<Error, T>(error as Error)
  }
}

/**
 * Wraps a synchronous operation in a try-catch block, returning an Either monad.
 * @template T - The type of the result of the synchronous operation.
 * @param {() => T} fn - The synchronous operation to be wrapped.
 * @returns {IEither.Either<Error, T>} Either monad representing success or failure.
 */
export const syncTry = <T>(fn: () => T): IEither.Either<Error, T> => {
  try {
    const result: T = fn()
    if (result instanceof Promise) {
      return left<Error, T>(new Error('Synchronous function should not return a Promise.'))
    }
    return right<Error, T>(result)
  } catch (error) {
    // Preserve the exact thrown value (historical behavior): no wrapping.
    return left<Error, T>(error as Error)
  }
}

/**
 * Object containing both synchronous and asynchronous try functions.
 */
export const _try = {
  sync: syncTry,
  async: asyncTry
}
