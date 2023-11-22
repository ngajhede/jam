import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { TItem, TRoom } from '~/types'

export const useConnectionStore = defineStore('connection', () => {
  const { $io } = useNuxtApp()

  const currentRoom = ref<TRoom>()
  const name = useStorage('name', 'Anonymous')

  const messages = ref<string[]>([])

  const joinRoom = (room: string) => {
    $io.emit('joinRoom', { room, user: { name: name.value } })
  }

  const leaveRoom = () => {
    $io.emit('leaveRoom', currentRoom.value?.id)
    currentRoom.value = undefined
  }

  const sendMessage = (message: string | object) => {
    $io.emit('message', currentRoom.value?.id, message)
  }

  const setName = (newName: string) => {
    $io.emit('setName', name)
    name.value = newName
  }

  const addItem = (item: TItem['type']) => {
    $io.emit('addItem', currentRoom.value?.id, item)
  }

  const removeItem = (item: TItem) => {
    $io.emit('removeItem', currentRoom.value?.id, item)
  }

  const sendItemChange = (item: TItem) => {
    $io.emit('itemChange', currentRoom.value?.id, item)
    updateLocalItem(item)
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
        item.width = data.item.width
        item.height = data.item.height
        item.content = data.item.content
      }
    })

    $io.on('itemAdded', (item) => {
      console.log(item)
      if (currentRoom.value) {
        currentRoom.value.items.push(item)
      }
    })

    $io.on('itemRemoved', (item) => {
      if (currentRoom.value) {
        const index = currentRoom.value.items.findIndex(t => t.id === item.id)
        currentRoom.value.items.splice(index, 1)
      }
    })

    $io.on('updateRoom', (room) => {
      if (currentRoom.value && currentRoom.value.id === room.id) {
        currentRoom.value = room
      }
    })
  })

  const updateLocalItem = (item: TItem) => {
    if (currentRoom.value) {
      const index = currentRoom.value.items.findIndex(t => t.id === item.id)
      currentRoom.value.items[index] = item
    }
  }
  return {
    currentRoom,
    name,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendItemChange,
    setName,
    addItem,
    removeItem,
    updateLocalItem
  }
})
