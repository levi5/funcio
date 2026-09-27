import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'

import { tokenize } from './highlight'
import styles from './styles.css'

type Props = {
  code: string
  onChange: (code: string) => void
  onRun: () => void
  readOnly?: boolean
}

export const Editor = ({ code, onChange, onRun, readOnly = false }: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)

  const tokens = useMemo(() => tokenize(code), [code])
  const lineNumbers = useMemo(() => code.split('\n').length, [code])

  const syncScroll = useCallback(() => {
    const input = inputRef.current
    const highlight = highlightRef.current
    if (input === null || highlight === null) return

    highlight.scrollTop = input.scrollTop
    highlight.scrollLeft = input.scrollLeft
  }, [])

  useLayoutEffect(syncScroll)

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      const { selectionStart, selectionEnd } = event.currentTarget
      onChange(`${code.slice(0, selectionStart)}  ${code.slice(selectionEnd)}`)
      requestAnimationFrame(() => {
        if (inputRef.current) inputRef.current.selectionStart = inputRef.current.selectionEnd = selectionStart + 2
      })
      return
    }

    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      onRun()
    }
  }

  return (
    <div className={styles.editor}>
      <div className={styles.gutter} aria-hidden="true">
        {Array.from({ length: lineNumbers }, (_, index) => (
          <span key={index}>{index + 1}</span>
        ))}
      </div>

      <div className={styles.surface}>
        <pre className={styles.highlight} ref={highlightRef} aria-hidden="true">
          <code>
            {tokens.map((token, index) => (
              <span key={index} className={styles[token.type]}>
                {token.value}
              </span>
            ))}
            {'\n'}
          </code>
        </pre>

        <textarea
          ref={inputRef}
          className={styles.input}
          value={code}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          onKeyDown={onKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          readOnly={readOnly}
          aria-label="Runnable example"
          data-editor=""
        />
      </div>
    </div>
  )
}
