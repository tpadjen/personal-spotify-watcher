import { ConnectionStatus } from './connection-report'
import { SpotifyStore } from '../store/spotify-store'
const { connection$, song$, recent$ } = SpotifyStore


class SpotifyConnection {

  connect() {
    let socket = new WebSocket(`ws://${window.location.hostname}:${process.env.PORT}`)
    // let socket = new WebSocket('ws://tbq-current-spotify-song.herokuapp.com/')
    socket.addEventListener('open', () => {
      console.log('Connected to socket')
      connection$.next({
        status: ConnectionStatus.connected,
        message: 'Connected'
      })
    })

    socket.addEventListener('close', () => {
      console.log('Connection to socket closed, Trying to reconnect...')
      const that = this;
      setTimeout(() => {
        connection$.next({
          status: ConnectionStatus.error,
          message: 'Connection closed, Trying to reconnect...'
        })
        that.connect()
      }, 1000);
    })

    socket.addEventListener('error', (err) => {
      console.error(`Socket error:`, err)
      connection$.next({
        status: ConnectionStatus.error,
        message: 'Connection problem'
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

      switch (data['type']) {
        case 'track':
          song$.next(data['song'])
          break;
        case 'recently_played':
          recent$.next(data['recent'])
        default:
          break;
      }

    })

  }

}

const connection = new SpotifyConnection()
export { connection as SpotifyConnection}
