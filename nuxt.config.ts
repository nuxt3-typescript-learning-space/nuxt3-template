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
    '@nuxtjs/color-mode',
  ],
  runtimeConfig: {
    public: {
      NUXT_ENV: process.env.NUXT_ENV,
      GTM_ID: process.env.GTM_ID,
      API_URL: process.env.API_URL,
    },
  },
  shadcn: {
    prefix: '',
    componentDir: './src/components/ui/',
  },
  pinia: {
    storesDirs: ['./src/store'],
  },
  compatibilityDate: '2025-02-15',
});
