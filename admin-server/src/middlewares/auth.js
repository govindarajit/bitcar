const httpStatus = require('http-status');
const passport = require('passport');
const User = require('mongoose').model('User');
const APIError = require('../helpers/APIError');

/**
 * Validate JWT and set req.user
 */
exports.authorize = (roles = User.roles) => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    const error = err || info;
    const logIn = Promise.promisify(req.logIn);
    try {
      if (error || !user) {
        throw error;
      }
      await logIn(user, { session: false });
    } catch (e) {
      const apiError = new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
      });
      return next(apiError);
    }
    // TODO: Handle roles
    if (!roles.includes(user.role)) {
      console.info('Wrong role!');
    }
    req.me = user;
    return next();
  })(req, res, next);
};
