import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const cssModule = (): Plugin => ({
  name: 'funcio:css-module',
  enforce: 'pre',
  resolveId (source, importer) {
    if (!source.endsWith('styles.css')) return null

    const target = resolve(importer ? dirname(importer) : process.cwd(), source)
    if (!existsSync(target)) return null

    return `${target}?styles.module.css`
  }
})

export default defineConfig({
  base: process.env.BASE_PATH ?? '/funcio/',
  plugins: [cssModule(), react()],
  resolve: {
    alias: {
      funcio: fileURLToPath(new URL('../src/main.ts', import.meta.url))
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
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
