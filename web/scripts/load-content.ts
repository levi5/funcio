import { createServer } from 'vite'

export async function loadContent(): Promise<typeof import('@/content')> {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, watch: null } })
  try {
    return (await server.ssrLoadModule('/src/content/index.ts')) as typeof import('@/content')
  } finally {
    await server.close()
  }
}
