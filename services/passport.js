const passport = require('passport');
const keys = require('../config/keys');
const SpotifyStrategy = require('passport-spotify').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: keys.spotifyClientID,
      clientSecret: keys.spotifyClientSecret,
      callbackURL: '/auth/spotify/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(JSON.stringify(profile, null, 4));
      console.log('accessToken' + accessToken);
      console.log('refreshToken' + refreshToken);
      console.log('profile username:' + profile.username);
      console.log('profile country :' + profile.country);
      console.log('profile id:' + profile.id);
      const existingUser = await User.findOne({ spotifyId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({
        spotifyId: profile.id,
        spotifyAccessToken: accessToken,
        spotifyRefreshToken: refreshToken
      }).save();
      console.log('user: ' + user);
      done(null, user);

      // User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
      //   return done(err, user);
      // });
    }
  )
);
