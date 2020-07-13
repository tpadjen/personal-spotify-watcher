import React from 'react'
import { SpotifyStore } from '../store/spotify-store';
import { RecentSongView } from './recent-song-view'
import { Song } from '../store/music-models';
import { Subscription } from 'rxjs';
import ScaleLoader from 'react-spinners/ScaleLoader'


interface RecentPanelState {
  recent: Array<any> | undefined
}

export class RecentPanel extends React.Component<any, RecentPanelState> {
  state: RecentPanelState = { recent: undefined }
  sub: Subscription | undefined

  componentDidMount() {
    this.sub = SpotifyStore.recent$.subscribe((recent: any) => this.setState({recent}))
  }

  componentWillUnmount() {
    this.sub?.unsubscribe()
  }

  render() {
    const rows = () => (
      // ts can't tell recent is never undefined here
      // @ts-ignore
      this.state.recent.map((song: Song, index: number) => <RecentSongView song={song} key={index} />)
    )

    // ts can't tell recent is never undefined here
    // @ts-ignore
    const loaded = this.state.recent && this.state.recent.length > 1

    return (
      <React.Fragment>
        {
          !loaded ? (
            <div style={{height: '200px', display: 'grid', alignItems: 'center'}}>
              <ScaleLoader height={100} width={10} color={'#189cc4'} loading={true} />
            </div>
          ) : (
            <div id="recent-panel">
              {/* <h3 id="recent-heading">Recently Played</h3> */}
              <div id="recent">{rows()}</div>
            </div>
          )
        }
      </React.Fragment>
    )
  }
}
