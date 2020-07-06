import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'
import * as path from 'path'
import { Song, getSong } from './current-song'

const noop = () => {}

const port = parseInt(process.env.PORT || '8999')

const wss = new WebSocket.Server({ port: port })

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
    song: song
  }))

  ws.on('pong', () => {
    ws.isAlive = true
  })

})

const sendSong = (s: Song) => {
  wss.clients.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify({
      song: s
    }))
  })
}

const songChanged = (newSong: Song, oldSong: Song): boolean => {
  if (!newSong && !song) return false;
  if (newSong && !song) return true;
  if (!newSong && song) return true;
  return newSong && song && (newSong.artist !== song.artist || newSong.name !== song.name);
}

setInterval(async() => {
  const newSong: Song = await getSong()
  if (songChanged(newSong, song)) {
    song = newSong
    sendSong(song)
  }
}, 2000)

const pingInterval = setInterval(() => {
  (wss.clients as Set<ExtWebSocket>).forEach((ws: ExtWebSocket) => {
    if (!ws.isAlive) return ws.terminate();

    ws.isAlive = false
    ws.ping(noop)
  })
}, 10000);

console.log(`WebSocket listening on ws://localhost:${port}`)
