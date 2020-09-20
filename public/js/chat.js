const socket = io()

socket.on('message', (msg) => {
  console.log(msg)
})

document.querySelector('#msgForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const msg = e.target.elements.message.value
  socket.emit('sendMessage', msg)
})

document.querySelector('#sendLocation').addEventListener('click', (e) => {
  if (!navigator.geolocation) return alert('Geo location not support by your browser.')

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    socket.emit('sendLocation', {
      latitude,
      longitude,
    })
  })
})
