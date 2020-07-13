import React from 'react'
import { Album } from '../../store/music-models'


interface AlbumProps {
  album: Album;
}

export const AlbumView = (props: AlbumProps) => {
  return (
    <div id="album">
      <h2 id="album-name">{props.album.name}</h2>
      <img src={props.album.images[0].url} alt="" />
    </div>
  )
}
