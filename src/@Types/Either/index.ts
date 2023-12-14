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
  }

  export interface TRight<L, R> {
    flag: symbol
    value: R
    isLeft(): boolean
    isRight(): boolean
  }

  export type Either<L, R> = TLeft<L, R> | TRight<L, R>
}
