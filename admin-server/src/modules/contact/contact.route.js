const express = require('express');
const ctrl = require('./contact.controller');

const router = express.Router();

/** POST /contacts/email - Send email confirm */
router.route('/email').post(ctrl.sendConfirmContact);

module.exports = router;
