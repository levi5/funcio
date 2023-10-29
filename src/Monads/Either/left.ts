import { IEither } from "../../@Types"
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
    isLeft(): boolean {
      return true
    },
    /**
     * Check if this instance represents a success value (right value).
     *
     * @returns {boolean} true if this is a success value (right value), false otherwise.
     */
    isRight(): boolean {
      return false
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
export const left = <L, R>(value: L): IEither.TLeft<L, R> =>{
  return Left<L, R>(value)
}
