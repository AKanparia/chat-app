const socket = io()

socket.on('message', (msg) => {
  console.log(msg)
})

document.querySelector('#msgForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const msg = e.target.elements.message.value
  socket.emit('sendMessage', msg)
})
