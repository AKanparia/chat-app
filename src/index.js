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
  socket.on('sendMessage', (msg) => {
    io.emit('message', msg)
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
