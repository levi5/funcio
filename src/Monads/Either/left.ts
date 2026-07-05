import { IEither, type Match } from '../../@Types'
/**
 * Create a left value for the Either type.
 *
 * @template L - The type of the left value.
 * @template R - The type of the right value.
 * @param {L} value - The value to wrap as the left value.
 * @returns {Either.TLeft<L, R>} An instance of Left with the specified value.
 */
const Left = <L, R>(value: L): IEither.TLeft<L, R> => {
  return {
    flag: IEither.EitherType.FLAG_Left,
    value,
    /**
     * Check if this instance represents a failure value (left value).
     *
     * @returns {boolean} true if this is a failure value (left value), false otherwise.
     */
    isLeft (): boolean {
      return true
    },
    /**
     * Check if this instance represents a success value (right value).
     *
     * @returns {boolean} true if this is a success value (right value), false otherwise.
     */
    isRight (): boolean {
      return false
    },
    match<T>(handlers: Match<L, R, T>): T {
      return handlers.left(this.value)
    },
    map<NR> (fn: (value: R) => NR): IEither.TLeft<L, NR> {
      return Left<L, NR>(this.value)
    },
    mapLeft<NL> (fn: (value: L) => NL): IEither.TLeft<NL, R> {
      return Left<NL, R>(fn(this.value))
    },
    flatMap<NR> (fn: (value: R) => IEither.Either<L, NR>): IEither.TLeft<L, NR> {
      return Left<L, NR>(this.value)
    },
    getOrElse<DefaultValue> (defaultValue: DefaultValue): R | DefaultValue {
      return defaultValue
    }
  }
}

/**
 * Create a left value for the Either type.
 *
 * @template L - The type of the left value.
 * @template R - The type of the right value.
 * @param {L} value - The value to wrap as the left value.
 * @returns {Either.TLeft<L, R>} An instance of Left with the specified value.
 */
export const left = <L, R>(value: L): IEither.TLeft<L, R> => {
  return Left<L, R>(value)
}
