const axios = require('axios');
const httpStatus = require('http-status');
const APIError = require('./APIError');
const { facebookAppId, facebookAccountKitAppSecret } = require('../config/config');

const ACCOUNT_KIT_VERSION = 'v1.3';
const ACCOUNT_KIT_ENDPOINT_ME = `https://graph.accountkit.com/${ACCOUNT_KIT_VERSION}/me`;
const ACCOUNT_KIT_ENDPOINT_TOKEN = `https://graph.accountkit.com/${ACCOUNT_KIT_VERSION}/access_token`;

/**
 * Verify code
 */
exports.verifyCode = async code => {
  try {
    const appAccessToken = ['AA', facebookAppId, facebookAccountKitAppSecret].join('|');
    // Verify app to get the access_token
    const appResponse = await axios.get(ACCOUNT_KIT_ENDPOINT_TOKEN, {
      params: {
        grant_type: 'authorization_code',
        code,
        access_token: appAccessToken,
      },
    });
    // Get FB user using the access_token
    const userResponse = await axios.get(ACCOUNT_KIT_ENDPOINT_ME, {
      params: {
        access_token: appResponse.data.access_token,
      },
    });
    return userResponse.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      throw new APIError({
        message: err.response.data.error.message,
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      });
    }
    throw err;
  }
};
