import React from 'react'
import ReactDOM from 'react-dom'
import { SpotifyConnection } from './connection/SpotifyConnection'
SpotifyConnection.connect()

import { SongPanel } from './current-song/SongPanel'
import { SongJSONPanel } from './song-json/SongJSONPanel'
import { RecentPanel } from './recently-played/RecentPanel'
import { TabPanel } from './utility/TabPanel'
import './styles.scss'


const App = () => {
  return (
    <div>
      <SongPanel />
      <TabPanel>
        <RecentPanel tab={'Recently Played'} />
        <SongJSONPanel tab={'Song Data'} />
      </TabPanel>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
