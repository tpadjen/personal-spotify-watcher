import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'
import * as path from 'path'
import { Song, getSong, getRecentlyPlayed } from './current-song'
import * as fs from 'fs'

const noop = () => {}

const PORT = parseInt(process.env.PORT || (!!process.env.DEV ? '8999' : '8080'))
const INDEX = '/index.html'
const RECENTS_FILE = path.join(__dirname, 'secure/recents.json')
const RECENTS_LIMIT = 100

const loadRecents = (): Array<Song> => {
  let recents: Array<Song> = []
  if (!fs.existsSync(RECENTS_FILE)) {
    fs.closeSync(fs.openSync(RECENTS_FILE, 'w'))
  } else {
    try {
      recents = JSON.parse(fs.readFileSync(RECENTS_FILE, "utf-8"))
    } catch (e) {}
  }

  return recents
}

let recently_played: Array<Song> = loadRecents()

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

wss.on('connection', async (ws: ExtWebSocket) => {

  ws.isAlive = true

  // update recents, but wait for first song
  if (!song) song = await getSong()
  sendSong(song)
  sendRecent(recently_played, song)

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

const sendRecent = (recent: any, newSong: Song) => {
  // remove currently playing song from recents sent to client
  let r = JSON.parse(JSON.stringify(recent)) // make duplicate
  if (r.length > 0 && newSong && r[0].item.id === newSong.item.id) {
    r.shift()
  }

  wss.clients.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify({
      type: 'recently_played',
      recent: r
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

      fs.writeFile(RECENTS_FILE, JSON.stringify(recently_played), "utf8", () => {
        // console.log("Recents saved");
      })
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
        sendRecent(recently_played, newSong)
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
