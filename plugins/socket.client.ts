import { io } from 'socket.io-client'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const host = config.public.nodeEnv === 'development' ? 'http://localhost' : 'https://jam-2.fly.dev'

  const socket = io(`${host}:3001`, {
    autoConnect: true,
    transports: ['websocket'],
    reconnection: true
  })

  return {
    provide: {
      io: socket
    }
  }
})
