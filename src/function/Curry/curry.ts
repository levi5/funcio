import type { Curry } from '@funcio/@Types/Curry/index.js'

/** Leave an argument open when partially applying a curried function. */
export const _placeholder: unique symbol = Symbol('funcio.placeholder')

function curry<P extends unknown[], R> (
  fn: (...args: P) => R
): Curry.TResponse<P, R>

function curry (fn: (...args: never[]) => unknown) {
  const collect = (previous: unknown[]) => (...incoming: unknown[]): unknown => {
    const args = previous.slice()
    let next = 0
    // Only fill holes from earlier calls; holes from this call remain open.
    for (let index = 0; index < args.length && next < incoming.length; index++) {
      if (args[index] === _placeholder) args[index] = incoming[next++]
    }
    args.push(...incoming.slice(next))
    return args.length >= fn.length && !args.slice(0, fn.length).includes(_placeholder)
      ? Reflect.apply(fn, null, args)
      : collect(args)
  }
  return fn.length === 0 ? fn() : collect([])
}

const placeholder: { placeholder: typeof _placeholder } = { placeholder: _placeholder }
export const _curry = Object.assign(curry, placeholder)
