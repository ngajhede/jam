import { Server } from 'socket.io'
import type { TRoom, TUser } from '~/types'
import { Stickynote } from '~/utils/items'
const io = new Server(3001, {
  cors: {
    origin: '*'
  }
})

const rooms: TRoom[] = []
const users: TUser[] = []

io.on('connection', (socket) => {
  console.log('Connection', socket.id)
})

io.on('connect', (socket) => {
  socket.emit('message', `welcome ${socket.id}`)
  socket.broadcast.emit('message', `${socket.id} joined`)

  socket.on('joinRoom', (data) => {
    console.log('joinRoom', data)
    socket.join(data.room)
    io.to(data.room).emit('join', {
      from_id: socket.id,
      system: true,
      content: `${socket.id} joined the jam session`
    })

    const room = rooms.find(t => t.id === data.room)
    if (room) {
      room.users.push({ name: data.user.name, id: socket.id })
    } else {
      rooms.push({
        id: data.room,
        name: data.room,
        items: [],
        users: [{ name: data.user.name, id: socket.id }]
      })
    }

    socket.emit('joinedRoom', room)
    io.to(data.room).emit('updateRoom', room)
  })

  socket.on('leaveRoom', (room) => {
    if (room) {
      socket.leave(room.id)
      room.users = room.users.filter(t => t.id !== socket.id)
      io.to(room.id).emit('updateRoom', room)
    }

    socket.broadcast.emit('message', `${socket.id} left`)
  })

  socket.on('message', function (room, message) {
    console.log(`[Socket.io] message received in ${room}: ${message}`)
    const board = rooms.find(t => t.id === room)
    if (board) {
      io.to(room).emit('message', message)
      // Write to DB
    }
  })

  socket.on('addItem', function (room, item) {
    console.log(`[Socket.io] add item in ${room}: ${item}`)
    const board = rooms.find(t => t.id === room)
    if (board) {
      const newItem = {
        ...Stickynote,
        id: Math.random().toString(36).substr(2, 9)
      }
      board.items.push(newItem)
      io.to(room).emit('itemAdded', newItem)
      // Write to DB
    }
  })

  socket.on('removeItem', function (room, item) {
    console.log(`[Socket.io] remove item in ${room}: ${item}`)
    const board = rooms.find(t => t.id === room)
    if (board) {
      const index = board.items.findIndex(t => t.id === item.id)
      board.items.splice(index, 1)
      io.to(room).emit('itemRemoved', item)
      // Write to DB
    }
  })

  socket.on('itemChange', function (room, item) {
    const board = rooms.find(t => t.id === room)
    if (board) {
      const index = board.items.findIndex(t => t.id === item.id)
      board.items[index] = item
      socket.broadcast.to(room).emit('changedItem', { room, item })
    }
  })

  socket.on('setName', (name) => {
    console.log('setName', name)
    const user = users.find(t => t.id === socket.id)
    if (user) {
      user.name = name
    } else {
      users.push({ id: socket.id, name })
    }

    socket.broadcast.emit('message', `${socket.id} is now known as ${name}`)
  })

  socket.on('disconnecting', () => {
    console.log('disconnected', socket.id)
    const room = rooms.find(t => t.users.find(u => u.id === socket.id))
    if (room) {
      socket.leave(room.id)
      room.users = room.users.filter(t => t.id !== socket.id)
      io.to(room.id).emit('updateRoom', room)
    }

    socket.broadcast.emit('message', `${socket.id} left`)
  })
})

export default function (req, res, next) {
  res.statusCode = 200
  res.end()
}
