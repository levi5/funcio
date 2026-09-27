import type { LogEntry, SerializedError } from './format'
import type { RunResponse } from './replay.worker'
import { AbortedError, abort, execute } from './worker-pool'

export type RunStatus = 'ok' | 'error' | 'timeout'

export interface RunOutcome {
  status: RunStatus
  logs: LogEntry[]
  value: string | null
  error?: SerializedError
  durationMs: number
}

const DEFAULT_TIMEOUT_MS = 5000
const ABORT_REASON =
  'The snippet stopped responding. An infinite loop cannot be interrupted from the outside — break the loop or await something.'

class TimeoutSignal extends Error {}

const toOutcome = (response: RunResponse, durationMs: number): RunOutcome =>
  response.ok
    ? { status: 'ok', logs: response.logs, value: response.value, durationMs }
    : { status: 'error', logs: response.logs, value: null, error: response.error, durationMs }

const failure = (name: string, message: string, durationMs: number): RunOutcome => ({
  status: 'error',
  logs: [],
  value: null,
  error: { name, message, isSyntaxError: false },
  durationMs
})

const timeout = (timeoutMs: number, durationMs: number): RunOutcome => ({
  status: 'timeout',
  logs: [],
  value: null,
  error: {
    name: 'TimeoutError',
    message: `The snippet did not finish within ${Math.round(timeoutMs / 1000)}s.`,
    isSyntaxError: false
  },
  durationMs
})

export class ReplayRunner {
  private disposed = false

  async run(code: string, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<RunOutcome> {
    if (this.disposed) return failure('Error', 'The playground has been disposed.', 0)

    const startedAt = performance.now()
    const elapsed = () => Math.round(performance.now() - startedAt)

    try {
      return toOutcome(await this.send(code, timeoutMs), elapsed())
    } catch (error) {
      if (error instanceof TimeoutSignal) return timeout(timeoutMs, elapsed())
      if (!(error instanceof AbortedError)) return failure('Error', String(error), elapsed())

      try {
        return toOutcome(await this.send(code, timeoutMs), elapsed())
      } catch (retry) {
        if (retry instanceof TimeoutSignal) return timeout(timeoutMs, elapsed())
        return failure('WorkerError', retry instanceof Error ? retry.message : String(retry), elapsed())
      }
    }
  }

  private send(code: string, timeoutMs: number): Promise<RunResponse> {
    const { slot, id, done } = execute(code)

    return new Promise<RunResponse>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        abort(slot, ABORT_REASON, id)
        reject(new TimeoutSignal())
      }, timeoutMs)

      done.then(
        (response) => {
          window.clearTimeout(timer)
          resolve(response)
        },
        (error: AbortedError) => {
          window.clearTimeout(timer)
          reject(error)
        }
      )
    })
  }

  dispose(): void {
    this.disposed = true
  }
}
