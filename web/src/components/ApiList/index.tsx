import type { ApiEntry } from '../../content'
import styles from './styles.css'

export const ApiList = ({ entries }: { entries: ApiEntry[] }) => (
  <div className={styles.api}>
    <h3 className={styles.title}>API</h3>

    <ul className={styles.list}>
      {entries.map((entry) => (
        <li key={entry.name} className={styles.item}>
          <code className={styles.name}>{entry.name}</code>
          {entry.signature !== undefined && <code className={styles.signature}>{entry.signature}</code>}
          <p className={styles.description}>{entry.description}</p>
        </li>
      ))}
    </ul>
  </div>
)
