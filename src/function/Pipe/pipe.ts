import type { Pipeline } from '@funcio/@Types/Pipe/index.js'
import type { FN } from '@funcio/@Types/common.js'

type AsyncFN = (value: any) => any | Promise<any>

type AsyncSteps<T, F extends AsyncFN[]> = F extends [infer H extends AsyncFN, ...infer Rest extends AsyncFN[]]
  ? [(value: Awaited<T>) => ReturnType<H>, ...AsyncSteps<ReturnType<H>, Rest>]
  : F
type AsyncOutput<T, F extends AsyncFN[]> = number extends F['length']
  ? Awaited<T | ReturnType<F[number]>>
  : F extends [infer H extends AsyncFN, ...infer Rest extends AsyncFN[]]
    ? AsyncOutput<ReturnType<H>, Rest>
    : Awaited<T>

export function asyncPipe<T> (input: T): Promise<Awaited<T>>
export function asyncPipe<T, A> (input: T, a: (value: Awaited<T>) => A): Promise<Awaited<A>>
export function asyncPipe<T, A, B> (input: T, a: (value: Awaited<T>) => A, b: (value: Awaited<A>) => B): Promise<Awaited<B>>
export function asyncPipe<T, A, B, C> (input: T, a: (value: Awaited<T>) => A, b: (value: Awaited<A>) => B, c: (value: Awaited<B>) => C): Promise<Awaited<C>>
export function asyncPipe<T, A, B, C, D> (input: T, a: (value: Awaited<T>) => A, b: (value: Awaited<A>) => B, c: (value: Awaited<B>) => C, d: (value: Awaited<C>) => D): Promise<Awaited<D>>
export function asyncPipe<T, A, B, C, D, E> (input: T, a: (value: Awaited<T>) => A, b: (value: Awaited<A>) => B, c: (value: Awaited<B>) => C, d: (value: Awaited<C>) => D, e: (value: Awaited<D>) => E): Promise<Awaited<E>>
export function asyncPipe<T, F extends AsyncFN[]> (input: T, ...fns: F & AsyncSteps<T, F>): Promise<AsyncOutput<T, F>>
export async function asyncPipe (input: unknown, ...fns: AsyncFN[]): Promise<unknown> {
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
