const passport = require('passport');

const { Strategy } = require('passport-local');

const { MongoClient } = require('mongodb');

const debug = require('debug')('app: local.strategy');

module.exports = function localStrategy() {
  // How we deal with the username and password and how do we identify it as a user
  // So this strategy deals with pull down th username and password from the body
  // Then it calls a function by passing in username, password and the done call back
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function authenticate() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to the server');
        const db = client.db(dbName);
        const col = await db.collection('users');
        const user = await col.findOne({ username });
        if (user && user.password === password) {
          done(null, user);
        } else {
          done(null);
        }
      } catch (err) {
        debug(err);
      }
      client.close();
    }());
  }));
};
