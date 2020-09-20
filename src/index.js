const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMsg, generateLocationMsg } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.port
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.on('join', ({ username, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, username, room })

    if (error) return callback(error)

    socket.join(user.room)

    socket.emit('message', generateMsg('Welcome!'))
    socket.broadcast
      .to(user.room)
      .emit('message', generateMsg(`${user.username} has joined the chat.`))
    callback()
  })

  socket.on('sendMessage', (msg, callback) => {
    const user = getUser(socket.id)

    const filter = new Filter()
    if (filter.isProfane(msg)) {
      return callback('Profanity is not allowed!')
    }

    io.to(user.room).emit('message', generateMsg(msg))
    callback()
  })

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('locationMsg', generateLocationMsg(latitude, longitude))
    callback()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if (user) io.to(user.room).emit('message', generateMsg(`${user.username} has left the chat`))
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
