import type { ModuleDoc } from '../../content'
import styles from './styles.css'

type Props = {
  modules: ModuleDoc[]
  active: string
}

export const Sidebar = ({ modules, active }: Props) => (
  <nav className={styles.sidebar} aria-label="API sections">
    <p className={styles.title}>Modules</p>

    <ul className={styles.list}>
      {modules.map((module) => (
        <li key={module.id}>
          <a href={`#${module.id}`} className={link(module.id, active)}>
            {module.title}
          </a>
        </li>
      ))}
    </ul>

    <p className={`${styles.title} ${styles.spaced}`}>Try it</p>

    <ul className={styles.list}>
      <li>
        <a href="#playground" className={link('playground', active)}>
          Playground
        </a>
      </li>
    </ul>
  </nav>
)

const link = (id: string, active: string) => (id === active ? `${styles.link} ${styles.active}` : styles.link)
