// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s - Arch UI',
    },
  },
  css: ['@fortawesome/fontawesome-free/css/all.css'],
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
  },
  modules: [
    '@pinia/nuxt',
  ],
  plugins: [
    { src: '~/plugins/acl' },
    { src: '~/plugins/axios' },
    { src: '~/plugins/buefy' },
  ],
})
