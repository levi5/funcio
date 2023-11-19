import { _Maybe } from "./maybe";
import { MaybeType } from "../../@Types";
import { ExtractValueError } from "../../Helpers";

/**
 * Represents a null or undefined value in the Maybe monad.
 * @extends {_Maybe}
 */
export class Nothing extends _Maybe {
  /**
   * The tag indicating the Maybe type.
   * @type {MaybeType}
   */
  public tag: MaybeType;

  /**
   * Creates an instance of Nothing.
   */
  constructor() {
    super();
    /**
     * The tag indicating the Maybe type as Nothing.
     * @type {MaybeType}
     */
    this.tag = MaybeType.Nothing;
  }

  /**
   * Checks if the Maybe instance is a Nothing.
   * @returns {boolean} True if the Maybe instance is a Nothing, otherwise false.
   */
  public isNothing(): boolean {
    return true;
  }

  /**
   * Attempts to get the value stored in Nothing, which always results in an error.
   * @returns {Error} An error indicating that the value of Nothing cannot be extracted.
   */
  public get(): Error {
    return new ExtractValueError("Can't extract the value of a Nothing.");
  }

  /**
   * Gets the specified default value since Nothing doesn't have a stored value.
   * @template T - The type of the default value.
   * @param {T} value - The default value to return.
   * @returns {T} The specified default value.
   */
  public getOrElse<T>(value: T): T {
    return value;
  }

  /**
   * Returns itself since mapping over Nothing has no effect.
   * @param {...function} fn - The function to apply (ignored in this case).
   * @returns {Nothing} The current Nothing instance.
   */
  public map(fn: (...args: any[]) => any): Nothing {
    return this;
  }

  /**
   * Creates a new Nothing instance.
   * @template T - The type parameter (ignored in this case).
   * @param {T} value - The value (ignored in this case).
   * @returns {Nothing} A new Nothing instance.
   */
  public static of<T>(value: T): Nothing {
    return new Nothing();
  }

  /**
   * Returns a string representation of the Nothing instance.
   * @returns {string} A string representation of the Nothing instance.
   */
  public toString(): string {
    return `Maybe.Nothing`;
  }
}
