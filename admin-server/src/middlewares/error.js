const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const APIError = require('../helpers/APIError');
const { env } = require('../config/config');

/**
 * Error handler. Send stacktrace only during development
 */
// eslint-disable-next-line no-unused-vars
const handler = (err, req, res, next) => {
  const response = {
    message: err.isPublic ? err.message : httpStatus[err.status],
    code: err.code,
  };
  if (env === 'development') {
    response.stack = err.stack;
  }
  res.status(err.status).json(response);
};

/**
 * If error is not an instanceOf APIError, convert it.
 */
const converter = (err, req, res, next) => {
  // Handle validation errors
  if (err instanceof expressValidation.ValidationError) {
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError({
      message: unifiedErrorMessage,
      status: err.status,
      isPublic: true,
    });
    return next(error);
  }
  // Convert other errors
  if (!(err instanceof APIError)) {
    const apiError = new APIError({
      message: err.message,
      status: err.status,
      isPublic: err.isPublic,
    });
    return next(apiError);
  }
  return next(err);
};

/**
 * Catch 404 and forward to error handler
 */
const notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
    code: 1111,
    isPublic: true,
  });
  return next(err);
};

module.exports = {
  converter,
  notFound,
  handler,
};
