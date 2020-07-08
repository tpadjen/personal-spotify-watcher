import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'
import * as path from 'path'
import { Song, getSong, getRecentlyPlayed } from './current-song'

const noop = () => {}

const PORT = parseInt(process.env.PORT || (!!process.env.DEV ? '8999' : '8080'))
const INDEX = '/index.html'

let recently_played: Array<Song> = []

const server = express()
  .use('/secure', (req, res) => {
    res.send(403)
  })
  .use(express.static(__dirname))
  // .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

const wss = new WebSocket.Server({ server })

interface ExtWebSocket extends WebSocket {
  isAlive: boolean
}

interface WebSocketMessage {
  message: string
}

let song: Song = null

wss.on('connection', (ws: ExtWebSocket) => {

  ws.isAlive = true

  ws.send(JSON.stringify({
    'connection': true,
    type: 'track',
    song: song
  }))

  // remove currently playing song from recents sent to client
  let recent = JSON.parse(JSON.stringify(recently_played))
  if (recent.length > 0 && recent[0].item.id === song.item.id)
  recent.shift()

  ws.send(JSON.stringify({
    type: 'recently_played',
    recent
  }))

  ws.on('pong', () => {
    ws.isAlive = true
  })

})

const sendSong = (s: Song) => {
  wss.clients.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify({
      type: 'track',
      song: s
    }))
  })
}

const sendRecent = (recent: any) => {
  wss.clients.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify({
      type: 'recently_played',
      recent
    }))
  })
}

const sendError = (error: any) => {
  wss.clients.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify({
      error: error
    }))
  })
}

const songChanged = (newSong: Song, oldSong: Song): boolean => {
  if (!newSong && !song) return false;
  return JSON.stringify(newSong) !== JSON.stringify(song)
}

const differentSong = (newSong: Song, oldSong: Song): boolean => {
  if (!oldSong || !newSong) return false // no need for recently played update
  return newSong?.item?.id !== oldSong?.item?.id
}

const updateRecentlyPlayed = (newSong: Song) => {
  if (newSong && newSong.progress_ms >= 15 * 1000) { // listened for 15 seconds
    if (!recently_played[0] || (recently_played[0] && recently_played[0].item.id !== newSong.item.id)) {
      console.log(`Adding ${newSong.name} to recently played`)
      recently_played.unshift(newSong)
    }
  }
}

setInterval(async() => {
  try {
    const newSong: Song = await getSong()
    updateRecentlyPlayed(newSong);

    if (songChanged(newSong, song)) {
      sendSong(newSong)

      if (differentSong(newSong, song)) {
        sendRecent(recently_played)
      }

      song = newSong
    }
  } catch (error) {
    console.log(error)
    sendError(error)
  }
}, 2000)

const pingInterval = setInterval(() => {
  (wss.clients as Set<ExtWebSocket>).forEach((ws: ExtWebSocket) => {
    if (!ws.isAlive) return ws.terminate();

    ws.isAlive = false
    ws.ping(noop)
  })
}, 10000);
