import type { PatternMatching } from '@funcio/@Types/Match/index.js'
import { $isObject } from '@funcio/Object/common.js'

type IsUnion<T, Whole = T> = T extends Whole ? [Whole] extends [T] ? false : true : never

// A widened or union-typed pattern denotes one runtime value, not the whole type.
type IsFixedPattern<P> = 0 extends (1 & P) ? false
  : true extends IsUnion<P> ? false
    : P extends StringConstructor | NumberConstructor | BooleanConstructor | SymbolConstructor ? true
      : P extends (...args: never[]) => unknown ? false
        : P extends readonly unknown[] ? false
          : P extends object ? false extends { [K in keyof P]-?: IsFixedPattern<P[K]> }[keyof P] ? false : true
            : P extends string ? string extends P ? false : true
              : P extends number ? number extends P ? false : true
                : P extends boolean ? boolean extends P ? false : true
                  : P extends symbol ? symbol extends P ? false : true
                    : P extends null | undefined ? true : false

type Covered<T, P> = IsFixedPattern<P> extends true
  ? P extends StringConstructor ? Extract<T, string>
    : P extends NumberConstructor ? Extract<T, number>
      : P extends BooleanConstructor ? Extract<T, boolean>
        : P extends SymbolConstructor ? Extract<T, symbol>
          : T extends PatternMatching.InvertedPattern<P> ? T : never
  : never

export interface MatchBuilder<T, R, Remaining = T> {
  with: {
    (pattern: BooleanConstructor, expression: (value: Extract<T, boolean>) => R): MatchBuilder<T, R, Exclude<Remaining, boolean>>
    (pattern: (value: T) => boolean, expression: (value: T) => R): MatchBuilder<T, R, Remaining>
    <const P extends PatternMatching.Pattern<T>>(pattern: P, expression: (value: PatternMatching.CustomExtract<T, PatternMatching.InvertedPattern<P>>) => R): MatchBuilder<T, R, Exclude<Remaining, Covered<Remaining, P>>>
  }
  _: (fallback: () => R) => MatchBuilder<T, R, never>
  exec: () => [Remaining] extends [never] ? R : R | null
  exhaustive: [Remaining] extends [never] ? () => R : never
}

/** Match in declaration order; use a fallback or cover every case before exhaustive(). */
export const _match = <T, R>(value: T): MatchBuilder<T, R> => patternBuilder<T, R>(value)(undefined, []) as MatchBuilder<T, R>

const matchPattern = <T>(value: T, pattern: PatternMatching.Pattern<T>): boolean => {
  if (pattern === String) return typeof value === 'string'
  if (pattern === Number) return typeof value === 'number' && !Number.isNaN(value)
  if (pattern === Boolean) return typeof value === 'boolean'
  if (pattern === Symbol) return typeof value === 'symbol'
  const isFunction = typeof pattern === 'function' && typeof value === 'function'
  const isString = typeof pattern === 'string' && typeof value === 'string'
  const isBoolean = typeof pattern === 'boolean' && typeof value === 'boolean'
  const isNumber = typeof pattern === 'number' && typeof value === 'number' && !Number.isNaN(value)
  const isSymbol = typeof pattern === 'symbol' && typeof value === 'symbol' && value.description === pattern.description
  const isPrimitive = isString || isBoolean || isNumber || isSymbol
  const isNull = (value === null || value === undefined) && (pattern === null || pattern === undefined)
  if (isFunction) return true
  if (isPrimitive || isNull) {
    return (value === pattern) ||
      (isSymbol && (value as symbol).description === (pattern).description)
  }

  if (Array.isArray(pattern)) {
    if (!Array.isArray(value)) return false
    if (pattern.length !== (value as unknown[]).length) return false
    return pattern.every((patternItem: unknown, index: number) =>
      matchPattern<unknown>((value as unknown[])[index], patternItem as PatternMatching.Pattern<unknown>))
  }

  if (typeof pattern === 'function') {
    try {
      return (pattern as (v: T) => unknown)(value) === true
    } catch {
      return false
    }
  }

  return $isObject(pattern) && value !== null && value !== undefined && Object.keys(pattern).every((key) => {
    const subValue = (value as Record<string, unknown>)[key]
    const subPattern = (pattern as unknown as Record<string, unknown>)[key]
    return matchPattern(subValue, subPattern as PatternMatching.Pattern<unknown>)
  })
}

const unmatched = (): never => null as never

const patternBuilder =
  <T, R>(value: T) => (
    _: PatternMatching.WildcardArgs<R> = unmatched,
    patterns: Array<{ value: PatternMatching.Pattern<T>, expression: (v: never) => R }> = []
  ) => ({
    with: <S extends PatternMatching.Pattern<T>>(
      pattern: S,
      expression: PatternMatching.MatchingFunction<PatternMatching.CustomExtract<T, PatternMatching.InvertedPattern<typeof pattern>>, R>
    ) => patternBuilder(value)(_, [...patterns, { value: pattern, expression }]),

    _: (__: () => R) => patternBuilder(value)(__, patterns),

    exec: (): R => {
      const matchedPattern = patterns.find((option) => {
        const { value: currentPattern } = option
        return matchPattern(value, currentPattern)
      })

      if (!matchedPattern) {
        return _()
      }
      const { expression } = matchedPattern
      return Reflect.apply(expression, undefined, [value]) as R
    },
    exhaustive: (): R => {
      const matchedPattern = patterns.find((option) => matchPattern(value, option.value))
      if (matchedPattern) return Reflect.apply(matchedPattern.expression, undefined, [value]) as R
      if (_ === unmatched) throw new Error('Non-exhaustive match')
      return _()
    }
  })
