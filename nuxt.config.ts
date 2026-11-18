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
    supabaseServiceRoleKey: '',
    xaiApiKey: '',
    xaiModel: '',
    elevenlabsApiKey: '',
    elevenlabsAgentId: '',
    elevenlabsWebhookSecret: '',
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
  },
})
