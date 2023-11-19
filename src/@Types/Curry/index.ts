export namespace Curry {
  export type TResponse<P, R> = P extends []
    ? R
    : P extends [infer H]
    ? (arg: H) => R // 1 arg
    : P extends [infer H, ...infer T] // 2 or more args
    ? (arg: H) => TResponse<[...T], R>
    : never;
}