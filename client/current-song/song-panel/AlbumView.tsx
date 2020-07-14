import React from 'react'
import { Album } from '../../store/Music.model'


interface AlbumProps {
  album: Album;
}

export const AlbumView = ({ album }: AlbumProps) => {
  return (
    <div id="album">
      <h2 id="album-name">{album.name}</h2>
      <img src={album.images[0].url} alt="" />
    </div>
  )
}
