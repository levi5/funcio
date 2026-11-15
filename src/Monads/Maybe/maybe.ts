import { Just, Nothing } from './index.js'
import { WhenBuilder } from './whenBuilder.js'
import { left, right } from '@funcio/Monads/Either/index.js'
import type { IEither } from '@funcio/@Types/index.js'

export class _Maybe<T = unknown> {
  public isJust () {
    return false
  }

  public isNothing () {
    return false
  }

  public fold<R>(onNothing: () => R, _onJust: (value: T) => R): R {
    return onNothing()
  }

  public filter (_predicate: (value: T) => boolean): Just<T> | Nothing<T> {
    return this as unknown as Just<T> | Nothing<T>
  }

  public orElse<U>(other: Just<U> | Nothing<U>): Just<T | U> | Nothing<T | U> {
    return other
  }

  public tap (_fn: (value: T) => void): Just<T> | Nothing<T> {
    return this as unknown as Just<T> | Nothing<T>
  }

  public toNullable (): T | null | undefined {
    return undefined
  }

  public toEither<L>(fallback: L): IEither.Either<L, T> {
    return this.fold<IEither.Either<L, T>>(() => left<L, T>(fallback), (value) => right<L, T>(value))
  }

  static sequence<T>(list: Array<Just<T> | Nothing<T>>): Just<T[]> | Nothing<T[]> {
    const values: T[] = []
    for (const item of list) {
      if (item.isNothing()) return Nothing.of(undefined as unknown as T[])
      values.push((item as Just<T>).get())
    }
    return Just.of(values)
  }

  static traverse<A, B>(list: A[], fn: (value: A) => Just<B> | Nothing<B>): Just<B[]> | Nothing<B[]> {
    const values: B[] = []
    for (const value of list) {
      const item = fn(value)
      if (item.isNothing()) return Nothing.of(undefined as unknown as B[])
      values.push((item as Just<B>).get())
    }
    return Just.of(values)
  }

  when<U>(predicate: boolean | ((value: T) => boolean)): WhenBuilder<T, U> {
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
