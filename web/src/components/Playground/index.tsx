import { useRef, useState } from 'react'
import { useClipboard } from '../../hooks/useClipboard'
import { useRunner } from '../../hooks/useRunner'
import { Editor } from '../Editor'
import { Output } from '../Output'
import { Toolbar } from '../Toolbar'
import styles from './styles.css'

type Props = {
  code: string
  expected?: string
  readOnly?: boolean
  onChange?: (code: string) => void
  compact?: boolean
}

export const Playground = ({ code: source, expected, readOnly = false, onChange, compact = false }: Props) => {
  const baseline = useRef(source).current
  const [own, setOwn] = useState(baseline)
  const { outcome, running, isStale, run } = useRunner()
  const { copied, copy } = useClipboard()

  const controlled = onChange !== undefined
  const code = controlled ? source : own

  const update = (next: string) => {
    if (!controlled) setOwn(next)
    onChange?.(next)
  }

  return (
    <div className={`${styles.playground} ${compact ? styles.compact : ''}`} data-playground="">
      <Toolbar
        fileName={readOnly ? 'example.js' : 'playground.js'}
        edited={code !== baseline}
        executed={isStale(code)}
        running={running}
        copied={copied}
        onRun={() => void run(code)}
        onCopy={() => void copy(code)}
        onReset={
          readOnly
            ? undefined
            : () => {
                update(baseline)
              }
        }
      />

      <Editor code={code} onChange={update} onRun={() => void run(code)} readOnly={readOnly} />

      <Output outcome={outcome} expected={expected} running={running} />
    </div>
  )
}
