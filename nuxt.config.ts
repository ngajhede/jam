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
  auth: {
    origin: 'http://localhost:3000'
  },
  build: {
    transpile: [
      'trpc-nuxt'
    ]
  },
  typescript: {
    shim: false
  },
  serverHandlers: [
    {
      route: '/ws',
      handler: '~/socket/handler'
    }
  ]
})
