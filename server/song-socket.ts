import * as path from 'path'
import * as WebSocket from 'ws'
import { Song, getSong, loadRecents, saveRecents } from './music'
import { Server } from 'http'


const RECENTS_FILE = path.join(__dirname, '../data/recents.json')
const RECENTS_LIMIT = 100
const SONG_SHOULD_COUNT_TIME = 15 * 1000 // 15 seconds before countint song as a recent

let recently_played: Array<Song> = loadRecents(RECENTS_FILE)

interface ExtWebSocket extends WebSocket {
  isAlive: boolean
}

const startSongSocket = (server: Server) => {

  const wss = new WebSocket.Server({ server })

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

  const sendMessageToAll = (message: {}) => {
    const json = JSON.stringify(message)
    wss.clients.forEach((ws: WebSocket) => ws.send(json))
  }

  const sendSong = (s: Song) => {
    sendMessageToAll({
      type: 'track',
      song: s
    })
  }

  const sendRecents = (recents: any, newSong: Song) => {
    // remove currently playing song from recents sent to client
    let r = JSON.parse(JSON.stringify(recents)) // make duplicate
    if (r.length > 0 && newSong && r[0].item.id === newSong.item.id) {
      r.shift()
    }

    sendMessageToAll({
      type: 'recently_played',
      recents: r
    })
  }

  const sendError = (error: any) => {
    sendMessageToAll({
      error: error
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
    if (newSong && newSong.progress_ms >= SONG_SHOULD_COUNT_TIME) {
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

  // poll spotify every 2 seconds for the latest song
  setInterval(async () => {
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

  // check each websocket connection with a heartbeat every 10 seconds
  // and clean up unresponsive clients
  const pingInterval = setInterval(() => {
    (wss.clients as Set<ExtWebSocket>).forEach((ws: ExtWebSocket) => {
      if (!ws.isAlive) return ws.terminate();

      ws.isAlive = false
      ws.ping(() => { })
    })
  }, 10000);
}

export default startSongSocket
