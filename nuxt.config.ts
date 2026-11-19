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
      title: 'Cue',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      meta: [
        {
          name: 'description',
          content: 'Practise interviews with AI and get better at showing what you know.',
        },
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
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabasePublishableKey: process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
  },
})
