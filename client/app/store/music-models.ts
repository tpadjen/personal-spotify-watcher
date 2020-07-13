

export interface Album {
  "album_type": string,
  "artists": [],
  "available_markets": [],
  "external_urls": {
    "spotify": string
  },
  "href": string,
  "id": string,
  "images": Array<{
    height: number,
    url: string,
    width: number
  }>,
  "name": string,
  "release_date": string,
  "release_date_precision": string,
  "total_tracks": number,
  "type": string,
  "uri": string
}

export interface Device {
  id: string,
  "is_active": boolean,
  "is_private_session": boolean,
  "is_restricted": boolean,
  "name": string,
  "type": string,
  "volume_percent": number
}

export interface Artist {
  "external_urls": {
    "spotify": string
  },
  "href": string,
  "id": string,
  "name": string,
  "type": string,
  "uri": string
}

export interface Song {
  actions?: {},
  artist: string,
  context?: {},
  "currently_playing_type": string,
  device: Device,
  "is_playing": true,
  "item": {
    "album": Album,
    "artists": Array<Artist>,
    "available_markets": Array<string>,
    "disc_number": number,
    "duration_ms": number,
    "explicit": false,
    "external_ids": {},
    "external_urls": {
      "spotify": string
    },
    "href": string,
    id: string,
    "is_local": false,
    name: string,
    popularity: number,
    "track_number": number,
    type: string,
    uri: string
  },
  name: string,
  "progress_ms": number,
  "repeat_state": string,
  "shuffle_state": false,
  "timestamp": number
}
