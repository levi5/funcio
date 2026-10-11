import { left, right } from '../Monads/Either/index.js'
import { type IEither } from '../@Types/index.js'

export type TaskResult<T> = IEither.Either<Error, T>

/**
 * Lightweight Task: an async computation that resolves to Either<Error, T>.
 * Chains without manual try/catch at every step.
 */
export class _Task<T> {
  private constructor (private readonly runFn: () => Promise<TaskResult<T>>) {}

  static of<T>(value: T): _Task<T> {
    return new _Task(async () => right<Error, T>(value))
  }

  static fromPromise<T>(fn: () => Promise<T>): _Task<T> {
    return new _Task(async () => {
      try {
        return right<Error, T>(await fn())
      } catch (error) {
        return left<Error, T>(error instanceof Error ? error : new Error(String(error)))
      }
    })
  }

  static fromEither<T>(either: TaskResult<T>): _Task<T> {
    return new _Task(async () => either)
  }

  map<R>(fn: (value: T) => R): _Task<R> {
    return new _Task(async () => {
      const current = await this.runFn()
      if (current.isLeft()) return left<Error, R>(current.value as Error)
      try {
        return right<Error, R>(fn(current.value as T))
      } catch (error) {
        return left<Error, R>(error instanceof Error ? error : new Error(String(error)))
      }
    })
  }

  flatMap<R>(fn: (value: T) => _Task<R>): _Task<R> {
    return new _Task(async () => {
      const current = await this.runFn()
      if (current.isLeft()) return left<Error, R>(current.value as Error)
      return await fn(current.value as T).run()
    })
  }

  mapLeft (fn: (error: Error) => Error): _Task<T> {
    return new _Task(async () => {
      const current = await this.runFn()
      if (current.isRight()) return current
      return left<Error, T>(fn(current.value as Error))
    })
  }

  orElse<R> (fn: (error: Error) => _Task<R>): _Task<T | R> {
    return new _Task<T | R>(async () => {
      const current = await this.runFn()
      if (current.isRight()) return right<Error, T | R>(current.value as T)
      return await fn(current.value as Error).run()
    })
  }

  async run (): Promise<TaskResult<T>> {
    return await this.runFn()
  }

  async match<R>(handlers: { right: (value: T) => R, left: (error: Error) => R }): Promise<R> {
    const result = await this.runFn()
    return result.match(handlers)
  }

  static parallel<T>(tasks: Array<_Task<T>>): _Task<T[]> {
    return new _Task(async () => {
      const results = await Promise.all(tasks.map(async (t) => await t.run()))
      const out: T[] = []
      for (const r of results) {
        if (r.isLeft()) return left<Error, T[]>(r.value as Error)
        out.push(r.value as T)
      }
      return right<Error, T[]>(out)
    })
  }
}
