import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

async function getLatestVersion(): Promise<string> {
  const response = await fetch('https://registry.npmjs.org/funcio/latest')
  if (!response.ok) {
    throw new Error(`Failed to fetch latest version: ${response.status}`)
  }
  const data = await response.json()
  return data.version
}

async function updateIndexHtml(version: string): Promise<void> {
  const indexPath = resolve('dist', 'index.html')
  let html = readFileSync(indexPath, 'utf-8')

  const importmapRegex = /"funcio":\s*"https:\/\/cdn\.jsdelivr\.net\/npm\/funcio@[^"]+"/
  const newImport = `"funcio": "https://cdn.jsdelivr.net/npm/funcio@${version}/lib/esm/main.js"`

  if (importmapRegex.test(html)) {
    html = html.replace(importmapRegex, newImport)
  } else {
    const fallbackRegex = /("imports":\s*\{[^}]*?)("funcio":\s*"[^"]*")/
    html = html.replace(fallbackRegex, `$1${newImport}`)
  }

  writeFileSync(indexPath, html)
  console.log(`Updated importmap to funcio@${version}`)
}

async function main(): Promise<void> {
  try {
    const version = await getLatestVersion()
    await updateIndexHtml(version)
  } catch (error) {
    console.error('Failed to update version:', error)
    process.exit(1)
  }
}

main()
