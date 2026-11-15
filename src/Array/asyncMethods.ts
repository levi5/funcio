export interface AsyncArrayOptions {
  concurrency?: number
  signal?: AbortSignal
}

const aborted = (): Error => Object.assign(new Error('Array operation aborted'), { name: 'AbortError' })

/** Preserves input order; rejects with the original callback error. */
export const mapAsync = async <T, R>(
  array: T[],
  fn: (value: T, index: number, array: T[], signal?: AbortSignal) => Promise<R> | R,
  options: AsyncArrayOptions = {}
): Promise<R[]> => {
  const { concurrency = Infinity, signal } = options
  if (concurrency !== Infinity && (!Number.isInteger(concurrency) || concurrency < 1)) {
    throw new RangeError('Concurrency must be a positive integer or Infinity')
  }
  if (signal?.aborted === true) throw aborted()
  return await new Promise<R[]>((resolve, reject) => {
    // Promise.all historically materializes sparse slots as undefined.
    const out: R[] = new Array(array.length).fill(undefined as unknown as R)
    const indices: number[] = []
    for (let index = 0; index < array.length; index++) if (index in array) indices.push(index)
    let next = 0
    let stopped = false
    const cleanup = (): void => { signal?.removeEventListener('abort', abort) }
    const fail = (error: unknown): void => {
      stopped = true
      cleanup()
      reject(error)
    }
    const abort = (): void => { fail(aborted()) }
    signal?.addEventListener('abort', abort, { once: true })
    const worker = async (): Promise<void> => {
      while (next < indices.length) {
        if (stopped) return
        const index = indices[next++]
        try {
          out[index] = await fn(array[index], index, array, signal)
        } catch (error) {
          fail(error)
          return
        }
      }
    }
    Promise.all(Array.from({ length: Math.min(indices.length, concurrency) }, worker)).then(() => {
      cleanup()
      resolve(out)
    }, fail)
  })
}

export const filterAsync = async <T>(
  array: T[],
  fn: (value: T, index: number, array: T[], signal?: AbortSignal) => Promise<boolean> | boolean,
  options?: AsyncArrayOptions
): Promise<T[]> => {
  const keep = await mapAsync(array, fn, options)
  return array.filter((_, index) => Boolean(keep[index]))
}

export const forEachAsync = async <T, R>(array: T[], fn: (x: T) => R): Promise<Awaited<R> | undefined> => await array.reduce<Promise<Awaited<R> | undefined>>(
  async (promise, value): Promise<Awaited<R> | undefined> => {
    await promise
    return await fn(value)
  },
  Promise.resolve(undefined)
)
