import type { ModuleDoc } from '../../content'

import { ApiList } from '../ApiList'
import { Example } from '../Example'
import styles from './styles.css'

type Props = {
  module: ModuleDoc
  index: number
  badge?: string
  children?: React.ReactNode
}

export const Section = ({ module, index, badge, children }: Props) => (
  <section className={styles.section} id={module.id}>
    <span className={styles.index}>{badge ?? String(index + 1).padStart(2, '0')}</span>
    <h2 className={styles.title}>{module.title}</h2>
    <p className={styles.tagline}>{module.tagline}</p>

    <div className={styles.main}>
      {module.examples.map((example) => (
        <Example key={example.id} example={example} />
      ))}

      {children}
    </div>

    {module.api.length > 0 && (
      <div className={styles.aside}>
        <ApiList entries={module.api} />
      </div>
    )}
  </section>
)
