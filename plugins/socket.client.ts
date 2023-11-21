import { io } from 'socket.io-client'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const host = config.public.socketIOUrl

  const socket = io(host)

  return {
    provide: {
      io: socket
    }
  }
})
