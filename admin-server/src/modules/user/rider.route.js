const express = require('express');
const validate = require('express-validation');
const riderCtrl = require('./rider.controller');
const validation = require('./rider.validation');
const { authorize } = require('../../middlewares/auth');
const { USER_ROLES } = require('../../config/vars');

const router = express.Router();

/** Load user when API with userId route parameter is hit */
router.param('user_id', riderCtrl.load);

/** PUT /riders/me - Update my profile */
router.route('/me').put(validate(validation.updateUser), authorize(), riderCtrl.updateMe);

/** GET /riders/:user_id - Get user by ID */
router.route('/:user_id').get(authorize(USER_ROLES.ADMIN), riderCtrl.getUser);

/** PUT /riders/:user_id - Update existing user */
router.route('/:user_id').put(validate(validation.updateUser), authorize(USER_ROLES.ADMIN), riderCtrl.updateUser);

/** POST /riders/pre_create - Check existing and validate fields before create driver */
router.route('/pre_create').post(validate(validation.preCreateUser), riderCtrl.preCreateUser);

/** GET /riders - Get list of drivers */
router.route('/').get(authorize(USER_ROLES.ADMIN), validate(validation.getUsers), riderCtrl.getUsers);

/** POST /riders - Create a new driver */
router.route('/').post(validate(validation.createUser), riderCtrl.createUser);

/** POST /riders login -  */
router.route('/riderlogin').post(riderCtrl.riderLogin);

/** POST /riders validate - */
router.route('/validateUser').post(riderCtrl.validateUser);

/** POST /riders BookingRide - */
router.route('/bookingRide').post(riderCtrl.bookingRide);

/** POST /riders reBookingRide - */
router.route('/reBookingRide').post(riderCtrl.reBookingRide);

/** POST /riders updateDeviceToken - */
router.route('/updateDeviceToken').post(riderCtrl.updateDeviceToken);

/** POST /riders updateDeviceToken - */
router.route('/CancleRide').post(riderCtrl.CancleRide);
module.exports = router;
