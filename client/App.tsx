import React from 'react'
import ReactDOM from 'react-dom'
import { SpotifyConnection } from './connection/SpotifyConnection'
SpotifyConnection.connect()
import { song$ } from './store/SpotifyStore'

import { SongPanel } from './current-song/SongPanel'
import { SongJSONPanel } from './song-json/SongJSONPanel'
import { RecentPanel } from './recently-played/RecentPanel'
import { TabPanel } from './utility/TabPanel'
import './styles.scss'
import { useObservable, useObservableState } from 'observable-hooks'


const App = () => {
  const song = useObservableState(song$)

  return (
    <div>
      <SongPanel />
      <TabPanel>
        <RecentPanel tab={'Recently Played'} />
        <SongJSONPanel tab={'Song Data'} disabled={!song} />
      </TabPanel>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
