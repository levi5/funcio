import { _Maybe } from './maybe.js'
import { type Just } from './just.js'
import { type Nothing } from './nothing.js'

export class WhenBuilder<T, U> {
  private readonly predicate: boolean | ((value: any) => boolean)
  private onTrueFn?: (value: any) => any
  private onFalseFn?: (value: any) => any
  private readonly source: _Maybe<T>

  constructor (source: _Maybe<T>, predicate: boolean | ((value: any) => boolean)) {
    this.source = source
    this.predicate = predicate
  }

  then<V> (fn: (value: T) => V): WhenBuilder<T, V> {
    this.onTrueFn = fn
    return this as unknown as WhenBuilder<T, V>
  }

  else<V> (fn: (value: T) => V): WhenBuilder<T, V> {
    this.onFalseFn = fn
    return this as unknown as WhenBuilder<T, V>
  }

  private evaluatePredicate (value: T): boolean {
    return typeof this.predicate === 'function'
      ? (this.predicate as (value: T) => boolean)(value)
      : this.predicate
  }

  private exec (): U {
    const isJust = this.source.isJust()
    const value = isJust ? (this.source as any).get() : undefined

    const predicateResult = isJust ? this.evaluatePredicate(value) : false

    if (predicateResult && this.onTrueFn) {
      return this.onTrueFn(value)
    }

    if (this.onFalseFn) {
      return this.onFalseFn(value as T)
    }

    throw new Error('WhenBuilder: either then() or else() must be provided')
  }

  map<R> (fn: (value: U) => R): Just<R> | Nothing<R> {
    return _Maybe.of(this.exec() as any).map(fn)
  }

  flatMap<R extends _Maybe<any>> (fn: (value: U) => R): R | Nothing<any> {
    return _Maybe.of(this.exec() as any).flatMap(fn)
  }

  chain<R extends _Maybe<any>> (fn: (value: U) => R): R | Nothing<any> {
    return this.flatMap(fn)
  }

  getOrElse<R> (defaultValue: R): U | R {
    const result = this.exec()
    return _Maybe.fromNullable(result) ? result : defaultValue
  }

  toMaybe (): Just<U> | Nothing<U> {
    const result: unknown = this.exec()
    if (result instanceof _Maybe) return result as unknown as Just<U> | Nothing<U>
    return _Maybe.of(result as U)
  }

  unwrap (): U {
    return this.exec()
  }
}
