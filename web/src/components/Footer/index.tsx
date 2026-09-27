import { Logo } from '../Logo'
import styles from './styles.css'

const LINKS = [
  ['Repository', 'https://github.com/levi5/funcio'],
  ['npm', 'https://www.npmjs.com/package/funcio'],
  ['README', 'https://github.com/levi5/funcio/blob/master/README.md'],
  ['Issues', 'https://github.com/levi5/funcio/issues']
]

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div>
        <p className={styles.brand}>
          <Logo size={22} />
          Funcio
        </p>
        <p className={styles.note}>Functional programming for the JavaScript and TypeScript ecosystem. MIT licensed.</p>
      </div>

      <div className={styles.links}>
        {LINKS.map(([label, href]) => (
          <a key={href} href={href} target="_blank" rel="noreferrer">
            {label}
          </a>
        ))}
      </div>
    </div>
  </footer>
)
