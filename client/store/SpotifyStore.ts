import { BehaviorSubject, Observable, of } from 'rxjs'
import { Song, FilteredSong } from './Music.model'
import { ConnectionReport, ConnectionStatus } from '../connection/Connection.model'
import { map, takeWhile, take, switchMap, tap, skip } from 'rxjs/operators'


class SpotifyStore {

  song$: BehaviorSubject<Song | undefined> = new BehaviorSubject<Song | undefined>(undefined)
  recents$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([])

  connection$: BehaviorSubject<ConnectionReport> = new BehaviorSubject<ConnectionReport>({
    status: ConnectionStatus.connecting,
    message: 'Connecting to Spotify...'
  })

  loading$: Observable<boolean> = this.connection$.pipe(
    map((report: ConnectionReport) => report.status),
    map((status: ConnectionStatus) => status !== ConnectionStatus.okay),
    map(pred => !!pred),
    takeWhile((loading: boolean) => loading, true)
  )

  okay$: Observable<boolean> = this.connection$.pipe(
    map((report: ConnectionReport) => {
      return [
        ConnectionStatus.connecting,
        ConnectionStatus.connected,
        ConnectionStatus.okay
      ].includes(report.status)
    })
  )

  fetched$: Observable<boolean> = this.song$.pipe(
    skip(1), // skip initial undefined, wait for first server response
    map(() => true),
    take(2),
  )

  filteredSong: (keys: Array<string>) => Observable<FilteredSong>
  _filteredSong(keys: Array<string>): Observable<FilteredSong> {
    return this.song$.pipe(
      switchMap((song: Song | undefined) => {
        if (song === undefined || song === null) return of(undefined)

        return of(song).pipe(
          map((song: Song) => JSON.parse(JSON.stringify(song))),
          map((song: Song) => ({ ...song, ...song.item })),
          tap((song: Song) => delete song['item']),
          map((song) => ({
            ...song,
            href: (song as unknown as FilteredSong)['external_urls'].spotify
          })),
          tap((song) => delete (song as unknown as FilteredSong)['external_urls']),
          map((song) => {
            keys.forEach(key => delete (song as unknown as Record<string, unknown>)[key])
            return song
          })
        )
      })
    )
  }

  constructor() {
    this.filteredSong = this._filteredSong.bind(this)
  }
}

const spotifyStore = new SpotifyStore()
export { spotifyStore as SpotifyStore }
export const connection$ = spotifyStore.connection$
export const loading$ = spotifyStore.loading$
export const okay$ = spotifyStore.okay$
export const song$ = spotifyStore.song$
export const recents$ = spotifyStore.recents$
export const fetched$ = spotifyStore.fetched$
