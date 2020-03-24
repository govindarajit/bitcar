const express = require('express');
const vehicleCtrl = require('./vehicle.controller');
const { authorize } = require('../../../middlewares/auth');
const { USER_ROLES } = require('../../../config/vars');

const router = express.Router();

// Route for add vehicle Type
router.route('/addVehicleType').post(authorize(USER_ROLES.ADMIN), vehicleCtrl.addVehicleType);

// Route for get vehicle Type
router.route('/getVehicleType').get(authorize(USER_ROLES.ADMIN), vehicleCtrl.getVehicleType);

// Route for get details of selected vehicle Type
router.route('/getSingleVehicleType').post(authorize(USER_ROLES.ADMIN), vehicleCtrl.getSingleVehicleType);

// Route for update vehicle Type
router.route('/updateVehicleType').post(authorize(USER_ROLES.ADMIN), vehicleCtrl.updateVehicleType);

// Route for delete vehicle Type
router.route('/deleteVehicleType').post(authorize(USER_ROLES.ADMIN), vehicleCtrl.deleteVehicleType);

// Route for add vehicle Model
router.route('/addVehicleModel').post(authorize(USER_ROLES.ADMIN), vehicleCtrl.addVehicleModel);

// Route for get vehicle Model
router.route('/getVehicleModel').get(authorize(USER_ROLES.ADMIN), vehicleCtrl.getVehicleModel);

// Route for get details of selected vehicle Model
router.route('/getSingleVehicleModel').post(authorize(USER_ROLES.ADMIN), vehicleCtrl.getSingleVehicleModel);

// Route for update vehicle Model
router.route('/updateVehicleModel').post(authorize(USER_ROLES.ADMIN), vehicleCtrl.updateVehicleModel);

// Route for delete vehicle Model
router.route('/deleteVehicleModel').post(authorize(USER_ROLES.ADMIN), vehicleCtrl.deleteVehicleModel);

module.exports = router;
