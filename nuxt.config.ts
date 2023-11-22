// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: [
    '~/assets/main.scss'
  ],
  build: {
    transpile: [
      'trpc-nuxt'
    ]
  },
  auth: {
    origin: process.env.AUTH_ORIGIN
  },
  typescript: {
    shim: false
  },
  runtimeConfig: {
    public: {
      socketIOUrl: process.env.SOCKET_IO_URL,
      nodeEnv: process.env.NODE_ENV
    }
  }
})
