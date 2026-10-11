import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
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
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      external: ['funcio'],
      output: {
        globals: {
          funcio: 'Funcio'
        }
      }
    }
  },
  worker: {
    format: 'es',
    rollupOptions: {
      external: ['funcio'],
      output: {
        globals: {
          funcio: 'Funcio'
        }
      }
    }
  }
})
