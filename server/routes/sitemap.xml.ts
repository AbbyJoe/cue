/** GET /sitemap.xml: the public pages worth indexing. */
const pages = [
  { path: '/', priority: '1.0' },
  { path: '/auth/signup', priority: '0.6' },
  { path: '/auth/login', priority: '0.4' },
]

export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const urls = pages
    .map((page) => `  <url><loc>${new URL(page.path, siteUrl).href}</loc><priority>${page.priority}</priority></url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
