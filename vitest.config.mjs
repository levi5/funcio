import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: { '@funcio': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  test: {
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/@Types/**'],
      reporter: ['text', 'html', 'json-summary']
    }
  }
})
