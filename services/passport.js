const passport = require('passport');
const keys = require('../config/keys');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const YoutubeV3Strategy = require('passport-youtube-v3').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    if (user.spotify) {
      user.spotify = {}; // don't send spotify data to client
    }
    if (user.youtube) {
      user.youtube = {}; // don't send spotify data to client
    }
    done(null, user);
  });
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: keys.spotifyClientID,
      clientSecret: keys.spotifyClientSecret,
      callbackURL: '/auth/spotify/callback',
      proxy: true,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log('SpotifyStrategy req.user: ', req.user);

      User.updateOne(
        {
          _id: req.user._id
        },
        {
          $set: {
            spotify: {
              spotifyId: profile.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              displayName: profile.displayName
            },
            lastUpdated: new Date()
          }
        }
      ).exec();
      return done(null, req.user);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebookClientId,
      clientSecret: keys.facebookClientSecret,
      callbackURL: '/auth/facebook/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('facebook profile: ', profile);
      const existingUser = await User.findOne({ facebookId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({ facebookId: profile.id }).save();
      done(null, user);
    }
  )
);

passport.use(
  new YoutubeV3Strategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/youtube/callback',
      proxy: true,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log('YoutubeStrategy req.user: ', req.user);
      console.log('profile: ', profile);

      User.updateOne(
        {
          _id: req.user._id
        },
        {
          $set: {
            youtube: {
              youtubeId: profile.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              displayName: profile.displayName,
              profileURL: profile.profileUrl
            },
            lastUpdated: new Date()
          }
        }
      ).exec();
      return done(null, req.user);
    }
  )
);
