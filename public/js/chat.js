const socket = io()

const $msgForm = document.querySelector('#msgForm')
const $msgFormInput = $msgForm.querySelector('input[name="message"]')
const $msgFormBtn = $msgForm.querySelector('button')
const $sendLocationBtn = document.querySelector('#sendLocation')

socket.on('message', (msg) => {
  console.log(msg)
})

$msgForm.addEventListener('submit', (e) => {
  e.preventDefault()
  $msgFormBtn.setAttribute('disabled', 'disabled')

  const msg = e.target.elements.message.value
  socket.emit('sendMessage', msg, (error) => {
    $msgFormBtn.removeAttribute('disabled')
    $msgFormInput.value = ''
    $msgFormInput.focus()

    if (error) {
      return console.log(error)
    }
    console.log('Message delivered.')
  })
})

$sendLocationBtn.addEventListener('click', (e) => {
  if (!navigator.geolocation) return alert('Geo location not support by your browser.')

  $sendLocationBtn.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    socket.emit(
      'sendLocation',
      {
        latitude,
        longitude,
      },
      (error) => {
        $sendLocationBtn.removeAttribute('disabled')
        if (error) return console.log('Error sharing location')
        console.log('Location shared')
      }
    )
  })
})
