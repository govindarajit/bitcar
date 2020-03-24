const express = require('express');
const branchCtrl = require('./branch.controller');

const router = express.Router();

/** POST /branches - Get list of branches */
router.route('/').get(branchCtrl.getBranches);

module.exports = router;
