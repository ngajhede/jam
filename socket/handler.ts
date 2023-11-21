import { Server } from 'socket.io'
import type { TRoom, TUser } from '~/types'

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

    const board = rooms.find(t => t.id === data.room)
    if (board) {
      board.users.push({ name: data.user.name, id: socket.id })
    } else {
      rooms.push({
        id: data.room,
        name: data.room,
        items: [],
        users: [{ name: data.user.name, id: socket.id }]
      })
    }

    socket.emit('joinedRoom', board)
  })

  socket.on('leaveRoom', (room) => {
    socket.leave(room)
    io.to(room).emit('leave', {
      from_id: socket.id,
      system: true,
      content: `${socket.id} left the jam session`
    })
  })

  socket.on('message', function (room, message) {
    console.log(`[Socket.io] message received in ${room}: ${message}`)
    const board = rooms.find(t => t.id === room)
    if (board) {
      io.to(room).emit('message', message)
      // Write to DB
    }
  })

  socket.on('add', function (room, item) {
    console.log(`[Socket.io] add item in ${room}: ${item}`)
    const board = rooms.find(t => t.id === room)
    if (board) {
      board.items.push(item)
      io.to(room).emit('add', item)
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
    socket.broadcast.emit('message', `${socket.id} left`)
  })
})

export default function (req, res, next) {
  res.statusCode = 200
  res.end()
}
