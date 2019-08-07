const passport = require('passport');


module.exports = function passportConfig(app) {
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

  require('./strategies/local.strategy');
};
