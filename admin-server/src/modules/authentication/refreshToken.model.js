const mongoose = require('mongoose');
const moment = require('moment-timezone');
const crypto = require('crypto');
const { refreshTokenExpiry } = require('../../config/config');

const RefreshToken = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user_email: {
      type: 'String',
      ref: 'User',
      required: true,
    },
    expires: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

/**
 * Statics
 */
RefreshToken.statics = {
  /** Generate a refresh token and saves it into the database */
  async generate(user) {
    try {
      const token = await new this();
      token.user_id = user._id;
      token.user_email = user.email;
      token.token = `${user._id}.${crypto.randomBytes(40).toString('hex')}`;
      token.expires = moment()
        .add(refreshTokenExpiry, 'minutes')
        .toDate();
      return await token.save();
    } catch (err) {
      throw err;
    }
  },
};

module.exports = mongoose.model('RefreshToken', RefreshToken);
