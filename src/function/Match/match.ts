import { _Maybe } from '../../main.js'
import { type PatternMatching } from '../../@Types/Match/index.js'
import { $isObject } from '../../Object/common.js'

/**
 * Function for pattern matching.
 *
 * @param value - The value to match against.
 * @returns An object with methods for defining patterns and executing the matching.
 */
export const _match = <T, R>(value: T) => patternBuilder<T, R>(value)(undefined, [])

/**
 * Internal function for matching a value against a pattern.
 *
 * @param value - The value to match against.
 * @param pattern - The pattern to match.
 * @returns `true` if the value matches the pattern, otherwise `false`.
 */
const matchPattern = <T>(value: T, pattern: PatternMatching.Pattern<T>): boolean => {
  const isFunction = typeof pattern === 'function' && typeof value === 'function'
  const isString = (pattern === String || typeof pattern === 'string') && _Maybe.of(typeof value === 'string').getOrElse(false)
  const isBoolean = (pattern === Boolean || typeof pattern === 'boolean') && _Maybe.of(typeof value === 'boolean').getOrElse(false)
  const isNumber = (pattern === Number || typeof pattern === 'number') && _Maybe.of(typeof value === 'number' && !Number.isNaN(value)).getOrElse(false)
  const isSymbol = typeof pattern === 'symbol' && _Maybe.of(typeof value === 'symbol' && value.description === pattern.description).getOrElse(false)
  const isPrimitive = isString || isBoolean || isNumber || isSymbol
  const isNull = _Maybe.of(value).isNothing() && _Maybe.of(pattern).isNothing()
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

  if (typeof pattern === 'function' && (pattern as unknown) !== (String as unknown) && (pattern as unknown) !== (Number as unknown) && (pattern as unknown) !== (Boolean as unknown)) {
    try {
      return (pattern as (v: T) => boolean)(value) === true
    } catch {
      return false
    }
  }

  return $isObject(pattern) && Object.keys(pattern).every((key) => {
    const subValue = (value as unknown as Record<string, unknown>)[key]
    const subPattern = (pattern as unknown as Record<string, unknown>)[key]
    return matchPattern(subValue, subPattern as unknown as PatternMatching.Pattern<unknown>)
  })
}

/**
 * Internal function for building the pattern matching expression.
 *
 * @param value - The value to match against.
 * @param _ - The wildcard argument function.
 * @param patterns - The array of patterns.
 * @returns An object with methods for defining patterns and executing the matching.
 */
const patternBuilder =
  <T, R>(value: T) => (
    _: PatternMatching.WildcardArgs<R> = (() => null) as unknown as PatternMatching.WildcardArgs<R>,
    patterns: Array<{ value: PatternMatching.Pattern<T>, expression: (v: any) => R }> = []
  ) => ({
    /**
     * Adds a pattern and its corresponding expression to the pattern matching.
     *
     * @param pattern - The pattern to match.
     * @param expression - The expression to execute if the pattern matches.
     * @returns An object with methods for defining patterns and executing the matching.
     */
    with: <S extends PatternMatching.Pattern<T>>(
      pattern: S,
      expression: PatternMatching.MatchingFunction<PatternMatching.CustomExtract<T, PatternMatching.InvertedPattern<typeof pattern>>, R>
    ) => patternBuilder(value)(_, [...patterns, { value: pattern, expression }]),

    /**
     * Sets a default expression for the pattern matching.
     *
     * @param _ - The default expression.
     * @returns An object with methods for defining patterns and executing the matching.
     */
    _: (__: () => R) => patternBuilder(value)(__, patterns),

    /**
     * Executes the pattern matching and returns the result.
     *
     * @returns The result of the pattern matching.
     */
    exec: (): R & any => {
      const matchedPattern = patterns.find((option) => {
        const { value: currentPattern } = option
        return matchPattern(value, currentPattern)
      })

      if (!matchedPattern) {
        return _()
      }
      const { expression } = matchedPattern
      return expression(value)
    }
  })
