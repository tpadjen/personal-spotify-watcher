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
const WebSocket = require("ws");
const current_song_1 = require("./current-song");
const noop = () => { };
const port = parseInt(process.env.PORT || '8999');
const wss = new WebSocket.Server({ port: port });
let song = null;
wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.send(JSON.stringify({
        'connection': true,
        song: song
    }));
    ws.on('pong', () => {
        ws.isAlive = true;
    });
});
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
    const newSong = yield current_song_1.getSong();
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
console.log(`WebSocket listening on ws://localhost:${port}`);
//# sourceMappingURL=index.js.map