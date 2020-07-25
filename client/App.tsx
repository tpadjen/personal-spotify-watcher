import React from 'react'
import ReactDOM from 'react-dom'
import { SpotifyConnection } from './connection/SpotifyConnection'
import { song$, fetched$, loading$ } from './store/SpotifyStore'
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
import { Song } from 'store/Music.model'


SpotifyConnection.connect()

const App = () => {
  const song: Song | undefined = useObservableState(song$)
  const fetched = !!useObservableState(fetched$)
  const loading = !!useObservableState(loading$)

  return (
    <div>
      <TabPanel
        Nav={ThemedTabNav}
        NavList={ThemedTabNavList}
        Content={ThemedTabContent}
        Panel={ThemedTabPanel}
        Tab={ThemedTab}
        colors={ThemedTabColors}
      >
        <SongPanel
          song={song}
          loading={loading}
          fetched={fetched}
          tab={'Currently Playing'}
        />
        <SongJSONPanel tab={'Song Data'} disabled={!song} />
      </TabPanel>
      <TabPanel
        Nav={ThemedTabNav}
        NavList={ThemedTabNavList}
        Content={ThemedTabContent}
        Panel={ThemedTabPanel}
        Tab={ThemedTab}
        colors={ThemedTabColors}
      >
        <RecentPanel tab={'Recently Played'} />
      </TabPanel>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
