import { useEffect, useState } from 'react'

const STORAGE_KEY = 'funcio-theme'

export type Theme = 'dark' | 'light'

const read = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(read)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  const toggle = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggle }
}
