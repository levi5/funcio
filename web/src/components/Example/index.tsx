import type { Example as ExampleDoc } from '../../content'

import { Playground } from '../Playground'
import styles from './styles.css'

export const Example = ({ example }: { example: ExampleDoc }) => (
  <article className={styles.example}>
    <div className={styles.header}>
      <h3 className={styles.title}>{example.title}</h3>
      <p className={styles.description}>{example.description}</p>
    </div>

    <Playground code={example.code} expected={example.expected} />
  </article>
)
