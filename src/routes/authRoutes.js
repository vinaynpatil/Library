const express = require('express');

const { MongoClient } = require('mongodb');

const debug = require('debug')('app:authRoutes');

const authRouter = express.Router();

const passport = require('passport');

function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password } = req.body;

      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to the server');
          const db = client.db(dbName);

          const col = await db.collection('users');

          const user = { username, password };

          const results = await col.insertOne(user);

          req.login(results.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });

  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: 'Sign In'
      });
    })
    // We don't care about what you are posting, passport deals with it
    // (So we will be posting to passport)
    // Passport authenticate will deal with it
    // Here local can be changed to google or facebook based on the requirement
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));

  authRouter.route('/profile')
    .all((req, res, next) => {
      // Route protection
      // (Passport doesn't put the user object within the request if the user is not signed in)
      // Similarly roles can be used to filter the protection
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      res.send(req.user);
    });

  return authRouter;
}

module.exports = router;
