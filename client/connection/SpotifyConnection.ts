import { ConnectionStatus, SentData, SentSong, SentRecents } from './Connection.model'
import { SpotifyStore } from '../store/SpotifyStore'
const { connection$, song$, recents$ } = SpotifyStore


class SpotifyConnection {

  connect() {
    const PRO_PORT = window.location.hostname.match(/localhost/) ? `:${process.env.PORT}` : ''
    const DEV_PORT = `:${process.env.PORT}`
    const PRODUCTION = process.env.NODE_ENV === 'production';
    const HOST = `ws://${window.location.hostname}${PRODUCTION ? PRO_PORT : DEV_PORT}`

    let socket = new WebSocket(HOST)

    socket.addEventListener('open', () => {
      console.log('Connected to socket')
      connection$.next({
        status: ConnectionStatus.connected,
        message: 'Connected'
      })
    })

    socket.addEventListener('close', () => {
      console.log('Connection to socket closed, Trying to reconnect...')
      connection$.next({
        status: ConnectionStatus.closed,
        message: 'Trying to reconnect...'
      })
      const that = this;
      setTimeout(() => that.connect(), 1000);
    })

    socket.addEventListener('error', (err) => {
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

  handleMessage(data: SentData) {
    switch (data['type']) {
      case 'track':
        song$.next((data as SentSong).song)
        break;
      case 'recently_played':
        recents$.next((data as SentRecents).recents)
      default:
        break;
    }
  }

}

const connection = new SpotifyConnection()
export { connection as SpotifyConnection }
