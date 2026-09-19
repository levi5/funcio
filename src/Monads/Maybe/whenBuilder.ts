import { _Maybe } from './maybe'

export class WhenBuilder<T, U> {
  private predicate: boolean | ((value: T) => boolean)
  private onTrueFn?: (value: T) => U
  private onFalseFn?: (value: T) => U
  private source: _Maybe<T>

  constructor(source: _Maybe<T>, predicate: boolean | ((value: T) => boolean)) {
    this.source = source
    this.predicate = predicate
  }

  then(fn: (value: T) => U): this {
    this.onTrueFn = fn
    return this
  }

  else(fn: (value: T) => U): this {
    this.onFalseFn = fn
    return this
  }

  private evaluatePredicate(value: T): boolean {
    return typeof this.predicate === 'function'
      ? (this.predicate as (value: T) => boolean)(value)
      : this.predicate
  }

  private exec(): U {
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

  map<R>(fn: (value: U) => R): _Maybe<R> {
    return _Maybe.of(this.exec() as any).map(fn) as any
  }

  flatMap<R>(fn: (value: U) => _Maybe<R>): _Maybe<R> {
    return _Maybe.of(this.exec() as any).flatMap(fn) as any
  }

  chain<R>(fn: (value: U) => _Maybe<R>): _Maybe<R> {
    return this.flatMap(fn)
  }

  getOrElse<R>(defaultValue: R): U | R {
    const result = this.exec()
    return _Maybe.fromNullable(result) ? result : defaultValue
  }

  toMaybe(): _Maybe<U> {
    const result = this.exec()
    return result instanceof _Maybe ? result : _Maybe.of(result)
  }

  unwrap(): U {
    return this.exec()
  }
}