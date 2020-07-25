import React, { ReactElement } from 'react'
import { SongName } from './SongName'
import { Song } from '../../store/Music.model'
import { AlbumView } from './AlbumView'


interface SongDetailsProps {
  song: Song;
}

export const SongDetails = ({ song }: SongDetailsProps): ReactElement => {
  return (
    <a
      id="song"
      className="song"
      target="_blank"
      rel="noreferrer"
      href={song.item['external_urls'].spotify}
    >
      <AlbumView album={song.item.album} />
      <SongName title={song.name} artist={song.artist} />
    </a>
  )
}
