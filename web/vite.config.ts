import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))
const readVersion = (): string =>
  (JSON.parse(readFileSync(resolve(root, '../package.json'), 'utf8')) as { version: string }).version

const cssModule = (): Plugin => ({
  name: 'funcio:css-module',
  enforce: 'pre',
  resolveId(source, importer) {
    if (!source.endsWith('styles.css')) return null

    const target = resolve(importer ? dirname(importer) : process.cwd(), source)
    if (!existsSync(target)) return null

    return `${target}?styles.module.css`
  }
})

export default defineConfig({
  base: process.env.BASE_PATH ?? '/funcio/',
  plugins: [
    cssModule(),
    react(),
    {
      name: 'funcio:version',
      transformIndexHtml: (html) => html.replaceAll('%FUNCIO_VERSION%', readVersion())
    }
  ],
  resolve: {
    alias: {
      '@': resolve(root, 'src'),
      '@funcio': resolve(root, '../src'),
      funcio: resolve(root, '../src/main.ts')
    }
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: true,
    emptyOutDir: true
  },
  worker: {
    format: 'es'
  }
})
