const passport = require('passport');

require('./strategies/local.strategy')();

module.exports = function passportConfig(app) {
  // This creates things like login on the request
  app.use(passport.initialize());
  app.use(passport.session());

  // Stores the user in session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Retrieves the user from session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
