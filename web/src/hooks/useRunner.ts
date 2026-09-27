import { useCallback, useEffect, useRef, useState } from 'react'

import { ReplayRunner, type RunOutcome } from '../playground/runner'

const TIMEOUT_MS = 5000

export const useRunner = () => {
  const [outcome, setOutcome] = useState<RunOutcome | null>(null)
  const [running, setRunning] = useState(false)
  const [lastRun, setLastRun] = useState<string | null>(null)
  const runnerRef = useRef<ReplayRunner | null>(null)
  const busyRef = useRef(false)

  useEffect(() => {
    const runner = new ReplayRunner()
    runnerRef.current = runner
    return () => {
      runner.dispose()
    }
  }, [])

  const run = useCallback(async (code: string) => {
    const runner = runnerRef.current
    if (runner === null || busyRef.current) return

    busyRef.current = true
    setRunning(true)

    try {
      const result = await runner.run(code, TIMEOUT_MS)
      setOutcome(result)
      setLastRun(code)
    } finally {
      busyRef.current = false
      setRunning(false)
    }
  }, [])

  const isStale = useCallback((code: string) => lastRun !== code, [lastRun])

  return { outcome, running, isStale, run }
}
