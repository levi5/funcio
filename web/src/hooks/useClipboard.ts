import { useState } from 'react'

export const useClipboard = () => {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return false
    }

    setCopied(true)
    window.setTimeout(() => {
      setCopied(false)
    }, 1500)
    return true
  }

  return { copied, copy }
}
