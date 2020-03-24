const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('mongoose').model('User');
const { jwtSecret } = require('./config');

/**
 * Passport JWT
 */
exports.jwt = new JwtStrategy(
  {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  },
  async (payload, done) => {
    try {
      const user = await User.findOne({ _id: payload.sub });
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  },
);
