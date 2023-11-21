import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { TItem, TRoom } from '~/types'

export const useConnectionStore = defineStore('connection', () => {
  const { $io } = useNuxtApp()

  const currentRoom = ref<TRoom>()
  const name = useStorage('name', 'Anonymous')

  const messages = ref<string[]>([])

  const joinRoom = (room: string) => {
    console.log('joinRoom', room)
    $io.emit('joinRoom', { room, user: { name: name.value } })
  }

  const leaveRoom = (room: string) => {
    $io.emit('leaveRoom', room)
    currentRoom.value = undefined
  }

  const sendMessage = (message: string | object) => {
    $io.emit('message', currentRoom.value?.id, message)
  }

  const setName = (newName: string) => {
    $io.emit('setName', name)
    name.value = newName
  }

  const sendItemChange = (item: TItem) => {
    $io.emit('itemChange', currentRoom.value?.id, item)
  }

  const onMessage = (message: string) => {
    messages.value.push(message)
  }

  onMounted(() => {
    $io.on('message', message => onMessage(message))

    $io.on('joinedRoom', (room) => {
      currentRoom.value = room
    })

    $io.on('changedItem', (data) => {
      if (currentRoom.value && currentRoom.value.id === data.room) {
        const index = currentRoom.value.items.findIndex(t => t.id === data.item.id)
        const item = currentRoom.value.items[index]
        item.x = data.item.x
        item.y = data.item.y
        item.content = data.item.content
        currentRoom.value.items.splice(index, 1, item)
      }
    })
  })

  return {
    currentRoom,
    name,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendItemChange,
    setName
  }
})
