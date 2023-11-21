import { io } from 'socket.io-client'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const host = config.public.socketIOUrl

  const socket = io('https://jam-2.fly.dev:3001', {
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
