import React from 'react'
import { Song } from '../store/Music.model'


interface RecentSongViewProps {
  song: Song
}

export const RecentSongView = ({song}: RecentSongViewProps) => {
  return (
    <a
      className="recent-song"
      href={song.item['external_urls'].spotify}
      target="__blank"
    >
      <img className="album-thumb" src={song.item.album.images[0].url} alt={song.item.album.name}/>
      <div className="artist">{song.artist}</div>
      <div className="title">{song.name}</div>
    </a>
  )
}
