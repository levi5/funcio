import { useEffect } from 'react'
import { DEFAULT_META, MODULE_META } from '../hooks/usePageMeta'

type Props = {
  activeSection: string
}

export const PageMeta = ({ activeSection }: Props) => {
  const meta = MODULE_META[activeSection] ?? DEFAULT_META

  useEffect(() => {
    const url = `https://github.com/levi5/funcio#${activeSection}`
    document.title = meta.title

    const updateMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!el) {
        el = document.createElement('meta')
        el.name = name
        document.head.appendChild(el)
      }
      el.content = content
    }

    const updateProperty = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      el.content = content
    }

    updateMeta('description', meta.description)
    updateProperty('og:title', meta.title)
    updateProperty('og:description', meta.description)
    updateProperty('og:url', url)
    updateProperty('twitter:title', meta.title)
    updateProperty('twitter:description', meta.description)

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (canonical) canonical.href = url
  }, [activeSection, meta])

  return null
}
