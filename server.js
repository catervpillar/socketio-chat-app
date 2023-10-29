const io = require('socket.io')(3000, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
})

const users = {}

io.on('connection', socket => {
  socket.on('new-user', username => {
    users[socket.id] = username
    socket.broadcast.emit('user-connected', username)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message, username: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})