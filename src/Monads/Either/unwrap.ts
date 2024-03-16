import { IEither } from '../../@Types'

/**
 * Unwraps the value contained in an Either monad, handling recursive unwrapping.
 *
 * @param {IEither.Either<L, R>} wrapper - The Either monad to unwrap.
 * @returns {IEither.Either<L, R>} Either the unwrapped value or the original wrapper if it cannot be unwrapped further.
 */

export function _unwrap<L, R> (wrapper: IEither.Either<L, R>): | L | R

export function _unwrap<L, R> (wrapper: IEither.Either<L, R>): IEither.Either<L, R> | L | R {
  if (wrapper && (wrapper.flag === IEither.EitherType.Flag_Right || wrapper.flag === IEither.EitherType.FLAG_Left)) {
    const value = wrapper.value

    if (value && (value as IEither.Either<L, R>).flag) return _unwrap(value as IEither.Either<L, R>)

    return value
  }

  return wrapper
}
