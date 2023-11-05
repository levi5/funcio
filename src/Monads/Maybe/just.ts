import { _Maybe } from "./maybe"
import { MaybeType } from "../../@Types";

export class Just<T> extends _Maybe {
  public tag: MaybeType;
  constructor(private readonly value: T) {
    super();
    this.tag = MaybeType.Just;
  }

  public isJust() {
    return true;
  }

  public get(): T {
    return this.value;
  }

  public getOrElse(value: T) {
    if (this.isNothing()) return value
    return this.value as T
  }

  public map(fn: (...args: any[]) => any) {
    return Just.of(fn(this.value));
  }

  public static of<T>(value: T) {
    return new Just(value);
  }

  public toString() {
    return `Maybe.Just(${this.value})`;
  }
}
