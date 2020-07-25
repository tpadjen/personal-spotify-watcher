import { ConnectionStatus, ReceivedData, ReceivedSong, ReceivedRecents } from './Connection.model'
import { SpotifyStore } from '../store/SpotifyStore'
const { connection$, song$, recents$ } = SpotifyStore


class SpotifyConnection {

  connect() {
    const IS_LOCAL = window.location.hostname.match(/localhost/)
    const PRO_PORT = IS_LOCAL ? `:${process.env.PORT}` : ''
    const DEV_PORT = `:${process.env.PORT}`
    const PRODUCTION = process.env.NODE_ENV === 'production'
    const PROTOCOL = PRODUCTION && !IS_LOCAL ? 'wss' : 'ws'
    const HOST = `${PROTOCOL}://${window.location.hostname}${PRODUCTION ? PRO_PORT : DEV_PORT}`

    const socket = new WebSocket(HOST)

    const addChannel = (channel: string) => {
      socket.send(JSON.stringify({
        type: 'addChannel',
        data: {
          channel: channel
        }
      }))
    }

    socket.addEventListener('open', () => {
      console.log('Connected to socket')
      connection$.next({
        status: ConnectionStatus.connected,
        message: 'Connected'
      })

      addChannel('current-song')
      addChannel('recently-played')
      addChannel('error')
    })

    socket.addEventListener('close', () => {
      console.log('Connection to socket closed, Trying to reconnect...')
      connection$.next({
        status: ConnectionStatus.closed,
        message: 'Trying to reconnect...'
      })
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this
      setTimeout(() => that.connect(), 1000)
    })

    socket.addEventListener('error', () => {
      // console.error(`Socket error:`, err)
      connection$.next({
        status: ConnectionStatus.error,
        message: 'Error'
      })
      socket.close()
    })

    socket.addEventListener('message', (message) => {
      // console.log('Received message', message)
      const data = JSON.parse(message.data)
      if (data.error) {
        if (data.error.message.match(/ENOTFOUND api\.spotify\.com/)) {
          connection$.next({
            status: ConnectionStatus.error,
            message: 'Spotify not available...'
          })
        } else {
          connection$.next({
            status: ConnectionStatus.error,
            message: 'Server problem...'
          })
          console.error(data.error)
        }
        return
      }

      connection$.next({
        status: ConnectionStatus.okay,
        message: 'Data received'
      })

      this.handleMessage(data)
    })

  }

  handleMessage(received: ReceivedData) {
    switch (received.type) {
      case 'current-song':
        song$.next((received as ReceivedSong).data)
        break
      case 'recently-played':
        recents$.next((received as ReceivedRecents).data)
        break
      case 'error':
        console.error('Websocket error: ', received)
        break
      case 'channel-added':
        console.log(`Subscribed to ${received.data.request.data.channel} channel`)
        break
      case 'message-error':
        console.log('Error processing message: ', received.data)
        break
      default:
        console.log('Websocket message: ', received)
        break
    }
  }

}

const connection = new SpotifyConnection()
export { connection as SpotifyConnection }
