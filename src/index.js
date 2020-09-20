const { Socket } = require('dgram')
const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.port
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.emit('message', 'Welcome!')
  socket.broadcast.emit('message', 'A new user has joined')

  socket.on('sendMessage', (msg) => {
    io.emit('message', msg)
  })
  socket.on('sendLocation', ({ latitude, longitude }) => {
    io.emit('message', `https://google.com/maps?q=${latitude},${longitude}`)
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left')
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
