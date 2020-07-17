const path = require('path')
const envPath = path.join(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`)
require('dotenv').config({ path: envPath })

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI

const express = require('express')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const request = require('request')
const opn = require('opn')
const { generateRandomString } = require('./random-string')


const app = express()

app.use(cookieParser())
app.use(bodyParser.json())

const stateKey = 'spotify_auth_state'
app.set('port', 5000)

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
  next();
})

app.get('/login', (req, res) => {
  const state = generateRandomString(16)
  res.cookie(stateKey, state);

  console.log(client_id)

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: 'user-read-playback-state user-read-recently-played',
      redirect_uri: redirect_uri,
      state: state
    }))
})

app.get('/callback', (req, res) => {
  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    console.log('State mismatch')
    console.log(res)
    process.exit(0);
  } else {
    console.log('Code:', code);
    res.clearCookie(stateKey)
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`
      },
      json: true
    }

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('Success!');
        const tokens = {
          refresh_token: body.refresh_token,
          access_token: body.access_token,
          expires_in: body.expires_in
        }
        console.log(tokens)
        res.set('Content-Type', 'text/html');
        res.send(new Buffer(`<h2>Your Refresh Token has been written to the console. You may close this page.</h2>`));
      } else {
        console.error(error)
        res.set('Content-Type', 'text/html');
        res.send(new Buffer('<h2>Could not get access token. Check your console for details.</h2>'));
      }
      process.exit(0)
    })
  }
})

app.listen(app.get('port'), () => {
  console.log('Opening spotify authorization page, grant access to get your refresh token')
  opn(`http://localhost:${app.get('port')}/login`)
})
