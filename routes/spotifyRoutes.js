const _ = require('lodash');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const keys = require('../config/keys');
const SpotifyWebApi = require('spotify-web-api-node');

// module.exports = app => {
//   app.get('/api/spotify/playlists', requireLogin, (req, res) => {
//     console.log('in /api/spotify/playlists');
//     var spotifyApi = new SpotifyWebApi({
//       clientId: keys.spotifyClientID,
//       clientSecret: keys.spotifyClientSecret
//     });
//
//     // Retrieve an access token
//     spotifyApi.clientCredentialsGrant().then(
//       function(data) {
//         console.log('The access token expires in ' + data.body['expires_in']);
//         console.log('The access token is ' + data.body['access_token']);
//
//         // Save the access token so that it's used in future calls
//         spotifyApi.setAccessToken(data.body['access_token']);
//
//         console.log('req.user.spotifyId: ' + req.user.spotifyId);
//         // Get a user's playlists
//         spotifyApi.getUserPlaylists(req.user.spotifyId).then(
//           function(data) {
//             console.log('Retrieved playlists', data.body);
//           },
//           function(err) {
//             console.log('Something went wrong!', err);
//           }
//         );
//       },
//       function(err) {
//         console.log(
//           'Something went wrong when retrieving an access token',
//           err.message
//         );
//       }
//     );
//
//     res.send({});
//   });
// };

module.exports = app => {
  app.get('/api/spotify/playlists', requireLogin, async (req, res) => {
    console.log('in /api/spotify/playlists');
    var spotifyApi = new SpotifyWebApi({
      clientId: keys.spotifyClientID,
      clientSecret: keys.spotifyClientSecret
    });

    // Retrieve an access token
    // const data = await spotifyApi.clientCredentialsGrant();

    // console.log('The access token expires in ' + data.body['expires_in']);
    // console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    // spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setAccessToken(req.user.spotifyAccessToken);

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
    // res.send({});
  });
};
