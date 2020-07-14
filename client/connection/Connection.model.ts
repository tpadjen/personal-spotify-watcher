import { Song } from "store/Music.model"


export enum ConnectionStatus {
  connecting,
  connected,
  okay,
  closed,
  error
}

export interface ConnectionReport {
  status: ConnectionStatus,
  message: string,
}

export const connectionStatusToString = (status: ConnectionStatus) => {
  switch (status) {
    case 0: return 'Connecting'
    case 1: return 'Connected'
    case 2: return 'Okay'
    case 3: return 'Closed'
    case 4: return 'Error'
  }
  return 'Unknown'
}

export interface ConnectionReport {
  status: ConnectionStatus,
  message: string,
}

export interface SentData {
  type: string,
  error?: string
}

export interface SentSong extends SentData {
  song: Song
}

export interface SentRecents extends SentData {
  recents: Song[]
}
