const express = require('express');
const authCtrl = require('./auth.controller');

const router = express.Router();

/** POST /auth - Login */
router.route('/').post(authCtrl.login);

/** POST /auth/refresh_token - Refresh token */
router.route('/refresh_token').post(authCtrl.refreshToken);

/** POST /auth/phone - Auth by phone number */
router.route('/phone').post(authCtrl.authByPhone);

/** POST /auth/forgotPassword - Sending email containing password resetting link */
router.route('/forgotPassword').post(authCtrl.forgotPassword);

/** POST /auth/setPassword - Setting new password for admin on the basis of token retrived from email url */
router.route('/setPassword').post(authCtrl.setPassword);

module.exports = router;
