import { useState } from 'react'

import styles from './styles.css'

const COMMANDS = ['npm install funcio', 'yarn add funcio', 'pnpm add funcio']

export const Install = () => {
  const [command, setCommand] = useState(COMMANDS[0])
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {}
  }

  return (
    <div className={styles.install}>
      <div className={styles.tabs} role="tablist" aria-label="Package manager">
        {COMMANDS.map((entry) => (
          <button
            key={entry}
            type="button"
            role="tab"
            aria-selected={command === entry}
            className={`${styles.tab} ${command === entry ? styles.active : ''}`}
            onClick={() => {
              setCommand(entry)
            }}
          >
            {entry.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className={styles.bar}>
        <code className={styles.command}>
          <span className={styles.prompt}>$</span>
          {command}
        </code>
        <button type="button" className={styles.copy} onClick={() => void copy()}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
