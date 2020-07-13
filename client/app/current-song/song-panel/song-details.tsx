import React from 'react'
import { SongName } from './song-name'
import { Song } from '../../store/music-models'
import { AlbumView } from './album-view'


interface SongDetailsProps {
  song: Song;
}

export const SongDetails = (props: SongDetailsProps) => {
  return (
    <a id="song" className="song" target="_blank" href={props.song.item['external_urls'].spotify}>
      <AlbumView album={props.song.item.album}/>
      <SongName title={props.song.name} artist={props.song.artist} />
    </a>
  )
}
