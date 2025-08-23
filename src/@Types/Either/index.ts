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
  }

  export interface TRight<L, R> {
    flag: symbol
    value: R
    isLeft(): boolean
    isRight(): boolean
    match<T>(handlers: Match<L, R, T>): T
  }

  export type Either<L, R> = TLeft<L, R> | TRight<L, R>
}
