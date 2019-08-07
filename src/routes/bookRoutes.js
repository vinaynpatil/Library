const express = require('express');

const bookRouter = express.Router();

const { MongoClient, ObjectID } = require('mongodb');

const debug = require('debug')('app:bookRoutes');

function router(nav) {
  // Route protection
  bookRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  });
  bookRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to the server');
          const db = client.db(dbName);

          const col = await db.collection('books');

          const books = await col.find().toArray();

          res.render('bookListView', {
            nav,
            title: 'Library',
            books
          });
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });

  // We use .all inside the router instead of app.use for the middleware
  bookRouter.route('/:id')
    .all((req, res, next) => {
      const { id } = req.params;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function mongo() {

        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to the server');
          const db = client.db(dbName);

          const col = await db.collection('books');

          // Can't directly use {_id: id}, since _id is an object id and not a string id
          const book = await col.findOne({ _id: new ObjectID(id) });

          debug(book);

          req.book = book;
        } catch (err) {
          debug(err);
        }
        client.close();
        next();
      }());
    })
    .get((req, res) => {
      res.render('bookView', {
        nav,
        title: 'Library',
        book: req.book
      });
    });

  return bookRouter;
}

module.exports = router;
