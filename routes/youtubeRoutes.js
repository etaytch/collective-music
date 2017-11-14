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

  function getChannels(youtubeApi) {
    return new Promise(function(resolve, reject) {
      youtubeApi.channels.list(
        {
          part: 'id,snippet',
          mine: true,
          headers: {}
        },
        function(err, data, response) {
          if (err !== null) return reject(err);
          resolve(data);
        }
      );
    });
  }

  app.get('/api/youtube/playlists', requireLogin, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });

    var youtubeApi = initYoutubeApiClient(
      user.youtube.accessToken,
      user.youtube.refreshToken
    );

    try {
      var channels;
      try {
        channels = await getChannels(youtubeApi);
        console.log('channels: ', channels);
      } catch (err) {
        handleError(user, "unable to get user's channel!", err, res);
        return;
      }

      // For now we'll process only the first channel
      const firstChannelId = channels.items[0].id;
      var playlists;
      try {
        playlists = await getPlaylists(youtubeApi, firstChannelId);
        console.log('playlists: ', playlists);
      } catch (err) {
        handleError(user, "unable to get user's channel's playlist!", err, res);
        return;
      }

      var playlistsWithTracks;
      try {
        playlistsWithTracks = await getAllPlaylistsTracks(
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
        res.send(result);
      } catch (err) {
        handleError(
          user,
          "unable to get user's channel's playlist's tracks!",
          err,
          res
        );
        return;
      }
      console.log('out /api/spotify/playlists');
    } catch (err) {
      console.log('error getting playlists: ', err);
    }
  });

  function getPlaylists(youtubeApi, channelId) {
    return new Promise(function(resolve, reject) {
      youtubeApi.playlists.list(
        {
          part: 'id,snippet',
          channelId: channelId, //'UCSUojj6o5X27tPZOF4Ypoug',
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

  function handleError(user, log, err, res) {
    console.log(log);
    const result = {
      user: {
        displayName: user.youtube.displayName,
        profileURL: user.youtube.youtubeId
      },
      err: err
    };
    res.send(result);
  }
};
