export type Match<L, R, T> = {
  left: (value: L) => T
  right: (value: R) => T
}


export namespace IEither {

  export const EitherType = {
    FLAG_Left: Symbol(':left:'),
    Flag_Right: Symbol(':right:')
  }

  export interface TLeft<L, R> {
    flag: symbol
    value: L
    isLeft(): boolean
    isRight(): boolean
    match<T>(handlers: Match<L, R, T>): T
    map<NR>(fn: (value: R) => NR): TLeft<L, NR>
    mapLeft<NL>(fn: (value: L) => NL): TLeft<NL, R>
    flatMap<NR>(fn: (value: R) => Either<L, NR>): TLeft<L, NR>
    getOrElse<DefaultValue>(defaultValue: DefaultValue): R | DefaultValue
    bimap<NL, NR>(mapLeftFn: (value: L) => NL, mapRightFn: (value: R) => NR): TLeft<NL, NR>
    fold<T>(onLeft: (value: L) => T, onRight: (value: R) => T): T
    orElse<NL>(fn: (value: L) => Either<NL, R>): Either<NL, R>
    tap(fn: (value: R) => void): TLeft<L, R>
    getOrThrow(): R
  }

  export interface TRight<L, R> {
    flag: symbol
    value: R
    isLeft(): boolean
    isRight(): boolean
    match<T>(handlers: Match<L, R, T>): T
    map<NR>(fn: (value: R) => NR): TRight<L, NR>
    mapLeft<NL>(fn: (value: L) => NL): TRight<NL, R>
    flatMap<NR>(fn: (value: R) => Either<L, NR>): Either<L, NR>
    getOrElse<DefaultValue>(defaultValue: DefaultValue): R | DefaultValue
    bimap<NL, NR>(mapLeftFn: (value: L) => NL, mapRightFn: (value: R) => NR): TRight<NL, NR>
    fold<T>(onLeft: (value: L) => T, onRight: (value: R) => T): T
    orElse<NL>(fn: (value: L) => Either<NL, R>): Either<NL, R>
    tap(fn: (value: R) => void): TRight<L, R>
    getOrThrow(): R
  }

  export type Either<L, R> = TLeft<L, R> | TRight<L, R>
}
