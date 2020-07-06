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
exports.getSong = void 0;
require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken: process.env.REFRESH_TOKEN
});
const refreshAuthToken = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!spotifyApi.getAccessToken()) {
                const data = yield spotifyApi.refreshAccessToken();
                spotifyApi.setAccessToken(data.body['access_token']);
            }
        }
        catch (error) {
            console.error('Could not get Spotify access token:', error);
        }
        finally {
            resolve();
        }
    }));
});
const removeRemaster = (title) => {
    return title.replace(/-\s+.*Remaster.*$/, "").trim();
};
const parseSong = (info) => {
    return {
        artist: info.item.artists.map((artist) => artist.name).join(' '),
        name: removeRemaster(info.item.name)
    };
};
let current = null;
const getCurrentSong = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield spotifyApi.getMyCurrentPlaybackState({});
        if (data.body.item) {
            return parseSong(data.body);
        }
        return null;
    }
    catch (error) {
        if (error.statusCode === 401) {
            // console.log('Reauthorizing')
            spotifyApi.setAccessToken(null);
        }
        else {
            console.error(error);
        }
        return current;
    }
});
exports.getSong = () => __awaiter(void 0, void 0, void 0, function* () {
    yield refreshAuthToken();
    const newSong = yield getCurrentSong();
    if (current != newSong) {
        current = newSong;
        return current;
    }
});
//# sourceMappingURL=current-song.js.map