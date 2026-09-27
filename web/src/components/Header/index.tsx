import { useEffect, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

import { Button } from '../Button'
import { Logo } from '../Logo'
import styles from './styles.css'

const LINKS = ['pipe', 'curry', 'match', 'maybe', 'either', 'object', 'array', 'playground']

export const Header = () => {
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top">
          <Logo size={24} />
          <span>Funcio</span>
          <span className={styles.version}>0.0.32</span>
        </a>

        <nav className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="Sections">
          {LINKS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => {
                setOpen(false)
              }}
            >
              {id}
            </a>
          ))}
        </nav>

        <div className={styles.tools}>
          <Button variant="icon" onClick={toggle} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? '☀' : '☾'}
          </Button>
          <Button variant="ghost" href="https://www.npmjs.com/package/funcio" target="_blank">
            npm
          </Button>
          <Button variant="primary" href="https://github.com/levi5/funcio" target="_blank">
            GitHub
          </Button>
          <Button
            variant="icon"
            className={styles.burger}
            onClick={() => {
              setOpen(!open)
            }}
            title="Toggle navigation"
          >
            {open ? '✕' : '☰'}
          </Button>
        </div>
      </div>
    </header>
  )
}
