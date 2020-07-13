import React from 'react'
import { Song } from '../store/music-models'
import { JSONPanel } from '../utility/json-panel'
import { SpotifyStore } from '../store/spotify-store'
import { Subscription } from 'rxjs'
import styled from 'styled-components'
import { JSONThemes } from '../theme'


const StyledJSONPanel = styled(JSONThemes.default)`
  text-align: left;
  font-size: 18px;
  width: 100%;
  display: grid;
  justify-items: center;

  .json-container {
    margin-top: 50px;
    margin-bottom: 60px;
    box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.25);
  }

  .renderjson {
    width: 60vw;

    @media screen and (max-width: 1200px) {
      width: 70vw;
    }

    @media screen and (max-width: 900px) {
      width: 85vw;
    }

    @media screen and (max-width: 600px) {
      width: calc(100vw-20px);
    }
  }
`

const REMOVE_KEYS = ['actions', 'context', 'device', 'progress_ms', 'shuffle_state',
  'repeat_state', 'currently_playing_type', 'available_markets', 'disc_number', 'external_ids',
  'is_local', 'preview_url', 'track_number', 'type', 'href']
const filteredSong$ = SpotifyStore.filteredSong(REMOVE_KEYS)

interface SongJSONPanelState {
  song: Song | undefined
}

export class SongJSONPanel extends React.Component<any, SongJSONPanelState> {
  state: SongJSONPanelState = { song: undefined }
  sub: Subscription | undefined

  componentDidMount() {
    this.sub = filteredSong$.subscribe((song: any) => this.setState({song}))
  }

  componentWillUnmount() {
    this.sub?.unsubscribe()
  }

  render() {
    return (
      <StyledJSONPanel>
        <JSONPanel json={this.state.song} />
      </StyledJSONPanel>
    )
  }

}
