import { _Maybe } from "./maybe";
import { MaybeType } from "../../@Types";

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
  public tag: MaybeType;

  /**
   * Creates an instance of Just with the specified value.
   * @param {T} value - The value to be stored in Just.
   */
  constructor(private readonly value: T) {
    super();
    /**
     * The tag indicating the Maybe type as Just.
     * @type {MaybeType}
     */
    this.tag = MaybeType.Just;
  }

  /**
   * Checks if the Maybe instance is a Just.
   * @returns {boolean} True if the Maybe instance is a Just, otherwise false.
   */
  public isJust(): boolean {
    return true;
  }

  /**
   * Gets the value stored in Just.
   * @returns {T} The value stored in Just.
   */
  public get(): T {
    return this.value;
  }

  /**
   * Gets the value stored in Just, or a default value if it's Nothing.
   * @param {T} value - The default value to return if the Maybe instance is Nothing.
   * @returns {T} The value stored in Just, or the default value if it's Nothing.
   */
  public getOrElse(value: T): T {
    if (this.isNothing()) return value;
    return this.value as T;
  }

  /**
   * Applies a function to the value inside Just and returns a new Just with the result.
   * @param {...function} fn - The function to apply to the value inside Just.
   * @returns {Just} A new Just with the result of applying the function.
   */
  public map(fn: (...args: any[]) => any): Just<any> {
    return Just.of(fn(this.value));
  }

  /**
   * Creates a new Just instance with the specified value.
   * @param {T} value - The value to be stored in the new Just instance.
   * @returns {Just<T>} A new Just instance with the specified value.
   */
  public static of<T>(value: T): Just<T> {
    return new Just(value);
  }

  /**
   * Returns a string representation of the Just instance.
   * @returns {string} A string representation of the Just instance.
   */
  public toString(): string {
    return `Maybe.Just(${this.value})`;
  }
}
