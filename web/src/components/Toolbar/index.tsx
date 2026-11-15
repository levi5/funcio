import { Button } from '@/components/Button'
import styles from './styles.css'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
const SHORTCUT = isMac ? '⌘↵' : 'Ctrl↵'

type Props = {
  fileName: string
  edited: boolean
  executed: boolean
  onRun: () => void
  onCopy: () => void
  onReset?: () => void
  running: boolean
  copied: boolean
}

export const Toolbar = ({ fileName, edited, executed, onRun, onCopy, onReset, running, copied }: Props) => (
  <div className={styles.bar}>
    <span className={styles.file}>
      {fileName}
      {edited && <span className={styles.dirty}>edited</span>}
    </span>

    <div className={styles.actions}>
      {onReset !== undefined && (
        <Button variant="ghost" onClick={onReset} disabled={!edited}>
          Reset
        </Button>
      )}

      <Button variant="ghost" onClick={onCopy}>
        {copied ? 'Copied' : 'Copy'}
      </Button>

      <Button
        variant="run"
        onClick={onRun}
        disabled={running || !executed}
        title={executed ? 'Run this snippet' : 'Already run — edit the code to run it again'}
        testId="run"
      >
        {running ? 'Running…' : 'Run'}
        <kbd>{SHORTCUT}</kbd>
      </Button>
    </div>
  </div>
)
