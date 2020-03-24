const express = require('express');
const validate = require('express-validation');
const driverCtrl = require('./driver.controller');
const validation = require('./driver.validation');
const { authorize } = require('../../middlewares/auth');
const { USER_ROLES } = require('../../config/vars');

const router = express.Router();

/** Load user when API with userId route parameter is hit */
router.param('user_id', driverCtrl.load);

/** PUT /drivers/me - Update my profile */
router.route('/me').put(validate(validation.updateUser), authorize(), driverCtrl.updateMe);

/** GET /drivers/:user_id - Get user by ID */
router.route('/:user_id').get(authorize(USER_ROLES.ADMIN), driverCtrl.getUser);

/** PUT /drivers/:user_id - Update existing user */
router.route('/:user_id').put(validate(validation.updateUser), authorize(USER_ROLES.ADMIN), driverCtrl.updateUser);

/** POST /drivers/verifyDriver - Update existing user */
router.route('/verifyDriver').post(authorize(USER_ROLES.ADMIN), driverCtrl.verifyDriver);

/** POST /drivers/pre_create - Check existing and validate fields before create driver */
router.route('/pre_create').post(validate(validation.preCreateUser), driverCtrl.preCreateUser);

/** GET /drivers - Get list of drivers */
router.route('/').get(authorize(USER_ROLES.ADMIN), validate(validation.getUsers), driverCtrl.getUsers);

/** POST /drivers - Create a new driver */
router.route('/').post(validate(validation.createUser), driverCtrl.createUser);

/** POST /drivers - validate by phone Number */
router.route('/validateDriver').post(driverCtrl.validateDriver);

/** POST /drivers - Login  */
router.route('/driverLogin').post(driverCtrl.driverLogin);

/** POST /drivers - Update Location   */
router.route('/updateLocation').post(driverCtrl.updateLocation);

/** POST /Show near by drivers -   */
router.route('/nearbyDriver').post(driverCtrl.nearbyDriver);

/** POST / Driver accept the request -   */
router.route('/acceptRequest').post(driverCtrl.acceptRequest);

/** POST / Driver reject the request -   */
router.route('/rejectRequest').post(driverCtrl.rejectRequest);

/** POST / Driver is arriving to pick up rider -   */
router.route('/driverArriving').post(driverCtrl.driverArriving);

/** POST / Driver begins the trip -   */
router.route('/beginTrip').post(driverCtrl.beginTrip);

/** POST / Driver end trip -   */
router.route('/endTrip').post(driverCtrl.endTrip);

/** POST / Driver cancel the trip -   */
router.route('/cancelTrip').post(driverCtrl.cancelTrip);

/** POST / Get Driver's location -   */
router.route('/getDriverLocation').post(driverCtrl.getDriverLocation);

/** POST / Upcoming ride Scheduled trip -   */
router.route('/upcomingRide').post(driverCtrl.upcomingRide);

module.exports = router;
