import React, { ReactElement } from 'react'


interface SongNameProps {
  title: string,
  artist: string
}

export const SongName = ({ title, artist }: SongNameProps): ReactElement => {
  return (
    <div className="info">
      <h1 id="title">{title}</h1>
      <h2 id="artist">{artist}</h2>
    </div>
  )
}