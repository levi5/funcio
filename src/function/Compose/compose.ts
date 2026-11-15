import type { FN } from '@funcio/@Types/common.js'

/**
 * Compose functions right-to-left: compose(f, g, h)(x) === f(g(h(x))).
 * Twin of _pipe (which is left-to-right).
 */
export const _compose = (...fns: FN[]): ((input: unknown) => unknown) => {
  return (input: unknown) => fns.reduceRight((acc, fn) => Reflect.apply(fn, undefined, [acc]) as unknown, input)
}

/**
 * Data-last pipe factory: pipeFn(f, g)(x) === g(f(x)).
 * Reusable version of _pipe(input, ...fns).
 */
export const _pipeFn = (...fns: FN[]): ((input: unknown) => unknown) => {
  return (input: unknown) => fns.reduce((acc, fn) => Reflect.apply(fn, undefined, [acc]) as unknown, input)
}
