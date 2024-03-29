import { Just, Nothing } from '.'

export class _Maybe {
  constructor () { };

  public isJust () {
    return false
  }

  public isNothing () {
    return false
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
