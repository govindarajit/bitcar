const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const rfs = require('rotating-file-stream');
const passport = require('passport');
const strategies = require('./passport');
const routes = require('../v1.route');
const { env } = require('./config');
const error = require('../middlewares/error');

const app = express();

// Logging (Development: console, Uat/Staging/Production: file)
if (env === 'development') {
  app.use(morgan('dev'));
} else {
  // Create a rotating write stream
  const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: './logs',
  });
  app.use(morgan('combined', { stream: accessLogStream }));
}

// Parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// Secure apps by setting various HTTP headers
app.use(helmet());

// Enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);

// Mount API v1 routes
app.use('/v1', routes);

// If error is not an instanceOf APIError, convert it.
app.use(error.converter);

// Catch 404 and forward to error handler
app.use(error.notFound);

// Error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
