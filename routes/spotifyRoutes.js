const _ = require('lodash');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const keys = require('../config/keys');
const SpotifyWebApi = require('spotify-web-api-node');
const User = mongoose.model('users');

async function getAuthenticatedClient(user) {
  var spotifyApi = new SpotifyWebApi({
    clientId: keys.spotifyClientID,
    clientSecret: keys.spotifyClientSecret
  });

  console.log('user.accessToken: ', user.spotify.accessToken);
  console.log('user.refreshToken: ', user.spotify.refreshToken);

  spotifyApi.setAccessToken(user.spotify.accessToken);
  spotifyApi.setRefreshToken(user.spotify.refreshToken);

  try {
    const refreshedData = await spotifyApi.refreshAccessToken();
    console.log('Refreshed token.');

    console.log('old accessToken: ', user.spotify.accessToken);
    console.log('new accessToken: ', refreshedData.body.access_token);

    user.spotify.accessToken = refreshedData.body.access_token;
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
    console.log('in /api/spotify/playlists, req.user: ', req.user);

    const user = await User.findOne({ _id: req.user._id });
    console.log('user: ', user);
    // var user = req.user;
    var spotifyApi = await getAuthenticatedClient(user);

    // Get a user's playlists
    var playlists;
    try {
      console.log('user.spotify.spotifyId: ', user.spotify.spotifyId);
      playlists = await spotifyApi.getUserPlaylists(user.spotify.spotifyId);
      console.log('playlists: ', playlists);
    } catch (err) {
      console.log('unable to fetch playlists, err: ', err);
    }

    const playlistsWithTracks = await getAllPlaylistsTracks(
      spotifyApi,
      user.spotify.spotifyId,
      playlists.body.items
    );

    const result = {
      user: {
        displayName: user.spotify.displayName,
        profileURL: user.spotify.profileURL
      },
      playlists: playlistsWithTracks
    };
    console.log('out /api/spotify/playlists');
    res.send(result);
  });
};
