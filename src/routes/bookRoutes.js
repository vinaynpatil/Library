const express = require('express');

const bookRouter = express.Router();

const bookController = require('../controllers/bookController');

function router(nav) {
  const { getIndex, getById, middleware } = bookController(nav);
  // Route protection
  bookRouter.use(middleware);
  bookRouter.route('/')
    .get(getIndex);

  // We use .all inside the router instead of app.use for the middleware
  bookRouter.route('/:id')
    .get(getById);

  return bookRouter;
}
module.exports = router;
