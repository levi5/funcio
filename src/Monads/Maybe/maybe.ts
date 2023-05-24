
import { Just, Nothing } from ".";
import { _Object } from "../../Object";

export class _Maybe {
  constructor() { };

  public isJust() {
    return false;
  }

  public isNothing() {
    return false;
  }

  static just<T>(value: T) {
    return new Just(value)
  }

  static nothing() {
    return new Nothing()
  }

  static fromNullable<T>(value: T) {
    return !!value;
  }

  static of<T>(value: T) {
    return _Maybe.fromNullable(value)
      ? _Maybe.just(value)
      : _Maybe.nothing();
  }
}