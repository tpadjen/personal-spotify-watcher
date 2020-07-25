import * as path from 'path'


export default {
  RECENTS_FILE: path.join(__dirname, '../data/recents.json'),
  RECENTS_LIMIT: 100,
  SONG_SHOULD_COUNT_TIME: 15 * 1000, // 15 seconds before countint song as a recent
  CHANNELS: ['current-song', 'recently-played', 'error'],
}
