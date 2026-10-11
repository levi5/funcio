import { _Maybe } from './maybe.js'
import { MaybeType } from '../../@Types/index.js'
import { ExtractValueError } from '../../helpers/index.js'
import { Just } from './just.js'
import { WhenBuilder } from './whenBuilder.js'

type UnwrappedMaybe<T> =
  T extends Just<infer Value>
    ? UnwrappedMaybe<Value>
    : T extends Nothing<infer Value>
      ? UnwrappedMaybe<Value>
      : T

/**
 * Represents a null or undefined value in the Maybe monad.
 * @extends {_Maybe}
 */
export class Nothing<T> extends _Maybe {
  /**
   * The tag indicating the Maybe type.
   * @type {MaybeType}
   */
  public tag: MaybeType

  /**
   * Creates an instance of Nothing.
   */
  constructor (private readonly value: T) {
    super()
    /**
     * The tag indicating the Maybe type as Nothing.
     * @type {MaybeType}
     */
    this.tag = MaybeType.Nothing
  }

  /**
   * Checks if the Maybe instance is a Nothing.
   * @returns {boolean} True if the Maybe instance is a Nothing, otherwise false.
   */
  public isNothing (): boolean {
    return true
  }

  public when<U>(predicate: boolean | ((value: any) => boolean)): WhenBuilder<T, U> {
    return new WhenBuilder(this, predicate)
  }

  /**
   * Attempts to get the value stored in Nothing, which always results in an error.
   * @returns {Error} An error indicating that the value of Nothing cannot be extracted.
   */
  public get (): Error {
    return new ExtractValueError("Can't extract the value of a Nothing.")
  }

  /**
   * Gets the specified default value since Nothing doesn't have a stored value.
   * @template T - The type of the default value.
   * @param {T} value - The default value to return.
   * @returns {T} The specified default value.
   */
  public getOrElse<T>(value: T): T {
    return value
  }

  /**
   * Returns itself since mapping over Nothing has no effect.
   * @param {...function} fn - The function to apply (ignored in this case).
   * @returns {Nothing} The current Nothing instance.
   */
  public map<R>(fn: (value: T) => R): Nothing<T> {
    return this
  }

  public flatMap<R extends _Maybe>(fn: (value: T) => R): Nothing<T> {
    return this
  }

  public chain<R extends _Maybe>(fn: (value: T) => R): Nothing<T> {
    return this
  }

  public fold<R>(onNothing: () => R, onJust: (value: T) => R): R {
    return onNothing()
  }

  public filter(predicate: (value: T) => boolean): Nothing<T> {
    return this
  }

  public orElse<U>(other: Just<U> | Nothing<U>): Just<T | U> | Nothing<T | U> {
    return other
  }

  public tap(fn: (value: T) => void): Nothing<T> {
    return this
  }

  public toNullable(): null | undefined {
    return this.value as null | undefined
  }

  /**
   * Creates a new Nothing instance.
   * @template T - The type parameter (ignored in this case).
   * @param {T} value - The value (ignored in this case).
   * @returns {Nothing} A new Nothing instance.
   */
  public static of<T>(value: T): Nothing<T> {
    return new Nothing(value)
  }

  /**
 * Unwraps the value contained in the current Maybe monad.
 * If the value is an instance of Just, it continues unwrapping recursively.
 * If the value is not an instance of Just, it returns the current Maybe monad.
 *
 * @returns {_Maybe} Either the unwrapped value (if it was a Nothing) or the current Maybe monad.
 */
  public unwrap (): UnwrappedMaybe<T> {
    const value = this.value

    return value instanceof Just || value instanceof Nothing
      ? value.unwrap() as UnwrappedMaybe<T>
      : this.value as UnwrappedMaybe<T>
  }

  /**
   * Returns a string representation of the Nothing instance.
   * @returns {string} A string representation of the Nothing instance.
   */
  public toString (): string {
    return 'Maybe.Nothing'
  }
}
