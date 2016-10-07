var express = require('express');
var app = express();
var config = require('./config/config')
var logger = require('./util/logger');
var api = require('./api/api');
var auth = require('./auth/routes');

// db.url is different depending on NODE_ENV
require('mongoose').connect(config.db.url);


if (config.seed) {
  require('./util/seed');
}

// Setup the app middleware
require('./middleware/middleware')(app);

// Setup the api
app.use('/api', api);
app.use('/auth', auth);

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
    return;
  }
  logger.error(err.stack);
  res.status(500).send(err.message);
});

// export the app for testing
module.exports = app;