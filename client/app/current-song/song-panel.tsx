import React from 'react'
import { SongDetails } from './song-panel/song-details'
import { NoSongPanel } from './no-song-panel'
import { Song } from '../store/music-models'
import { useObservableState } from 'observable-hooks'
import { SpotifyStore } from '../store/spotify-store'
import { SongLoadingPanel } from './song-loading-panel'


export const SongPanel = () => {
  const {song$, fetched$, loading$} = SpotifyStore

  const song: Song | undefined = useObservableState(song$)
  const fetched: boolean = !!useObservableState(fetched$)
  const loading: boolean = !!useObservableState(loading$)

  return (
    <div id="song-panel">
      {
        loading || !fetched ? <SongLoadingPanel /> : (
          song ? (
            <SongDetails song={song} />
          ) : (
            <NoSongPanel />
          )
        )
      }
    </div>
  )
}
