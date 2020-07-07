require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  refreshToken: process.env.REFRESH_TOKEN
});

export interface Song {
  artist: string,
  name: string
}

const refreshAuthToken = async() => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!spotifyApi.getAccessToken()) {
        const data = await spotifyApi.refreshAccessToken()
        spotifyApi.setAccessToken(data.body['access_token'])
      }
    } catch (error) {
      console.error('Could not get Spotify access token:', error)
    } finally {
      resolve()
    }
  })
}

const removeRemaster = (title: string): string => {
  return title.replace(/-\s+.*Remaster.*$/, "").trim()
}

const parseSong = (info: any): Song => {
  return {
    ...info,
    artist: info.item.artists.map((artist: any) => artist.name).join(' '),
    name: removeRemaster(info.item.name)
  }
}

let current: Song = null;

const getCurrentSong = async (): Promise<Song> => {
  try {
    const data = await spotifyApi.getMyCurrentPlaybackState({})

    if (data.body.item) {
      return parseSong(data.body)
    }

    return null

  } catch (error) {
    if (error.statusCode === 401) {
      // console.log('Reauthorizing')
      spotifyApi.setAccessToken(null)
      return current
    }

    throw error;
  }
}


export const getSong = async (): Promise<Song> => {
  await refreshAuthToken()

  const newSong = await getCurrentSong()
  if (current != newSong) {
    current = newSong
    return current
  }
}
