import type { RunRequest, RunResponse } from './replay.worker'

export class AbortedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AbortedError'
  }
}

export type Slot = {
  worker: Worker | null
  waiters: Map<number, Waiter>
}

type Waiter = {
  resolve: (response: RunResponse) => void
  reject: (error: AbortedError) => void
}

const SLOTS = 4

let seq = 0
const slots: Slot[] = Array.from({ length: SLOTS }, () => ({ worker: null, waiters: new Map() }))

const spawn = (slot: Slot): Worker => {
  const worker = new Worker(new URL('./replay.worker.ts', import.meta.url), { type: 'module' })

  worker.addEventListener('message', (event: MessageEvent<RunResponse>) => {
    const waiter = slot.waiters.get(event.data.id)
    if (waiter === undefined) return

    slot.waiters.delete(event.data.id)
    waiter.resolve(event.data)
  })

  worker.addEventListener('error', () => {
    abort(slot, 'The playground worker crashed while loading the library.')
  })

  return worker
}

const leastLoaded = (): Slot => slots.reduce((a, b) => (a.waiters.size <= b.waiters.size ? a : b))

export const execute = (code: string): { slot: Slot; id: number; done: Promise<RunResponse> } => {
  const id = ++seq
  const slot = leastLoaded()

  const done = new Promise<RunResponse>((resolve, reject) => {
    slot.waiters.set(id, { resolve, reject })
    slot.worker ??= spawn(slot)
    slot.worker.postMessage({ id, code } satisfies RunRequest)
  })

  return { slot, id, done }
}

export const abort = (slot: Slot, reason: string, keep?: number): void => {
  slot.worker?.terminate()
  slot.worker = null

  for (const [id, waiter] of slot.waiters) {
    if (id === keep) continue
    slot.waiters.delete(id)
    waiter.reject(new AbortedError(reason))
  }
}
