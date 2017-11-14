const _ = require('lodash');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');
const SpotifyWebApi = require('spotify-web-api-node');
const User = mongoose.model('users');
const google = require('googleapis');

module.exports = async app => {
  function initYoutubeApiClient(accessToken, refreshToken) {
    var OAuth2 = google.auth.OAuth2;
    var oauth2Client = new OAuth2(keys.googleClientID, keys.googleClientSecret);
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    return google.youtube({
      version: 'v3',
      auth: oauth2Client
    });
  }

  app.get('/api/youtube/playlists', requireLogin, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });

    var youtubeApi = initYoutubeApiClient(
      user.youtube.accessToken,
      user.youtube.refreshToken
    );

    try {
      const playlists = await getPlaylists(youtubeApi);
      console.log('playlists: ', playlists);

      const playlistsWithTracks = await getAllPlaylistsTracks(
        youtubeApi,
        playlists
      );

      console.log('playlistsWithTracks: ', playlistsWithTracks);

      const result = {
        user: {
          displayName: user.youtube.displayName,
          profileURL: user.youtube.youtubeId
        },
        playlists: playlistsWithTracks
      };
      console.log('out /api/spotify/playlists');
      res.send(result);
    } catch (err) {
      console.log('error getting playlists: ', err);
    }
  });

  function getPlaylists(youtubeApi) {
    return new Promise(function(resolve, reject) {
      youtubeApi.playlists.list(
        {
          part: 'id,snippet',
          channelId: 'UCSUojj6o5X27tPZOF4Ypoug',
          headers: {}
        },
        function(err, data, response) {
          if (err !== null) return reject(err);
          resolve(data);
        }
      );
    });
  }

  async function getAllPlaylistsTracks(youtubeApi, playlists) {
    console.log(playlists.items[0].id);
    console.log(playlists.items[0].snippet.title);
    var allPlaylists = await Promise.all(
      _.map(playlists.items, async playlist => {
        const playlistInfo = {
          id: playlist.id,
          name: playlist.snippet.title
        };
        console.log(playlistInfo);

        const playlistItems = await getPlaylistTracks(youtubeApi, playlist.id);

        const tracks = await Promise.all(
          _.map(playlistItems.items, async item => {
            console.log(item.snippet);
            return {
              trackName: item.snippet.title,
              trackNumber: item.snippet.position,
              trackURL: item.snippet.resourceId.videoId
            };
          })
        );

        var result = {
          playlistInfo: playlistInfo,
          tracks: tracks
        };

        return result;
      })
    );
    console.log('allPlaylists: ' + JSON.stringify(allPlaylists, null, 4));
    // return _.filter(allPlaylists, playlist => playlist);
    return allPlaylists;
  }

  async function getPlaylistTracks(youtubeApi, playlistId) {
    return new Promise(function(resolve, reject) {
      youtubeApi.playlistItems.list(
        {
          part: 'id,snippet',
          playlistId: playlistId,
          headers: {}
        },
        function(err, data, response) {
          if (err !== null) return reject(err);
          resolve(data);
        }
      );
    });
  }

  var scopes = ['https://www.googleapis.com/auth/youtube'];
};
