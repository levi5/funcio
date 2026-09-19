import { Just, Nothing } from '.'
import { WhenBuilder } from './whenBuilder'

export class _Maybe<T = any> {
  constructor () { };

  public isJust () {
    return false
  }

  public isNothing () {
    return false
  }

  when<U>(predicate: boolean | ((value: T) => boolean)): WhenBuilder<T, U> {
    return new WhenBuilder(this, predicate)
  }

  static just<T>(value: T) {
    return new Just(value)
  }

  static nothing <T>(value: T) {
    return new Nothing<T>(value)
  }

  static fromNullable<T>(value: T) {
    return (value !== null && value !== undefined)
  }

  static of<T>(value: T) {
    return _Maybe.fromNullable(value)
      ? _Maybe.just(value)
      : _Maybe.nothing(value)
  }
}