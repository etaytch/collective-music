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

  return spotifyApi;
}

async function getAllPlaylistsTracks(spotifyApi, spotifyId, playlists) {
  try {
    console.log('playlists length: ', playlists.length);
    var allPlaylists = await Promise.all(
      _.map(playlists, async playlist => {
        const playlistInfo = {
          id: playlist.id,
          name: playlist.name
        };
        var playlistTracks;
        try {
          playlistTracks = await spotifyApi.getPlaylistTracks(
            spotifyId,
            playlist.id
          );
        } catch (err) {
          console.log(`error with playlistId: ${playlist.id}. Error: ${err}`);
          return;
        }
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

        var result = {
          playlistInfo: playlistInfo,
          tracks: tracks
        };

        return result;
      })
    );
  } catch (err) {
    console.log('err: ', err);
  }

  console.log('allPlaylists: ' + JSON.stringify(allPlaylists, null, 4));
  return _.filter(allPlaylists, playlist => playlist);
}

module.exports = async app => {
  app.get('/api/spotify/playlists', requireLogin, async (req, res) => {
    console.log('in /api/spotify/playlists');
    var user = req.user;
    var spotifyApi = await getAuthenticatedClient(req.user);

    // Get a user's playlists
    const playlists = await spotifyApi.getUserPlaylists(user.spotifyId);

    const result = await getAllPlaylistsTracks(
      spotifyApi,
      user.spotifyId,
      playlists.body.items
    );

    res.send(result);
  });
};
