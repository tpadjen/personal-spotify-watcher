import React from 'react'
import ReactDOM from 'react-dom'
import { SpotifyConnection } from './connection/SpotifyConnection'
import { song$ } from './store/SpotifyStore'
import { SongPanel } from './current-song/SongPanel'
import { SongJSONPanel } from './song-json/SongJSONPanel'
import { RecentPanel } from './recently-played/RecentPanel'
import { TabPanel } from './utility/TabPanel'
import './styles.scss'
import { useObservableState } from 'observable-hooks'
import {
  ThemedTabPanel,
  ThemedTabContent,
  ThemedTabNav,
  ThemedTabNavList,
  ThemedTab,
  ThemedTabColors,
} from './theme'

SpotifyConnection.connect()

const App = () => {
  const song = useObservableState(song$)

  return (
    <div>
      <SongPanel />
      <TabPanel
        Nav={ThemedTabNav}
        NavList={ThemedTabNavList}
        Content={ThemedTabContent}
        Panel={ThemedTabPanel}
        Tab={ThemedTab}
        colors={ThemedTabColors}
      >
        <RecentPanel tab={'Recently Played'} />
        <SongJSONPanel tab={'Song Data'} disabled={!song} />
      </TabPanel>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
