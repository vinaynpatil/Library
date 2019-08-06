const express = require('express');

const bookRouter = express.Router();

// Same instance from app.js is used
const sql = require('mssql');

function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
      (async function query() {
        const request = new sql.Request();
        const { recordset } = await request.query('select * from books');
        res.render('bookListView', {
          nav,
          title: 'Library',
          books: recordset
        });
      }());
    });

  // We use .all inside the router instead of app.use for the middleware
  bookRouter.route('/:id')
    .all((req, res, next) => {
      const { id } = req.params;
      (async function query() {
        const request = new sql.Request();
        // const result = await request.query(`select * from books where id=${id}`);
        const { recordset } = await request
          .input('id', sql.Int, id)
          .query('select * from books where id=@id');
        // Array destructuring - req.book = recordset[0]
        [req.book] = recordset;
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
