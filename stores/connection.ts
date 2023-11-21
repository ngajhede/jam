import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connection', () => {
  const { $io } = useNuxtApp()

  type TItem = {
    id: string
    type: 'Stickynote',
    content: string
    x: number
    y: number
  }

  const currentRoom = ref<{
    id: string
    name: string
    items: TItem[]
    users: string[]
  }>()
  const name = ref<string>()

  const messages = ref<string[]>([])

  const joinRoom = (room: string) => {
    $io.emit('joinRoom', room)
    console.log('currentRoom', currentRoom.value)
  }

  const leaveRoom = (room: string) => {
    $io.emit('leaveRoom', room)
    currentRoom.value = undefined
  }

  const sendMessage = (message: string | object) => {
    $io.emit('message', currentRoom.value?.id, message)
  }

  const sendItemChange = (item: TItem) => {
    $io.emit('itemChange', currentRoom.value?.id, item)
  }

  const onMessage = (message: string) => {
    console.log('onMessage', message)
    messages.value.push(message)
  }

  onMounted(() => {
    joinRoom('room1')

    $io.on('message', message => onMessage(message))

    $io.on('joinedRoom', (room) => {
      console.log('joined', room)
      currentRoom.value = room
    })

    $io.on('changedItem', (data) => {
      if (currentRoom.value?.id === data.room) {
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
    sendItemChange
  }
})
