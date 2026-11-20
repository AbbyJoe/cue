/**
 * Title, description and link-preview text for one page.
 *   usePageSeo({ title: 'Log in', description: '…' })
 * Pass `index: false` for pages search engines should skip.
 * The share image and site name come from the defaults in app.vue.
 */
export function usePageSeo(page: { title: string, description?: string, index?: boolean }) {
  const shareTitle = `${page.title} · Cue`

  useSeoMeta({
    title: page.title,
    ogTitle: shareTitle,
    twitterTitle: shareTitle,
    ...(page.description && {
      description: page.description,
      ogDescription: page.description,
      twitterDescription: page.description,
    }),
    ...(page.index === false && { robots: 'noindex, nofollow' }),
  })
}
