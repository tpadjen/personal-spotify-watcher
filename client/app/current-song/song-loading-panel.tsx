import React from 'react'
import ScaleLoader from 'react-spinners/ScaleLoader'


export const SongLoadingPanel = () => {
  return (
    <div id="no-song" className="song">
      <ScaleLoader height={100} width={10} color={'#189cc4'} loading={true} />
    </div>
  )
}
