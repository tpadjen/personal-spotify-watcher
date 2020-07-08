import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'
import * as path from 'path'
import { Song, getSong, getRecentlyPlayed } from './current-song'

const noop = () => {}

const PORT = parseInt(process.env.PORT || (!!process.env.DEV ? '8999' : '8080'))
const INDEX = '/index.html'

const server = express()
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

  getRecentlyPlayed().then((recent => {
    ws.send(JSON.stringify({
      type: 'recently_played',
      recent
    }))
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

setInterval(async() => {
  try {
    const newSong: Song = await getSong()
    if (songChanged(newSong, song)) {
      sendSong(newSong)

      if (differentSong(newSong, song)) {
        sendRecent(await getRecentlyPlayed())
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
