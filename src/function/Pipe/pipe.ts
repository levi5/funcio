import { type FN, type Pipeline } from '../../@Types/Pipe'

export function _pipe<T, FNS extends FN[]> (
  input: T,
  ...fns: FNS
): ReturnType<Pipeline<FNS>>

export function _pipe<T, FNS extends FN[]> (input: T, ...fns: FNS): FN {
  return fns.reduce((previousValue, fn) =>
    fn.call(fn, previousValue), input)
}
