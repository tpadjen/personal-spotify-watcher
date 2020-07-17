import * as path from 'path'
import * as dotenv from 'dotenv'

const envPath = path.join(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`)
dotenv.config({ path: envPath })
const PRODUCTION = process.env.NODE_ENV === 'production'
const PORT = parseInt(process.env.PORT)
const SOURCE_DIR = path.join(__dirname, PRODUCTION ? 'client' : '../../client')


import * as express from 'express'
const server = express()
  .use(express.static(SOURCE_DIR))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

import startSongSocket from './song-socket'
startSongSocket(server)
