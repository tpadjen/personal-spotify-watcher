import React from 'react'


interface SongNameProps {
  title: string,
  artist: string
}

export const SongName = (props: SongNameProps) => {
  return (
    <div className="info">
      <h1 id="title">{props.title}</h1>
      <h2 id="artist">{props.artist}</h2>
    </div>
  )
}