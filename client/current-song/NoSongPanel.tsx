import React, { ReactElement } from 'react'


export const NoSongPanel = (): ReactElement => {
  return (
    <div id="no-song" className="song">
      <h1 id="not-playing">No Song Playing</h1>
    </div>
  )
}
