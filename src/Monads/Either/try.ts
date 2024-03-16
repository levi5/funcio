import { left, right } from '.'
import { type IEither } from '../../@Types'

/**
 * Wraps an asynchronous operation in a try-catch block, returning an Either monad.
 * @template T - The type of the result of the asynchronous operation.
 * @param {() => Promise<T>} fn - The asynchronous operation to be wrapped.
 * @returns {Promise<IEither.Either<Error, T>>} Either monad representing success or failure.
 */
export const asyncTry = async <T = any>(fn: () => Promise<T>): Promise<IEither.Either<Error, T>> => {
  try {
    const result: T = await fn()
    return right(result)
  } catch (error) {
    return left(error)
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
      return left(new Error('Synchronous function should not return a Promise.'))
    }
    return right(result)
  } catch (error) {
    return left(error)
  }
}

/**
 * Object containing both synchronous and asynchronous try functions.
 */
export const _try = {
  sync: syncTry,
  async: asyncTry
}
