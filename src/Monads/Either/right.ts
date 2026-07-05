import { IEither, type Match } from '../../@Types'

/**
 * Create a right value for the Either type.
 *
 * @template L - The type of the left value.
 * @template R - The type of the right value.
 * @param {R} value - The value to wrap as the right value.
 * @returns {Either.TRight<L, R>} An instance of Right with the specified value.
 */
const Right = <L, R>(value: R): IEither.TRight<L, R> => {
  return {
    flag: IEither.EitherType.Flag_Right,
    value,
    /**
     * Check if this instance represents a failure value (left value).
     *
     * @returns {boolean} true if this is a failure value (left value), false otherwise.
     */
    isLeft (): boolean {
      return false
    },
    /**
     * Check if this instance represents a success value (right value).
     *
     * @returns {boolean} true if this is a success value (right value), false otherwise.
     */
    isRight (): boolean {
      return true
    },
    match<T>(handlers: Match<L, R, T>): T {
      return handlers.right(this.value)
    },
    map<NR> (fn: (value: R) => NR): IEither.TRight<L, NR> {
      return Right<L, NR>(fn(this.value))
    },
    mapLeft<NL> (fn: (value: L) => NL): IEither.TRight<NL, R> {
      return Right<NL, R>(this.value)
    },
    flatMap<NR> (fn: (value: R) => IEither.Either<L, NR>): IEither.Either<L, NR> {
      return fn(this.value)
    },
    getOrElse<DefaultValue> (defaultValue: DefaultValue): R | DefaultValue {
      return this.value
    }
  }
}

/**
 * Create a right value for the Either type.
 *
 * @template L - The type of the left value.
 * @template R - The type of the right value.
 * @param {R} value - The value to wrap as the right value.
 * @returns {Either.TRight<L, R>} An instance of Right with the specified value.
 */
export const right = <L, R>(value: R): IEither.TRight<L, R> => {
  return Right<L, R>(value)
}
