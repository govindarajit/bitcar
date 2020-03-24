const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('bitcar:index');
const { mongoUri, env } = require('./config');

// Make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// Plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// Connection events
mongoose.connection.on('connected', () => {
  console.info('Mongo Database connected');
});
mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});
mongoose.connection.on('disconnected', () => {
  console.info('Mongo Database disconnected');
});

// Print mongoose logs in DEVELOPMENT mode
if (env === 'development') {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// Register models
require('../modules/user/user.model');
require('../modules/branch/branch.model');
require('../modules/authentication/refreshToken.model');

// Connect to MongoDB
exports.connect = () => {
  mongoose.connect(mongoUri, {
    autoReconnect: true,
    keepAlive: 1,
    // DeprecationWarning: collection.ensureIndex is deprecated.
    // Use createIndexes instead.
    useCreateIndex: true,
    // DeprecationWarning: current URL string parser is deprecated,
    // and will be removed in a future version. To use the new parser,
    // pass option { useNewUrlParser: true } to MongoClient.connect.
    useNewUrlParser: true,
  });
  return mongoose.connection;
};
