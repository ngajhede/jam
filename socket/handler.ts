import { Server } from 'socket.io'

const io = new Server(3001, {
  cors: {
    origin: '*'
  }
})

type TItem = {
  id: string
  type: 'Stickynote',
  content: string
  x: number
  y: number
}

const boards: {
  id: string
  name: string
  items: TItem[]
  users: string[]
}[] = [
  {
    id: 'room1',
    name: 'room1',
    items: [{
      id: '1',
      type: 'Stickynote',
      content: 'Hello World',
      x: 100,
      y: 100
    }],
    users: []
  }
]

io.on('connection', (socket) => {
  console.log('Connection', socket.id)
})

io.on('connect', (socket) => {
  socket.emit('message', `welcome ${socket.id}`)
  socket.broadcast.emit('message', `${socket.id} joined`)

  socket.on('joinRoom', (room) => {
    console.log('joinRoom', room)
    socket.join(room)
    io.to(room).emit('join', {
      from_id: socket.id,
      system: true,
      content: `${socket.id} joined the jam session`
    })

    const board = boards.find(t => t.id === room)
    if (board) {
      board.users.push(socket.id)
    } else {
      boards.push({
        id: room,
        name: room,
        items: [],
        users: [socket.id]
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
    const board = boards.find(t => t.id === room)
    if (board) {
      io.to(room).emit('message', message)
      // Write to DB
    }
  })

  socket.on('add', function (room, item) {
    console.log(`[Socket.io] add item in ${room}: ${item}`)
    const board = boards.find(t => t.id === room)
    if (board) {
      board.items.push(item)
      io.to(room).emit('add', item)
      // Write to DB
    }
  })

  socket.on('itemChange', function (room, item) {
    const board = boards.find(t => t.id === room)
    if (board) {
      const index = board.items.findIndex(t => t.id === item.id)
      board.items[index] = item
      socket.broadcast.to(room).emit('changedItem', { room, item })
    }
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
