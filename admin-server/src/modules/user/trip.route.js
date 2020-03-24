const express = require('express');
const tripCtrl = require('./trip.controller');
const { authorize } = require('../../middlewares/auth');
const { USER_ROLES } = require('../../config/vars');

const router = express.Router();

/**  Get list of trips going on now */
router.route('/getNowTrips').get(tripCtrl.getNowTrips);

/**  Get list of trips which are history */
router.route('/getHistoryTrips').get(tripCtrl.getHistoryTrips);

/**  Get list of trips which are booked for later */
router.route('/getLaterTrips').get(tripCtrl.getLaterTrips);

/**  Get list of trips Info */
router.route('/getTripInfo').post(tripCtrl.getTripInfo);

/** POST / Driver Trip History -   */
router.route('/').post(authorize(USER_ROLES.DRIVER), tripCtrl.driverTripHistory);

/** POST / Rider Trip History -   */
router.route('/').post(authorize(USER_ROLES.RIDER), tripCtrl.riderTripHistory);

module.exports = router;
