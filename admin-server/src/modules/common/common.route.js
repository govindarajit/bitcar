const express = require('express');
const commomCtrl = require('./common.controller');

const router = express.Router();

/**  Get list of countries */
router.route('/getCountries').get(commomCtrl.getCountries);

/**  Get list of cities belong to a country */
router.route('/getCities').post(commomCtrl.getCities);

module.exports = router;
