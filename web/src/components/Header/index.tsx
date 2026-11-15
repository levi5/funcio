import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import { modules } from '@/content'
import { useTheme } from '@/hooks/useTheme'
import { VERSION } from '@/version'
import styles from './styles.css'

const LABELS: Record<string, string> = { 'async-validation': 'validation' }

const LINKS = [
  ...modules.map((module) => ({ id: module.id, label: LABELS[module.id] ?? module.id })),
  { id: 'playground', label: 'playground' }
]

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

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top">
          <Logo size={24} />
          <span>Funcio</span>
          <span className={styles.version}>{VERSION}</span>
        </a>

        <nav id="site-nav" className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="Sections">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => {
                setOpen(false)
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.tools}>
          <Button
            variant="icon"
            onClick={toggle}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            ariaLabel={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
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
            ariaLabel="Toggle navigation"
            ariaExpanded={open}
            ariaControls="site-nav"
          >
            {open ? '✕' : '☰'}
          </Button>
        </div>
      </div>
    </header>
  )
}
