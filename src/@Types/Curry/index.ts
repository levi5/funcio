import type { _placeholder } from '@funcio/function/Curry/curry.js'

type Placeholder = typeof _placeholder
type Prefix<P extends any[]> = P extends [infer H, ...infer T]
  ? [H | Placeholder] | [H | Placeholder, ...Prefix<T>]
  : []
type Remaining<P extends any[], A extends any[], Kept extends any[] = []> =
  A extends [infer H, ...infer T]
    ? P extends [infer PH, ...infer PT]
      ? Remaining<PT, T, H extends Placeholder ? [...Kept, PH] : Kept>
      : Kept
    : [...Kept, ...P]

export namespace Curry {
  export type TResponse<P extends any[], R> = P extends [] ? R
    : P extends [infer H, ...infer T] ? {
      (arg: Placeholder): TResponse<P, R>
      (arg: H): TResponse<T, R>
      <const A extends Prefix<P>>(...args: A): Remaining<P, A> extends infer Rest extends any[] ? TResponse<Rest, R> : never
    } : never
}
