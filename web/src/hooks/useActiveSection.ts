import { useEffect, useState } from 'react'

export const useActiveSection = (ids: string[], fallback: string) => {
  const [active, setActive] = useState(fallback)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 }
    )

    for (const element of elements) observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [ids])

  return active
}
