/**
 * Namespace containing types and functions for pattern matching.
 */
export namespace PatternMatching {

  /**
   * Type representing a wildcard argument function.
   */
  export type WildcardArgs<R> = () => R

  /**
   * Type representing a function that takes an argument of type `T` and returns a result of type `R`.
   */
  export type MatchingFunction<T, R> = (_: T) => R

  /**
   * Type representing a pattern for pattern matching.
   * Besides literals, constructors, arrays and partial shapes,
   * a predicate `(value) => boolean` is also accepted.
   */
  export type Pattern<T> =
    (T extends number ? T | NumberConstructor :
      T extends string ? T | StringConstructor :
        T extends boolean ? T | BooleanConstructor :
          T extends symbol ? T | SymbolConstructor :
            T extends Array<infer E> ? T | Array<Pattern<E>> :
              { [k in keyof T]?: Pattern<T[k]> })
    | ((value: T) => boolean)

  /**
   * Type representing custom extraction of types `T` and `R`.
   */
  export type CustomExtract<T, R> = R extends T
    ? R
    : T extends R ? T : never

  /**
   * Type representing the inverted pattern.
   */
  export type InvertedPattern<S> =
    S extends NumberConstructor ? number :
      S extends StringConstructor ? string :
        S extends BooleanConstructor ? boolean :
          S extends SymbolConstructor ? symbol :
            S extends (value: infer V) => boolean ? V :
              S extends Array<infer SS> ? Array<InvertedPattern<SS>> :
                  { [k in keyof S]: InvertedPattern<S[k]> }
}
