import React, { ReactElement } from 'react'
import { Song, FilteredSong } from '../store/Music.model'
import { JSONPanel } from '../utility/JSONPanel'
import { SpotifyStore } from '../store/SpotifyStore'
import { Subscription } from 'rxjs'
import styled from 'styled-components'
import { JSONThemes } from '../theme'


const REMOVE_KEYS = ['actions', 'context', 'device', 'progress_ms', 'shuffle_state',
  'repeat_state', 'currently_playing_type', 'available_markets', 'disc_number', 'external_ids',
  'is_local', 'preview_url', 'track_number', 'type', 'href']
const filteredSong$ = SpotifyStore.filteredSong(REMOVE_KEYS)

interface SongJSONPanelProps {
  // 'Indexer'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

interface SongJSONPanelState {
  song: Song | FilteredSong | undefined
}

export class SongJSONPanel extends React.Component<SongJSONPanelProps, SongJSONPanelState> {
  state: SongJSONPanelState = { song: undefined }
  sub: Subscription | undefined

  componentDidMount(): void {
    this.sub = filteredSong$.subscribe((song: FilteredSong) => this.setState({ song }))
  }

  componentWillUnmount(): void {
    this.sub?.unsubscribe()
  }

  render(): ReactElement {
    return (
      <StyledJSONPanel>
        <JSONPanel json={(this.state.song || {}) as Record<string, unknown>} />
      </StyledJSONPanel>
    )
  }

}

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
