import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**, **/lib/**, **/dist/**, **/cypress/**"],
    watchExclude: [" **/node_modules/**, **/dist/**, **/lib/** ,**/build/**"],
    include: ["test/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
})
