import type { RunOutcome } from '../../playground/runner'
import styles from './styles.css'

type Props = {
  outcome: RunOutcome | null
  expected?: string
  running: boolean
}

export const Output = ({ outcome, expected, running }: Props) => {
  if (running) return <Running />

  if (outcome === null) return <Idle expected={expected} />

  if (outcome.status !== 'ok') return <Failure outcome={outcome} />

  return <Success outcome={outcome} />
}

const Running = () => (
  <div className={`${styles.output} ${styles.pending}`} data-state="pending">
    <span className={styles.spinner} aria-hidden="true" />
    running…
  </div>
)

const Idle = ({ expected }: { expected?: string }) => (
  <div className={`${styles.output} ${styles.empty}`} data-state="empty">
    {expected ? (
      <>
        <span className={styles.hintLabel}>expected</span>
        <code className={styles.expected}>{expected}</code>
      </>
    ) : (
      <span className={styles.hintLabel}>Press Run to see the result</span>
    )}
  </div>
)

const Failure = ({ outcome }: { outcome: RunOutcome }) => {
  const timedOut = outcome.status === 'timeout'
  const where = outcome.error?.isSyntaxError === true ? outcome.error.line : undefined

  return (
    <div className={`${styles.output} ${styles.failed}`} data-state="error" role="alert">
      <div className={styles.line}>
        <span className={`${styles.badge} ${timedOut ? styles.warn : ''}`}>
          {timedOut ? 'timeout' : (outcome.error?.name ?? 'error')}
        </span>
        {where !== undefined && (
          <span className={styles.where}>
            line {where}
            {outcome.error?.column !== undefined ? `:${outcome.error.column}` : ''}
          </span>
        )}
      </div>

      <pre className={styles.message}>{outcome.error?.message}</pre>

      {timedOut && <p className={styles.note}>Nothing can interrupt a synchronous loop from the outside.</p>}
    </div>
  )
}

const Success = ({ outcome }: { outcome: RunOutcome }) => {
  if (outcome.logs.length === 0 && outcome.value === null) {
    return (
      <div className={`${styles.output} ${styles.empty}`} data-state="empty">
        <span className={styles.hintLabel}>ran in {outcome.durationMs}ms — no output</span>
      </div>
    )
  }

  return (
    <div className={`${styles.output} ${styles.succeeded}`} data-state="ok">
      {outcome.logs.map((log, index) => (
        <div key={index} className={log.level === 'log' ? styles.line : `${styles.line} ${styles[log.level]}`}>
          {log.level !== 'log' && <span className={`${styles.badge} ${styles.muted}`}>{log.level}</span>}
          <code>{log.text}</code>
        </div>
      ))}

      {outcome.value !== null && (
        <div className={`${styles.line} ${styles.result}`}>
          <span className={styles.caret}>›</span>
          <code>{outcome.value}</code>
        </div>
      )}

      <div className={styles.meta}>ran in {outcome.durationMs}ms</div>
    </div>
  )
}
