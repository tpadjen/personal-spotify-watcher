import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'
import * as path from 'path'
import { Song, getSong } from './logger'

const app = express()

const noop = () => {}

const server = http.createServer(app)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.static('dist'))

const wss = new WebSocket.Server({ server })

interface ExtWebSocket extends WebSocket {
  isAlive: boolean
}

interface WebSocketMessage {
  message: string
}

wss.on('connection', (ws: ExtWebSocket) => {

  ws.isAlive = true

  ws.on('message', (body: string) => {
    const data: WebSocketMessage = JSON.parse(body);
    console.log(`received: ${data.message}`)
    ws.send(`Hello, you sent -> ${data.message}`)
  })

  ws.send(JSON.stringify({
    'connection': true,
    song: song
  }))

  ws.on('pong', () => {
    ws.isAlive = true
  })

})

let song: Song = null
let sent: boolean = false

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


app.get('/', (req: express.Request, res: express.Response) => {
  res.render('index.ejs')
})

server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${(server.address() as WebSocket.AddressInfo).port} :)`)
})
