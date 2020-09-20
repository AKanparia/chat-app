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
const sidebarTemplate = document.querySelector('#sidebarTemplate').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
  //new msg dom element
  const $newMsg = $msgs.lastElementChild

  //height of the new msg
  const newMsgStyles = getComputedStyle($newMsg)
  const newMsgMargin = parseInt(newMsgStyles.marginBottom)
  const newMsgHeight = $newMsg.offsetHeight + newMsgMargin

  //visible height
  const visibleHeight = $msgs.offsetHeight

  //height of msg container
  const containerHeight = $msgs.scrollHeight

  // how far have i scrolled
  const scrollOffset = $msgs.scrollTop + visibleHeight

  if (containerHeight - newMsgHeight <= scrollOffset) {
    $msgs.scrollTop = $msgs.scrollHeight
  }
}

socket.on('message', (msg) => {
  const html = Mustache.render(msgTemplate, {
    username: msg.username,
    msg: msg.text,
    createdAt: moment(msg.createdAt).format('h:mm a'),
  })
  $msgs.insertAdjacentHTML('beforeend', html)
  autoScroll()
})

socket.on('locationMsg', (msg) => {
  const html = Mustache.render(locationMsgTemplate, {
    username: msg.username,
    url: msg.url,
    createdAt: moment(msg.createdAt).format('h:mm a'),
  })
  $msgs.insertAdjacentHTML('beforeend', html)
  autoScroll()
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users })
  document.querySelector('#sidebar').innerHTML = html
})

$msgForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const msg = e.target.elements.message.value
  if (!msg) return $msgFormInput.focus()

  $msgFormBtn.setAttribute('disabled', 'disabled')

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
  if (error) {
    alert(error)
    location.href = '/'
  }
})
