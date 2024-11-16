import { _Maybe } from './maybe'
import { MaybeType } from '../../@Types'
import { Nothing } from './nothing'

/**
 * Represents a non-null value in the Maybe monad.
 * @extends {_Maybe}
 * @template T - The type of the value stored in Just.
 */
export class Just<T> extends _Maybe {
  /**
   * The tag indicating the Maybe type.
   * @type {MaybeType}
   */
  public tag: MaybeType

  /**
   * Creates an instance of Just with the specified value.
   * @param {T} value - The value to be stored in Just.
   */
  constructor (private readonly value: T) {
    super()
    /**
     * The tag indicating the Maybe type as Just.
     * @type {MaybeType}
     */
    this.tag = MaybeType.Just
  }

  /**
   * Checks if the Maybe instance is a Just.
   * @returns {boolean} True if the Maybe instance is a Just, otherwise false.
   */
  public isJust (): boolean {
    return true
  }

  /**
   * Gets the value stored in Just.
   * @returns {T} The value stored in Just.
   */
  public get (): T {
    return this.value
  }

  /**
   * Gets the value stored in Just, or a default value if it's Nothing.
   * @param {T} value - The default value to return if the Maybe instance is Nothing.
   * @returns {T} The value stored in Just, or the default value if it's Nothing.
   */
  public getOrElse<R>(value: R): T | R {
    if (this.isNothing()) return value
    return this.value
  }

  /**
   * Applies a function to the value inside Just and returns a new Just with the result.
   * @param {...function} fn - The function to apply to the value inside Just.
   * @returns {Just} A new Just with the result of applying the function.
   */
  public map<R>(fn: (value: T) => R): Just<R> | Nothing<T> {
    return _Maybe.fromNullable(this.value)
      ? Just.of(fn(this.value))
      : Nothing.of(this.value)
  }

  /**
   * Creates a new Just instance with the specified value.
   * @param {T} value - The value to be stored in the new Just instance.
   * @returns {Just<T>} A new Just instance with the specified value.
   */
  public static of<T>(value: T): Just<T> {
    return new Just(value)
  }

  /**
 * Unwraps the value contained in the current Maybe monad.
 * If the value is an instance of Just, it continues unwrapping recursively.
 * If the value is not an instance of Just, it returns the current Maybe monad.
 *
 * @returns {_Maybe} Either the unwrapped value (if it was a Just) or the current Maybe monad.
 */
  public unwrap () {
    const value = this.value

    return value instanceof Just || value instanceof Nothing
      ? value.unwrap()
      : this.value
  }

  /**
   * Returns a string representation of the Just instance.
   * @returns {string} A string representation of the Just instance.
   */
  public toString (): string {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    return `Maybe.Just(${this.value})`
  }
}
