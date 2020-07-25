import React, { ReactElement } from 'react'
import { SongDetails } from './song-panel/SongDetails'
import { NoSongPanel } from './NoSongPanel'
import { Song } from '../store/Music.model'
import { SongLoadingPanel } from './SongLoadingPanel'


interface SongPanelProps {
  song: Song | undefined,
  fetched: boolean,
  loading: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

export const SongPanel: React.FC<SongPanelProps> = ({
  song, fetched, loading
}): ReactElement => {

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
