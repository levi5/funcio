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
   */
  export type Pattern<T> =
    T extends number ? T | NumberConstructor :
      T extends string ? T | StringConstructor :
        T extends boolean ? T | BooleanConstructor :
          T extends symbol ? T | SymbolConstructor :
              { [k in keyof T]?: Pattern<T[k]> }

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
            S extends Array<infer SS> ? Array<InvertedPattern<SS>> :
                { [k in keyof S]: InvertedPattern<S[k]> }
}
