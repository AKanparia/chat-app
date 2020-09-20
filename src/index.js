const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMsg, generateLocationMsg } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.port
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.on('join', ({ username, room }) => {
    socket.join(room)

    socket.emit('message', generateMsg('Welcome!'))
    socket.broadcast.to(room).emit('message', generateMsg(`${username} has joined the chat.`))
  })

  socket.on('sendMessage', (msg, callback) => {
    const filter = new Filter()
    if (filter.isProfane(msg)) {
      return callback('Profanity is not allowed!')
    }

    io.emit('message', generateMsg(msg))
    callback()
  })

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    if (!(latitude && longitude)) callback('Error')

    io.emit('locationMsg', generateLocationMsg(latitude, longitude))
    callback()
  })

  socket.on('disconnect', () => {
    io.emit('message', generateMsg('A user has left'))
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
