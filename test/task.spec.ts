import { afterEach, describe, expect, it, vi } from 'vitest'
import { _Task } from '../src/main.js'

afterEach(() => { vi.useRealTimers() })

describe('_Task execution controls', () => {
  it('retries lazily, stopping on success and rerunning for each run', async () => {
    let calls = 0
    const task = _Task.fromPromise(async () => {
      if (++calls < 3) throw new Error('temporary')
      return calls
    }).retry(3)
    expect(calls).toBe(0)
    expect((await task.run()).value).toBe(3)
    expect((await task.run()).value).toBe(4)
  })

  it('returns the final failure after the configured retries', async () => {
    const fn = vi.fn(async () => { throw new Error('failed') })
    const result = await _Task.fromPromise(fn).retry(2).run()
    expect(result.isLeft()).toBe(true)
    expect(fn).toHaveBeenCalledTimes(3)
    expect((await _Task.fromPromise(fn).retry(0).run()).isLeft()).toBe(true)
    expect(fn).toHaveBeenCalledTimes(4)
  })

  it('delays retries and cancels pending waits without leaking timers', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const fn = vi.fn(async () => { throw new Error('failed') })
    const run = _Task.fromPromise(fn).retry(3, 100).run(controller.signal)
    await vi.advanceTimersByTimeAsync(50)
    expect(fn).toHaveBeenCalledTimes(1)
    controller.abort()
    expect((await run).value).toMatchObject({ name: 'AbortError' })
    await vi.advanceTimersByTimeAsync(500)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('times out and passes an aborted signal to the underlying operation', async () => {
    vi.useFakeTimers()
    let received: AbortSignal | undefined
    const run = _Task.fromPromise(async (signal) => {
      received = signal
      return await new Promise<number>(() => {})
    }).timeout(20).run()
    await vi.advanceTimersByTimeAsync(20)
    expect((await run).value).toMatchObject({ name: 'TimeoutError' })
    expect(received?.aborted).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
    expect((await _Task.of(1).timeout(100).run()).value).toBe(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not start pre-cancelled tasks or recover cancellation', async () => {
    const controller = new AbortController()
    controller.abort()
    const fn = vi.fn(async () => 1)
    expect((await _Task.fromPromise(fn).run(controller.signal)).value).toMatchObject({ name: 'AbortError' })
    expect(fn).not.toHaveBeenCalled()

    const active = new AbortController()
    const recover = vi.fn(() => _Task.of(1))
    const pending = _Task.fromPromise(async () => await new Promise<number>(() => {})).orElse(recover).run(active.signal)
    await Promise.resolve()
    active.abort()
    expect((await pending).value).toMatchObject({ name: 'AbortError' })
    await Promise.resolve()
    expect(recover).not.toHaveBeenCalled()
  })

  it('captures exceptions thrown in every chaining callback', async () => {
    const boom = (): never => { throw 'boom' }
    for (const task of [
      _Task.of(1).map(boom),
      _Task.of(1).flatMap(boom),
      _Task.fromPromise(async () => { throw new Error('original') }).mapLeft(boom),
      _Task.fromPromise(async () => { throw new Error('original') }).orElse(boom)
    ]) {
      expect((await task.run()).value).toMatchObject({ message: 'boom' })
    }
  })

  it('limits concurrency and preserves input order', async () => {
    vi.useFakeTimers()
    let active = 0
    let peak = 0
    const tasks = [30, 10, 5, 1].map((ms, index) => _Task.fromPromise(async () => {
      peak = Math.max(peak, ++active)
      await new Promise((resolve) => setTimeout(resolve, ms))
      active--
      return index
    }))
    const run = _Task.parallel(tasks, 2).run()
    await vi.runAllTimersAsync()
    expect((await run).value).toEqual([0, 1, 2, 3])
    expect(peak).toBe(2)
    expect((await _Task.parallel([]).run()).value).toEqual([])
  })

  it('stops scheduling queued work after failure or cancellation', async () => {
    const queued = vi.fn(async () => 2)
    const failed = await _Task.parallel([
      _Task.fromPromise(async () => { throw new Error('failed') }), _Task.fromPromise(queued)
    ], 1).run()
    expect(failed.isLeft()).toBe(true)
    expect(queued).not.toHaveBeenCalled()
    const controller = new AbortController()
    const pending = _Task.parallel([
      _Task.fromPromise(async () => await new Promise<number>(() => {})), _Task.fromPromise(queued)
    ], 1).run(controller.signal)
    await Promise.resolve()
    controller.abort()
    expect((await pending).value).toMatchObject({ name: 'AbortError' })
    expect(queued).not.toHaveBeenCalled()
  })

  it('rejects invalid execution options', () => {
    for (const value of [-1, 1.5, NaN, Infinity]) expect(() => _Task.of(1).retry(value)).toThrow(RangeError)
    for (const value of [-1, NaN, Infinity]) {
      expect(() => _Task.of(1).timeout(value)).toThrow(RangeError)
      expect(() => _Task.of(1).retry(1, value)).toThrow(RangeError)
    }
    for (const value of [0, -1, 1.5, NaN]) expect(() => _Task.parallel([], value)).toThrow(RangeError)
  })
})
