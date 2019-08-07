const passport = require('passport');

const { Strategy } = require('passport-local');

module.exports = function localStrategy() {
  // How we deal with the username and password and how do we identify it as a user
  // So this strategy deals with pull down th username and password from the body
  // Then it calls a function by passing in username, password and the done call back
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {
    const user = {
      username, password
    };
    done(null, user);
  }));
};
