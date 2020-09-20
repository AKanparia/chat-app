const socket = io()

//element
const $msgForm = document.querySelector('#msgForm')
const $msgFormInput = $msgForm.querySelector('input[name="message"]')
const $msgFormBtn = $msgForm.querySelector('button')
const $sendLocationBtn = document.querySelector('#sendLocation')
const $msgs = document.querySelector('#msgs')

//templates
const msgTemplate = document.querySelector('#msgTemplate').innerHTML
const locationMsgTemplate = document.querySelector('#locationMsgTemplate').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (msg) => {
  const html = Mustache.render(msgTemplate, {
    msg: msg.text,
    createdAt: moment(msg.createdAt).format('h:mm a'),
  })
  $msgs.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMsg', (msg) => {
  const html = Mustache.render(locationMsgTemplate, {
    url: msg.url,
    createdAt: moment(msg.createdAt).format('h:mm a'),
  })
  $msgs.insertAdjacentHTML('beforeend', html)
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

socket.emit('join', { username, room }, (error) => {
  if (error) return console.log('Error occured')
  console.log('Joined')
})
