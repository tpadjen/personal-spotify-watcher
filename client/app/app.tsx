import React from 'react'
import ReactDOM from 'react-dom'
import { SongPanel } from './current-song/song-panel'
import { SongJSONPanel } from './song-json/song-json-panel'
import { RecentPanel } from './recently-played/recent-panel'
import { SpotifyConnection } from './connection/spotify-connection'
import { TabPanel } from './utility/tab-panel'
import './styles.scss'


SpotifyConnection.connect()

const App = () => {
  return (
    <div>
      <SongPanel />
      <TabPanel>
        <RecentPanel tab={'Recently Played'}/>
        <SongJSONPanel tab={'Song Data'}/>
      </TabPanel>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
