const express = require('express');
const validate = require('express-validation');
const ctrl = require('./search.controller');
const validation = require('./search.validation');
const { authorize } = require('../../middlewares/auth');
const { USER_ROLES } = require('../../config/vars');

const router = express.Router();

/** POST /search - Search */
router.route('/').get(validate(validation.searchNormal), authorize(USER_ROLES.ADMIN), ctrl.searchNormal);

module.exports = router;
