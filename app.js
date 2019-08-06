const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const app = express();
// process.env is a big object of all the things passed in
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));

// Saying I am setting up a static directory that I am going to use for static files (CSS and JS)
// This means everything in public is accessible to the outside world
app.use(express.static(path.join(__dirname, '/public/')));

// If you can't find the CSS/ JS file you are looking
// for in the public directory then look in the nodemodules
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css/')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js/')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));

// Letting express know that we will be using a template engine
app.set('views', './src/views/');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});
