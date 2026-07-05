import { type Pipeline } from '../../@Types/Pipe'
import { type FN } from '../../@Types/common'

type AsyncFN = (value: any) => any | Promise<any>

export const asyncPipe = async <T>(
  input: T,
  ...fns: AsyncFN[]
): Promise<any> => {
  return await fns.reduce(
    async (previousValue, fn) => fn(await previousValue),
    Promise.resolve(input)
  )
}

function pipe<T, FNS extends FN[]> (
  input: T,
  ...fns: FNS
): ReturnType<Pipeline<FNS>>

function pipe (input: unknown, ...fns: FN[]): unknown {
  return fns.reduce((previousValue, fn) =>
    fn.call(fn, previousValue), input)
}

export const _pipe = pipe as typeof pipe & {
  async: typeof asyncPipe
}

_pipe.async = asyncPipe
