import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE_URL = 'https://levi5.github.io/funcio/'

const modules = ['pipe', 'curry', 'match', 'maybe', 'either', 'object', 'array', 'playground']

const urls = [BASE_URL, ...modules.map((m) => `${BASE_URL}#${m}`)]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === BASE_URL ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

const outPath = resolve('dist', 'sitemap.xml')
writeFileSync(outPath, sitemap)
console.log(`Generated sitemap.xml at ${outPath} with ${urls.length} URLs`)
