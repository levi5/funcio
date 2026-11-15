import { tokenize } from '@/components/Editor/highlight'
import type { ImplementationDoc, ImplementationStep } from '@/content/types'
import { useClipboard } from '@/hooks/useClipboard'
import styles from './styles.css'

const REPOSITORY = 'https://github.com/levi5/funcio/blob/master'

const sourceHref = (source: string, startLine?: number, endLine?: number): string => {
  if (startLine === undefined) return `${REPOSITORY}/${source}`
  const range = endLine === undefined || endLine === startLine ? `L${startLine}` : `L${startLine}-L${endLine}`
  return `${REPOSITORY}/${source}#${range}`
}

const fileName = (source: string): string => source.split('/').pop() ?? source

const SourceCode = ({ step, fallbackSource }: { step: ImplementationStep; fallbackSource: string }) => {
  const { copied, copy } = useClipboard()
  const source = step.source ?? fallbackSource
  const label =
    step.startLine === undefined ? fileName(source) : `${fileName(source)} · L${step.startLine}–L${step.endLine}`

  return (
    <div className={styles.block}>
      <div className={styles.codeBar}>
        <a
          className={styles.lines}
          href={sourceHref(source, step.startLine, step.endLine)}
          target="_blank"
          rel="noreferrer"
          title={`Open ${source} on GitHub`}
        >
          {label}
          <span aria-hidden="true"> ↗</span>
        </a>
        <button
          type="button"
          className={styles.copy}
          onClick={() => void copy(step.code)}
          aria-label={`Copy code for ${step.title}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <pre className={styles.code}>
        <code>
          {tokenize(step.code).map((token) => (
            <span key={token.start} className={styles[token.type]}>
              {token.value}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}

export const Implementation = ({ doc, name }: { doc: ImplementationDoc; name: string }) => (
  <details className={styles.implementation}>
    <summary className={styles.toggle}>
      <span className={styles.chevron} aria-hidden="true">
        ▸
      </span>
      View implementation
      <span className={styles.srOnly}>: {name}</span>
      <span className={styles.count}>
        {doc.steps.length} {doc.steps.length === 1 ? 'step' : 'steps'}
      </span>
    </summary>

    <div className={styles.content}>
      <p className={styles.source}>
        Actual library source:{' '}
        <a href={sourceHref(doc.source)} target="_blank" rel="noreferrer" title={`Open ${doc.source} on GitHub`}>
          {doc.source} ↗
        </a>
      </p>

      <ul className={styles.techniques} aria-label="Techniques used">
        {doc.techniques.map((technique) => (
          <li key={technique}>{technique}</li>
        ))}
      </ul>

      <ol className={styles.steps}>
        {doc.steps.map((step) => (
          <li key={step.title}>
            <h4>{step.title}</h4>
            <SourceCode step={step} fallbackSource={doc.source} />
            <p>{step.explanation}</p>
          </li>
        ))}
      </ol>

      <h4>Decisions &amp; limitations</h4>
      <p>{doc.tradeoffs}</p>
    </div>
  </details>
)
