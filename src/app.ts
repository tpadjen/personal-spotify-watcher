const songBoxEl = document.getElementById('song-box')
const songEl: HTMLAnchorElement = document.getElementById('song') as HTMLAnchorElement
const noSongEl = document.getElementById('no-song')
const artistEl = document.getElementById('artist')
const titleEl = document.getElementById('title')
const jsonEl = document.getElementById('json')
const albumImg = document.getElementById('album')?.querySelector('img')
const albumNameEl = document.getElementById('album-name')


const HOST = location.origin.replace(/^http/, 'ws')

let song: any = null

const connect = () => {

  let socket = new WebSocket(HOST)
  socket.addEventListener('open', () => {
    console.log('Connected to socket')
  })

  socket.addEventListener('close', () => {
    console.log('Connection to socket closed, Trying to reconnect...')
    setTimeout(() => {
      connect()
    }, 1000);
  })

  socket.addEventListener('error', (err) => {
    console.error(`Socket error:`, err)
    socket.close()
  })

  socket.addEventListener('message', (message) => {
    // console.log('Received message', message)
    const data = JSON.parse(message.data)
    if (data.error) {
      console.error(data.error)
      return
    }

    song = data['song']
    jsonEl!.innerText = JSON.stringify(song, undefined, 2)
    updateSongView(song)
  })

}

connect()

document.addEventListener('keypress', (e) => {
if (e.key === 'j') {
  jsonEl?.classList.toggle('hidden')
  }
})

const updateSongView = (song: any) => {
  if (song) {
    songEl!.classList.remove('hidden')
    noSongEl!.classList.add('hidden')

    artistEl!.innerText = song.artist
    titleEl!.innerText = song.name
    albumImg!.src = song.item.album.images[0].url
    albumImg!.alt = song.item.album.name
    albumNameEl!.innerText = song.item.album.name
    songEl!.href = song['item']['external_urls']['spotify']
  } else {
    songEl!.classList.add('hidden')
    noSongEl!.classList.remove('hidden')
  }
}
