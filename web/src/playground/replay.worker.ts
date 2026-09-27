import { execute } from './execute'
import { type LogEntry, type SerializedError, serializeError } from './format'
import { libScope } from './lib-scope'

export interface RunRequest {
  id: number
  code: string
}

export type RunResponse =
  | { id: number; ok: true; logs: LogEntry[]; value: string | null }
  | { id: number; ok: false; logs: LogEntry[]; error: SerializedError }

self.addEventListener('message', (event: MessageEvent<RunRequest>) => {
  const request = event.data
  if (!request || typeof request.id !== 'number') return

  void execute(request.code, libScope).then(
    (result) => {
      const response: RunResponse = result.ok
        ? { id: request.id, ok: true, logs: result.logs, value: result.value }
        : {
            id: request.id,
            ok: false,
            logs: result.logs,
            error: result.error ?? serializeError(new Error('Unknown failure'))
          }

      self.postMessage(response)
    },
    (error) => {
      self.postMessage({ id: request.id, ok: false, logs: [], error: serializeError(error) } satisfies RunResponse)
    }
  )
})
