const artistElement = document.getElementById('artist')
const titleElement = document.getElementById('title')

let socket = new WebSocket("ws://localhost:8999")

socket.addEventListener('open', (e) => {
  console.log('Opened connection')
})

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data)
  const greeting = data['connection']

  const song = data['song']
  if (song) {
    console.log(song)
    artistElement.innerText = song.artist
    titleElement.innerText = song.name
  } else if (greeting) {
    console.log('No Song Playing')
    artistElement.innerText = 'No Song Playing'
    titleElement.innerText = null
  } else {
    artistElement.innerText = 'Waiting for Song...'
    titleElement.innerText = null
  }
})

socket.addEventListener('close', (event) => {
  if (event.wasClean) {
    console.log('Connection closed')
  } else {
    console.log('Connection died')
  }
})

socket.addEventListener('error', (error) => {
  console.error(error)
})
