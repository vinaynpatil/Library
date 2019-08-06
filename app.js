const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

const app = express();
// process.env is a big object of all the things passed in
const port = process.env.PORT || 3000;

const config = {
  user: 'mylibrary',
  password: 'Vinay@123',
  server: 'mynewlibraryserver.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'mylibrary',

  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};

// Returns a promise
sql.connect(config).catch(err => debug(err));

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' }
];

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
app.set('view engine', 'ejs');

const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter);

app.get('/', (req, res) => {
  res.render('index', {
    nav,
    title: 'Library'
  });
});

app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});
