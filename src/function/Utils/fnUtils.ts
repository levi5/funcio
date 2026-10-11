/**
 * Run a side-effect with the value and return the value untouched.
 * Handy for debugging inside _pipe chains.
 */
export const _tap = <T>(fn: (value: T) => void): ((value: T) => T) => {
  return (value: T) => {
    fn(value)
    return value
  }
}

/**
 * Ensure fn runs at most once; later calls return the first result.
 */
export const _once = <P extends any[], R>(fn: (...args: P) => R): ((...args: P) => R) => {
  let called = false
  let result: R
  return (...args: P): R => {
    if (!called) {
      called = true
      result = fn(...args)
    }
    return result
  }
}

/**
 * Memoize a pure function with an optional key resolver.
 */
export const _memoize = <P extends any[], R>(
  fn: (...args: P) => R,
  resolver?: (...args: P) => string
): ((...args: P) => R) => {
  const cache = new Map<string, R>()
  return (...args: P): R => {
    const key = resolver ? resolver(...args) : JSON.stringify(args)
    if (cache.has(key)) return cache.get(key) as R
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

/**
 * Flip the first two arguments of a binary function.
 */
export const _flip = <A, B, R>(fn: (a: A, b: B) => R): ((b: B, a: A) => R) => {
  return (b: B, a: A) => fn(a, b)
}
