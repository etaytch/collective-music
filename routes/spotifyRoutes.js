const _ = require('lodash');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const keys = require('../config/keys');
const SpotifyWebApi = require('spotify-web-api-node');

async function getAuthenticatedClient(user) {
  var spotifyApi = new SpotifyWebApi({
    clientId: keys.spotifyClientID,
    clientSecret: keys.spotifyClientSecret
  });

  console.log('user.accessToken: ', user.spotifyAccessToken);
  console.log('user.refreshToken: ', user.spotifyRefreshToken);

  spotifyApi.setRefreshToken(user.spotifyRefreshToken);
  spotifyApi.setAccessToken(user.spotifyAccessToken);

  try {
    const refreshedData = await spotifyApi.refreshAccessToken();
    console.log('Refreshed token.');

    console.log('old accessToken: ', user.spotifyAccessToken);
    console.log('new accessToken: ', refreshedData.body.access_token);

    user.spotifyAccessToken = refreshedData.body.access_token;
    user.save((err, user) => {
      if (err) {
        console.log('error saving user: ', user);
      } else {
        console.log('successfully saving user: ', user);
      }
    });
  } catch (err) {
    console.log('something went wrong', err);
  }

  console.log('im here');
  return spotifyApi;
}

module.exports = async app => {
  app.get('/api/spotify/playlists', requireLogin, async (req, res) => {
    console.log('in /api/spotify/playlists');

    var spotifyApi = await getAuthenticatedClient(req.user);

    // Get a user's playlists
    const playlists = await spotifyApi.getUserPlaylists(req.user.spotifyId);
    console.log(
      'Retrieved playlists, playlist #1 id: ',
      playlists.body.items[0].id
    );

    const playlistTracks = await spotifyApi.getPlaylistTracks(
      req.user.spotifyId,
      playlists.body.items[0].id
    );

    const playlistInfo = {
      id: playlists.body.items[0].id,
      name: playlists.body.items[0].name
    };

    console.log(
      'playlistTracks details: ' + JSON.stringify(playlistTracks.body, null, 4)
    );

    const tracks = _.map(playlistTracks.body.items, plItem => {
      return {
        artistId: plItem.track.artists[0].id,
        artistType: plItem.track.artists[0].type,
        artistName: plItem.track.artists[0].name,

        albumId: plItem.track.album.id,
        albumType: plItem.track.album.type,
        albumName: plItem.track.album.name,

        trackId: plItem.track.id,
        trackName: plItem.track.name,
        trackType: plItem.track.type,
        trackNumber: plItem.track.track_number
      };
    });

    res.send([
      {
        playlistInfo: playlistInfo,
        tracks: tracks
      }
    ]);
  });
};
