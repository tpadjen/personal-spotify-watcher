import React, { ReactElement } from 'react'
import { recents$ } from '../store/SpotifyStore'
import { RecentSongView } from './RecentSongView'
import { Song } from '../store/Music.model'
import { Subscription } from 'rxjs'
import ScaleLoader from 'react-spinners/ScaleLoader'


interface RecentPanelState {
  recents: Array<Song>
}

interface RecentPanelProps {
  // 'Indexer'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

export class RecentPanel extends React.Component<RecentPanelProps, RecentPanelState> {
  state: RecentPanelState = { recents: recents$.value }
  sub: Subscription | undefined

  componentDidMount(): void {
    this.sub = recents$.subscribe((recents: Song[]) => this.setState({ recents }))
  }

  componentWillUnmount(): void {
    this.sub?.unsubscribe()
  }

  render(): ReactElement {
    const rows = () => (
      this.state.recents.map((song: Song, index: number) => (
        <RecentSongView song={song} key={index} />
      ))
    )

    const loaded = this.state.recents && this.state.recents.length > 1

    return (
      <React.Fragment>
        {
          !loaded ? (
            <div style={{ height: '200px', display: 'grid', alignItems: 'center' }}>
              <ScaleLoader height={100} width={10} color={'#189cc4'} loading={true} />
            </div>
          ) : (
            <div id="recent-panel">
              <div id="recent">{rows()}</div>
            </div>
          )
        }
      </React.Fragment>
    )
  }
}
