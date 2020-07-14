# Song Notifier

## Setup

After npm init run
```
$ npm run initialize
```
to setup the recents file

Also copy `env.template` to `env.production` and add your Spotify api info.

## Run

```
// development

  // both server and client together in one process, both watch for changes
  $ npm run dev

  // or two separate processes in different terminals
  $ npm run start:client:dev
  $ npm run start:server:dev


// production

  $ npm run build
  $ npm start
```

Open `http://localhost:8080`
