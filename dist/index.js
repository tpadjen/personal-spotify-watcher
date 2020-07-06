"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const logger_1 = require("./logger");
const app = express();
const noop = () => { };
const server = http.createServer(app);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static('dist'));
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('message', (body) => {
        const data = JSON.parse(body);
        console.log(`received: ${data.message}`);
        ws.send(`Hello, you sent -> ${data.message}`);
    });
    ws.send(JSON.stringify({
        'connection': true,
        song: song
    }));
    ws.on('pong', () => {
        ws.isAlive = true;
    });
});
let song = null;
let sent = false;
const sendSong = (s) => {
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify({
            song: s
        }));
    });
};
const songChanged = (newSong, oldSong) => {
    if (!newSong && !song)
        return false;
    if (newSong && !song)
        return true;
    if (!newSong && song)
        return true;
    return newSong && song && (newSong.artist !== song.artist || newSong.name !== song.name);
};
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const newSong = yield logger_1.getSong();
    if (songChanged(newSong, song)) {
        song = newSong;
        sendSong(song);
    }
}), 2000);
const pingInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive)
            return ws.terminate();
        ws.isAlive = false;
        ws.ping(noop);
    });
}, 10000);
app.get('/', (req, res) => {
    res.render('index.ejs');
});
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
//# sourceMappingURL=index.js.map