// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: 'src/',
  ssr: true,
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@nuxt/test-utils/module',
    '@zadigetvoltaire/nuxt-gtm',
  ],
  shadcn: {
    prefix: '',
    componentDir: './src/components/ui/',
  },
  runtimeConfig: {
    public: {
      gtm: {
        id: process.env.NUXT_PUBLIC_GTM_ID || '',
      },
    },
  },
  pinia: {
    storesDirs: ['./src/store'],
  },
  compatibilityDate: '2024-07-04',
});
