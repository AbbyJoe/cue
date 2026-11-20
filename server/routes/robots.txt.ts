/** GET /robots.txt: let search engines see the public pages only. */
export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /dashboard',
    'Disallow: /interview',
    'Disallow: /api/',
    'Disallow: /auth/callback',
    'Disallow: /auth/forgot-password',
    'Disallow: /auth/update-password',
    '',
    `Sitemap: ${new URL('/sitemap.xml', siteUrl).href}`,
    '',
  ].join('\n')
})
