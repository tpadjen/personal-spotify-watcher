import React, { ReactElement } from 'react'
import { SongDetails } from './song-panel/SongDetails'
import { NoSongPanel } from './NoSongPanel'
import { Song } from '../store/Music.model'
import { useObservableState } from 'observable-hooks'
import { song$, fetched$, loading$ } from '../store/SpotifyStore'
import { SongLoadingPanel } from './SongLoadingPanel'


export const SongPanel = (): ReactElement => {
  const song: Song | undefined = useObservableState(song$)
  const fetched = !!useObservableState(fetched$)
  const loading = !!useObservableState(loading$)

  return (
    <div id="song-panel">
      {
        loading || !fetched ? <SongLoadingPanel /> : (
          song
            ? <SongDetails song={song} />
            : <NoSongPanel />
        )
      }
    </div>
  )
}
