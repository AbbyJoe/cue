export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@nuxtjs/tailwindcss'],
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  build: {
    transpile: ['vue-iconsax'],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      // Page titles, descriptions and share tags are set in app.vue and on each page.
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [
        { name: 'theme-color', content: '#F7F7F8' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },
  runtimeConfig: {
    supabaseSecretKey: process.env.NUXT_SUPABASE_SECRET_KEY,
    xaiBaseUrl: process.env.NUXT_XAI_BASE_URL,
    xaiApiKey: process.env.NUXT_XAI_AUTH_KEY,
    xaiModel: process.env.NUXT_XAI_MODEL,
    xaiMaxTokens: process.env.NUXT_XAI_MAX_TOKENS,
    elevenlabsApiKey: process.env.NUXT_ELEVENLABS_API_KEY,
    elevenlabsAgentId: process.env.NUXT_ELEVENLABS_AGENT_ID,
    elevenlabsWebhookSecret: process.env.NUXT_ELEVENLABS_WEBHOOK_SECRET,
    public: {
      // Full address of the live site, used for share images, canonical links and the sitemap.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabasePublishableKey: process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
  },
})
