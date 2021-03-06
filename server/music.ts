import * as fs from 'fs'
import SpotifyWebApi = require('spotify-web-api-node')
import config from './config'


const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  refreshToken: process.env.REFRESH_TOKEN
})

export interface Song {
  artist: string,
  name: string,
  item: {
    id: string
  },
  'progress_ms': number,
  'is_playing': boolean,
}

export interface Artist {
  name: string
}

const refreshAuthToken = async () => {
  try {
    if (!spotifyApi.getAccessToken()) {
      const data = await spotifyApi.refreshAccessToken()
      spotifyApi.setAccessToken(data.body['access_token'])
    }
  } catch (error) {
    console.error('Could not get Spotify access token:', error)
  }
}

const removeExtraSongInfo = (title: string): string => {
  // Fix Philharmonic nonsense
  if (title.match((/(-\s+From.*$)$/))) return title.trim()
  if (title.match((/(-\s+Theme.*$)$/))) return title.trim()

  return title.replace(/-\s+.*$/, '').trim()
}

const cleanAlbum = (album: string): string => {
  let cleaner = album.trim()

  const remove_terms = ['Deluxe', 'Remaster', 'Re-Master', 'Edition']
  remove_terms.forEach(term => {
    const regex = new RegExp(`\\(.*${term}.*\\)$`)
    cleaner = cleaner.replace(regex, '')
  })

  return cleaner.trim()
}

const findArtist = (artists: Array<Artist>): string => {
  // find the actual composer for the Philharmonic album
  const spot = artists.findIndex(artist => artist.name.match(/Royal Philharmonic/))
  if (spot > 0) {
    return artists[spot - 1].name.trim()
  }

  return artists.map(artist => artist.name).join(' ')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseSong = (info: any): Song => {
  const song = {
    ...info,
    artist: findArtist(info.item.artists),
    name: removeExtraSongInfo(info.item.name)
  }

  song.item.album.name = cleanAlbum(song.item.album.name)
  return song
}

let current: Song = null

const getCurrentSong = async (): Promise<Song> => {
  try {
    const data = await spotifyApi.getMyCurrentPlaybackState({})

    if (data.body.item) {
      return parseSong(data.body)
    }

    // no song
    const recents = loadRecents(config.RECENTS_FILE)
    if (recents && recents.length > 0) {
      const last = recents[0]
      last.is_playing = false
      return last
    }
    return null
  } catch (error) {
    if (error.statusCode === 401) {
      // console.log('Reauthorizing')
      spotifyApi.setAccessToken(null)
      return current
    }

    throw error
  }
}


export const getSong = async (): Promise<Song> => {
  await refreshAuthToken()

  const newSong = await getCurrentSong()
  if (current !== newSong) {
    // console.log(newSong.name)
    current = newSong
    return current
  }
}

export const getRecentlyPlayed = async (): Promise<Song[]> => {
  await refreshAuthToken()

  const recent = await spotifyApi.getMyRecentlyPlayedTracks()
  return recent
}

export const loadRecents = (recents_file: string): Array<Song> => {
  let recents: Array<Song> = []

  if (!fs.existsSync(recents_file)) {
    fs.closeSync(fs.openSync(recents_file, 'w'))
  } else {
    try {
      recents = JSON.parse(fs.readFileSync(recents_file, 'utf-8'))
    // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return recents
}

export const saveRecents = (recents_file: string, recently_played: Array<Song>): void => {
  fs.writeFile(recents_file, JSON.stringify(recently_played), 'utf8', () => {
    // console.log("Recents saved");
  })
}
