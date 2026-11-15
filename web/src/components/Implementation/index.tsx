import { tokenize } from '@/components/Editor/highlight'
import type { ImplementationDoc } from '@/content/types'
import styles from './styles.css'

const SourceCode = ({ code }: { code: string }) => (
  <pre className={styles.code}>
    <code>
      {tokenize(code).map((token) => (
        <span key={token.start} className={styles[token.type]}>
          {token.value}
        </span>
      ))}
    </code>
  </pre>
)

export const Implementation = ({ doc, name }: { doc: ImplementationDoc; name: string }) => (
  <details className={styles.implementation}>
    <summary className={styles.toggle}>
      How it works<span className={styles.srOnly}>: {name}</span>
    </summary>
    <div className={styles.content}>
      <p className={styles.source}>
        Actual library source: <code>{doc.source}</code>
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
            <SourceCode code={step.code} />
            <p>{step.explanation}</p>
          </li>
        ))}
      </ol>
      <h4>Decisions & limitations</h4>
      <p>{doc.tradeoffs}</p>
    </div>
  </details>
)
