import * as path from 'path'
import * as fs from 'fs'
import * as WebSocket from 'ws'
import { Song, getSong, loadRecents, saveRecents } from './music'
import { Server } from 'http'
import config from './config'


const DATA_FOLDER = path.join(__dirname, '../data')
if (!fs.existsSync(DATA_FOLDER)) {
  fs.mkdirSync(DATA_FOLDER)
}

const recently_played: Array<Song> = loadRecents(config.RECENTS_FILE)

interface ExtWebSocket extends WebSocket {
  isAlive: boolean,
  channels: Set<string>
}

const startSongSocket = (server: Server): void => {

  const wss = new WebSocket.Server({ server })

  let song: Song = null

  wss.on('connection', async (ws: ExtWebSocket) => {

    ws.isAlive = true
    ws.channels = new Set()

    ws.on('pong', () => {
      ws.isAlive = true
    })

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data)
        const response = processIncomingMessage(message, ws)
        ws.send(JSON.stringify(response))
      } catch (error) {
        ws.send(JSON.stringify({
          type: 'message-error',
          data: error
        }))
      }
    })
  })

  interface IncomingMessage {
    id: string,
    type: string,
    data: {
      channel?: string
    }
  }

  interface ResponseMessage {
    type: string,
    data: {
      request: IncomingMessage
    }
  }

  const processIncomingMessage = (message: IncomingMessage, ws: ExtWebSocket): ResponseMessage => {
    switch (message.type) {
      case 'addChannel': return addChannel(message, ws)
      default:
        return {
          type: 'not-supported',
          data: {
            request: message,
          }
        }
    }
  }

  const addChannel = (message: IncomingMessage, ws: ExtWebSocket): ResponseMessage => {
    if (!config.CHANNELS.includes(message.data.channel)) {
      return {
        type: 'channel-does-not-exist',
        data: {
          request: message
        }
      }
    }

    ws.channels.add(message.data.channel)
    sendSocketMostRecentDataForChannel(message.data.channel, ws)

    return {
      type: 'channel-added',
      data: {
        request: message,
      }
    }
  }

  const sendSocketMostRecentDataForChannel = (channel: string, ws: WebSocket) => {
    switch (channel) {
      case 'current-song':
        getSong().then((song) => sendSong(song, ws))
        break
      case 'recently-played':
        sendRecents(recently_played || [], song, ws)
        break
      default:
        break
    }
  }

  interface OutgoingMessage {
    type: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  }

  const sendMessageToSocket = (message: OutgoingMessage, ws: WebSocket) => {
    ws.send(JSON.stringify(message))
  }

  const sendMessageToChannel = (message: OutgoingMessage) => {
    const json = JSON.stringify(message)
    Array.from(wss.clients as Set<ExtWebSocket>).filter(client => client.channels.has(message.type))
      .forEach((ws: WebSocket) => ws.send(json))
  }

  const sendSong = (s: Song, ws: WebSocket = undefined) => {
    const message = {
      type: 'current-song',
      data: s
    }

    ws ? sendMessageToSocket(message, ws) : sendMessageToChannel(message)
  }

  const sendRecents = (recents: Song[], newSong: Song, ws: WebSocket = undefined) => {
    // remove currently playing song from recents sent to client
    const recentSongs = JSON.parse(JSON.stringify(recents)) // make duplicate
    if (recentSongs.length > 0 && newSong && recentSongs[0].item.id === newSong.item.id) {
      recentSongs.shift()
    }

    const message = {
      type: 'recently-played',
      data: recentSongs
    }

    ws ? sendMessageToSocket(message, ws) : sendMessageToChannel(message)
  }

  const sendError = (error: Error) => {
    sendMessageToChannel({
      type: 'error',
      data: error
    })
  }

  const songChanged = (newSong: Song): boolean => {
    if (!newSong && !song) return false
    return JSON.stringify(newSong) !== JSON.stringify(song)
  }

  const differentSong = (newSong: Song, oldSong: Song): boolean => {
    if (!oldSong || !newSong) return false
    return newSong?.item?.id !== oldSong?.item?.id
  }

  const updateRecentlyPlayed = (newSong: Song) => {
    if (newSong && newSong.progress_ms >= config.SONG_SHOULD_COUNT_TIME) {
      if (!recently_played[0] || (recently_played[0] && recently_played[0].item.id !== newSong.item.id)) {
        // console.log(`Adding ${newSong.name} to recently played`)
        recently_played.unshift(newSong)

        // limit size of recently played list
        while (recently_played.length > config.RECENTS_LIMIT) {
          recently_played.pop()
        }

        saveRecents(config.RECENTS_FILE, recently_played)
      }
    }
  }

  // poll spotify every 2 seconds for the latest song
  setInterval(async () => {
    try {
      const newSong: Song = await getSong()
      updateRecentlyPlayed(newSong)

      if (songChanged(newSong)) {
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
  //
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pingInterval = setInterval(() => {
    (wss.clients as Set<ExtWebSocket>).forEach((ws: ExtWebSocket) => {
      if (!ws.isAlive) return ws.terminate()

      ws.isAlive = false
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      ws.ping(() => {})
    })
  }, 10000)
}

export default startSongSocket
