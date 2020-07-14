import * as path from 'path'
import * as dotenv from 'dotenv'

const envPath = path.join(__dirname, `../.env.${process.env.NODE_ENV || 'production'}`)
dotenv.config({ path: envPath })
const PRODUCTION = process.env.NODE_ENV === 'production'
const PORT = parseInt(process.env.PORT || (PRODUCTION ? '8080' : '8999'))
const SOURCE_DIR = path.join(__dirname, PRODUCTION ? 'client' : '../../client')
const RECENTS_FILE = path.join(__dirname, '../data/recents.json')
const RECENTS_LIMIT = 100

import { Song, getSong, loadRecents, saveRecents } from './music'

let recently_played: Array<Song> = loadRecents(RECENTS_FILE)

import * as express from 'express'
import * as WebSocket from 'ws'
const server = express()
  .use(express.static(SOURCE_DIR))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

const wss = new WebSocket.Server({ server })

interface ExtWebSocket extends WebSocket {
  isAlive: boolean
}

interface WebSocketMessage {
  message: string
}

let song: Song = null

wss.on('connection', async (ws: ExtWebSocket) => {

  ws.isAlive = true

  // update recents, but wait for first song
  if (!song) song = await getSong()
  sendSong(song)
  sendRecents(recently_played || [], song)

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

const sendRecents = (recents: any, newSong: Song) => {
  // remove currently playing song from recents sent to client
  let r = JSON.parse(JSON.stringify(recents)) // make duplicate
  if (r.length > 0 && newSong && r[0].item.id === newSong.item.id) {
    r.shift()
  }

  wss.clients.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify({
      type: 'recently_played',
      recents: r
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
  if (!newSong && !song) return false
  return JSON.stringify(newSong) !== JSON.stringify(song)
}

const differentSong = (newSong: Song, oldSong: Song): boolean => {
  if (!oldSong || !newSong) return false
  return newSong?.item?.id !== oldSong?.item?.id
}

const updateRecentlyPlayed = (newSong: Song) => {
  if (newSong && newSong.progress_ms >= 15 * 1000) { // listened for 15 seconds
    if (!recently_played[0] || (recently_played[0] && recently_played[0].item.id !== newSong.item.id)) {
      // console.log(`Adding ${newSong.name} to recently played`)
      recently_played.unshift(newSong)

      // limit size of recently played list
      while (recently_played.length > RECENTS_LIMIT) {
        recently_played.pop()
      }

      saveRecents(RECENTS_FILE, recently_played)
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
        sendRecents(recently_played, newSong)
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
    ws.ping(() => {})
  })
}, 10000);
