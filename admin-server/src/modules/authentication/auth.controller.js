const httpStatus = require('http-status');
const User = require('mongoose').model('User');
const RefreshToken = require('mongoose').model('RefreshToken');
const moment = require('moment-timezone');
const APIError = require('../../helpers/APIError');
const { verifyCode } = require('../../helpers/accountKit');
const { sendEmail } = require('../../helpers/email');
const { accessTokenExpiry } = require('../../config/config');

function makeid() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 28; i += 1) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

/**
 * Generate formated tokens
 */
const generateTokenResponse = async (user, accessToken) => {
  try {
    const refreshToken = await RefreshToken.generate(user);
    return {
      token_type: 'Bearer',
      expires_in: moment().add(accessTokenExpiry, 'minutes'),
      access_token: accessToken,
      refresh_token: refreshToken.token,
    };
  } catch (err) {
    throw err;
  }
};
exports.generateTokens = generateTokenResponse;

/**
 * POST /auth
 * Authentication - Login
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const tokens = await generateTokenResponse(user, accessToken);
    res.status(httpStatus.OK).json({
      user: user.transform(),
      tokens,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /auth/refresh_token
 * Authentication - Refresh token
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const existingRefreshToken = await RefreshToken.findOneAndRemove({
      user_email: req.body.email,
      token: req.body.refresh_token,
    });
    const { user, accessToken } = await User.findAndGenerateToken({
      email: req.body.email,
      refreshObject: existingRefreshToken,
    });
    const tokens = await generateTokenResponse(user, accessToken);
    res.status(httpStatus.OK).json(tokens);
  } catch (err) {
    return next(err);
  }
};

/**
 * Login by phone number
 */
exports.authByPhone = async (req, res, next) => {
  try {
    const userVerified = await verifyCode(req.body.account_kit_code);
    const user = await User.get({ phone_number: userVerified.phone.number });
    if (!user) {
      const error = new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    // Generate tokens and response
    const tokens = await generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED).json({
      user: user.transform([
        'id',
        'branch',
        'branch_city',
        'email',
        'phone_number',
        'name',
        'documents',
        'invite_code',
      ]),
      tokens,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Saving token and sending enail for forgot password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    // Find existing user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send(httpStatus.BAD_REQUEST);
    }
    if (user.length === 0) {
      res.status(404).send({ message: 'NotFound' });
      return;
    }
    const token = makeid();
    user.passwordToken = token;
    // user.resetPasswordExpires = Date.now() + 1800000; // 30 min
    user.save();
    // Send email
    sendEmail({
      sender: {
        Email: 'account@gobitcar.com',
        Name: '[BitCar] Marketing Team',
      },
      recipients: [
        {
          Email: user.email,
          Name: user.name.first_name,
        },
      ],
      templateId: 597558,
      subject: 'Password resent link',
      variables: {
        referralCode: user.passwordToken,
        referralLink: `http://localhost:8080/?#/setPassword?ref=${user.passwordToken}`,
      },
    }).then();
    res.send(httpStatus.CREATED);
  } catch (err) {
    return next(err);
  }
};

/**
 * setting password for admin
 */

exports.setPassword = async (req, res, next) => {
  try {
    // Find existing user
    const user = await User.findOne({ passwordToken: req.body.passwordToken });
    if (!user) {
      return res.status(404).send(httpStatus.BAD_REQUEST);
    }
    if (user.length === 0) {
      res.status(404).send({ message: 'NotFound' });
      return;
    }
    user.password = req.body.password;
    user.save();
    res.send(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};
