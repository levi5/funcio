import { left, right } from '../Monads/Either/index.js'
import { type IEither } from '../@Types/index.js'

export type TaskResult<T> = IEither.Either<Error, T>

const toError = (error: unknown): Error => error instanceof Error ? error : new Error(String(error))
const abortError = (): Error => Object.assign(new Error('Task aborted'), { name: 'AbortError' })

const delay = async (ms: number, signal?: AbortSignal): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const cleanup = (): void => { clearTimeout(timer); signal?.removeEventListener('abort', abort) }
    const abort = (): void => { cleanup(); reject(abortError()) }
    const timer = setTimeout(() => { cleanup(); resolve() }, ms)
    signal?.addEventListener('abort', abort, { once: true })
    if (signal?.aborted === true) abort()
  })
}

/**
 * Lightweight Task: an async computation that resolves to Either<Error, T>.
 * Chains without manual try/catch at every step.
 */
export class _Task<T> {
  private constructor (private readonly runFn: (signal?: AbortSignal) => Promise<TaskResult<T>>) {}

  static of<T>(value: T): _Task<T> {
    return new _Task(async () => right<Error, T>(value))
  }

  static fromPromise<T>(fn: (signal?: AbortSignal) => Promise<T>): _Task<T> {
    return new _Task(async (signal) => {
      try {
        return right<Error, T>(await fn(signal))
      } catch (error) {
        return left<Error, T>(error instanceof Error ? error : new Error(String(error)))
      }
    })
  }

  static fromEither<T>(either: TaskResult<T>): _Task<T> {
    return new _Task(async () => either)
  }

  map<R>(fn: (value: T) => R): _Task<R> {
    return new _Task(async (signal) => {
      const current = await this.run(signal)
      if (signal?.aborted === true) return left<Error, R>(abortError())
      if (current.isLeft()) return left<Error, R>(current.value as Error)
      try {
        return right<Error, R>(fn(current.value as T))
      } catch (error) {
        return left<Error, R>(error instanceof Error ? error : new Error(String(error)))
      }
    })
  }

  flatMap<R>(fn: (value: T) => _Task<R>): _Task<R> {
    return new _Task(async (signal) => {
      const current = await this.run(signal)
      if (signal?.aborted === true) return left<Error, R>(abortError())
      if (current.isLeft()) return left<Error, R>(current.value as Error)
      return await fn(current.value as T).run(signal)
    })
  }

  mapLeft (fn: (error: Error) => Error): _Task<T> {
    return new _Task(async (signal) => {
      const current = await this.run(signal)
      if (signal?.aborted === true) return left<Error, T>(abortError())
      if (current.isRight()) return current
      return left<Error, T>(fn(current.value as Error))
    })
  }

  orElse<R> (fn: (error: Error) => _Task<R>): _Task<T | R> {
    return new _Task<T | R>(async (signal) => {
      const current = await this.run(signal)
      if (signal?.aborted === true) return left<Error, T | R>(abortError())
      if (current.isRight()) return right<Error, T | R>(current.value as T)
      return await fn(current.value as Error).run(signal)
    })
  }

  retry (retries: number, delayMs = 0): _Task<T> {
    if (!Number.isInteger(retries) || retries < 0) throw new RangeError('Retries must be a non-negative integer')
    if (!Number.isFinite(delayMs) || delayMs < 0) throw new RangeError('Delay must be a non-negative finite number')
    return new _Task(async (signal) => {
      let result = await this.run(signal)
      for (let attempt = 0; attempt < retries && result.isLeft() && signal?.aborted !== true; attempt++) {
        if (delayMs > 0) await delay(delayMs, signal)
        result = await this.run(signal)
      }
      return result
    })
  }

  timeout (ms: number): _Task<T> {
    if (!Number.isFinite(ms) || ms < 0) throw new RangeError('Timeout must be a non-negative finite number')
    return new _Task(async (signal) => {
      const controller = new AbortController()
      const abort = (): void => { controller.abort() }
      signal?.addEventListener('abort', abort, { once: true })
      if (signal?.aborted === true) abort()
      let timedOut = false
      const timer = setTimeout(() => { timedOut = true; controller.abort() }, ms)
      try {
        const result = await this.run(controller.signal)
        return timedOut
          ? left<Error, T>(Object.assign(new Error(`Task timed out after ${ms}ms`), { name: 'TimeoutError' }))
          : result
      } finally {
        clearTimeout(timer)
        signal?.removeEventListener('abort', abort)
      }
    })
  }

  async run (signal?: AbortSignal): Promise<TaskResult<T>> {
    if (signal?.aborted === true) return left<Error, T>(abortError())
    return await new Promise<TaskResult<T>>((resolve) => {
      const finish = (result: TaskResult<T>): void => {
        signal?.removeEventListener('abort', abort)
        resolve(result)
      }
      const abort = (): void => { finish(left<Error, T>(abortError())) }
      signal?.addEventListener('abort', abort, { once: true })
      Promise.resolve().then(async () => {
        if (signal?.aborted === true) return left<Error, T>(abortError())
        return await this.runFn(signal)
      }).then(finish, (error: unknown) => { finish(left<Error, T>(toError(error))) })
    })
  }

  async match<R>(handlers: { right: (value: T) => R, left: (error: Error) => R }, signal?: AbortSignal): Promise<R> {
    const result = await this.run(signal)
    return result.match(handlers)
  }

  static parallel<T>(tasks: Array<_Task<T>>, concurrency = Infinity): _Task<T[]> {
    if (concurrency !== Infinity && (!Number.isInteger(concurrency) || concurrency < 1)) {
      throw new RangeError('Concurrency must be a positive integer or Infinity')
    }
    return new _Task(async (signal) => {
      const out: T[] = new Array(tasks.length)
      let next = 0
      let failure: Error | undefined
      const worker = async (): Promise<void> => {
        while (next < tasks.length && failure === undefined && signal?.aborted !== true) {
          const index = next++
          const result = await tasks[index].run(signal)
          if (result.isLeft()) failure ??= result.value as Error
          else out[index] = result.value as T
        }
      }
      await Promise.all(Array.from({ length: Math.min(tasks.length, concurrency) }, worker))
      if (signal?.aborted === true) return left<Error, T[]>(abortError())
      if (failure !== undefined) return left<Error, T[]>(failure)
      return right<Error, T[]>(out)
    })
  }
}
