import { Just, Nothing } from './index.js'
import { WhenBuilder } from './whenBuilder.js'

export class _Maybe<T = any> {
  constructor () { };

  public isJust () {
    return false
  }

  public isNothing () {
    return false
  }

  public fold<R>(onNothing: () => R, onJust: (value: T) => R): R {
    return onNothing()
  }

  public filter(predicate: (value: T) => boolean): Just<T> | Nothing<T> {
    return this as unknown as Just<T> | Nothing<T>
  }

  public orElse<U>(other: Just<U> | Nothing<U>): Just<T | U> | Nothing<T | U> {
    return other
  }

  public tap(fn: (value: T) => void): Just<T> | Nothing<T> {
    return this as unknown as Just<T> | Nothing<T>
  }

  public toNullable(): T | null | undefined {
    return undefined
  }

  when<U>(predicate: boolean | ((value: any) => boolean)): WhenBuilder<T, U> {
    return new WhenBuilder(this, predicate)
  }

  static just<T>(value: T): Just<T> {
    return new Just(value)
  }

  static nothing <T>(value: T): Nothing<T> {
    return new Nothing<T>(value)
  }

  static fromNullable<T>(value: T): boolean {
    return (value !== null && value !== undefined)
  }

  static of<T>(value: T): Just<T> | Nothing<T> {
    return _Maybe.fromNullable(value)
      ? _Maybe.just(value)
      : _Maybe.nothing(value)
  }
}