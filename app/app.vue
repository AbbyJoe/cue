<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>

<script setup lang="ts">
// Imported directly so the toaster never depends on component auto-registration.
import Toaster from '~/components/ui/Toaster.vue'

// Site-wide defaults for search engines and link previews.
// Pages override what they need with usePageSeo(); private pages add noindex in their layout.
const { siteUrl } = useRuntimeConfig().public
const route = useRoute()
const pageUrl = computed(() => new URL(route.path, siteUrl).href)
const shareImage = new URL('/og-image.jpg', siteUrl).href

useHead({
  titleTemplate: (title) => (title ? `${title} · Cue` : 'Cue · Rehearse interviews with an AI coach'),
  link: [{ rel: 'canonical', href: pageUrl }],
})

useSeoMeta({
  description: 'Rehearse interviews with an AI interviewer that listens and follows up, then get evidence-based feedback on every answer.',
  ogType: 'website',
  ogSiteName: 'Cue',
  ogLocale: 'en_GB',
  ogUrl: pageUrl,
  ogTitle: 'Cue · Rehearse interviews with an AI coach',
  ogDescription: 'Rehearse with an AI interviewer that listens, follows up and shows you exactly where your answers land.',
  ogImage: shareImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/jpeg',
  ogImageAlt: 'Cue: Rehearse the interview before it counts.',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Cue · Rehearse interviews with an AI coach',
  twitterDescription: 'Rehearse with an AI interviewer that listens, follows up and shows you exactly where your answers land.',
  twitterImage: shareImage,
  twitterImageAlt: 'Cue: Rehearse the interview before it counts.',
})
</script>
