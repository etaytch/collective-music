const passport = require('passport');

module.exports = app => {
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['public_profile', 'email']
    })
  );

  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook'),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get(
    '/auth/spotify',
    passport.authenticate('spotify', {
      scope: ['user-read-email', 'user-read-private', 'playlist-read-private'],
      showDialog: true
    }),
    function(res, req) {}
  );

  app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify'),
    (req, res) => {
      res.redirect('/profile');
    }
  );

  app.get(
    '/auth/youtube',
    passport.authenticate('youtube', {
      scope: ['https://www.googleapis.com/auth/youtube.readonly'],
      showDialog: true
    }),
    function(res, req) {}
  );

  app.get(
    '/auth/youtube/callback',
    passport.authenticate('youtube'),
    (req, res) => {
      res.redirect('/profile');
    }
  );
};
