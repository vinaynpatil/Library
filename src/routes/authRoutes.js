const express = require('express');

const { MongoClient } = require('mongodb');

const debug = require('debug')('app:authRoutes');

const authRouter = express.Router();

function router() {
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

  authRouter.route('/profile')
    .get((req, res) => {
      res.send(req.user);
    });

  return authRouter;
}

module.exports = router;
