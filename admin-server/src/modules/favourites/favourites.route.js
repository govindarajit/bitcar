const express = require('express');
const favCtrl = require('./favourites.controller');
const { authorize } = require('../../middlewares/auth');
const { USER_ROLES } = require('../../config/vars');

const router = express.Router();

/** POST / Add Favourite Locations -   */
router.route('/').post(authorize(USER_ROLES.RIDER), favCtrl.addFavourites);

/**  Get Favourite Locations of Rider */
router.route('/').get(authorize(USER_ROLES.RIDER), favCtrl.getFavLocations);

module.exports = router;
