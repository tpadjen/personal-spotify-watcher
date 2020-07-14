import React from 'react'
import ScaleLoader from 'react-spinners/ScaleLoader'
import { Colors } from '../theme'


export const SongLoadingPanel = () => {
  return (
    <div id="no-song" className="song">
      <ScaleLoader height={100} width={10} color={Colors.highlight} loading={true} />
    </div>
  )
}
