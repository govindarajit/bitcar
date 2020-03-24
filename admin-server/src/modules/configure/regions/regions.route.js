const express = require('express');
const regionCtrl = require('./regions.controller');
const { authorize } = require('../../../middlewares/auth');
const { USER_ROLES } = require('../../../config/vars');

const router = express.Router();

// Route for add Countires
router.route('/addCountries').post(authorize(USER_ROLES.ADMIN), regionCtrl.addCountries);

// Route for get Countries
router.route('/getCountries').get(authorize(USER_ROLES.ADMIN), regionCtrl.getCountries);

// Route for get details of selected Country
router.route('/getSingleCountries').post(authorize(USER_ROLES.ADMIN), regionCtrl.getSingleCountries);

// Route for update Countries
router.route('/updateCountries').post(authorize(USER_ROLES.ADMIN), regionCtrl.updateCountries);

// Route for delete Countries
router.route('/deleteCountries').post(authorize(USER_ROLES.ADMIN), regionCtrl.deleteCountries);

// Route for add  Cities
router.route('/addCities').post(authorize(USER_ROLES.ADMIN), regionCtrl.addCities);

// Route for get Cities
router.route('/getCities').get(authorize(USER_ROLES.ADMIN), regionCtrl.getCities);

// Route for get details of selected city
router.route('/getSingleCities').post(authorize(USER_ROLES.ADMIN), regionCtrl.getSingleCities);

// Route for update city
router.route('/updateCities').post(authorize(USER_ROLES.ADMIN), regionCtrl.updateCities);

// Route for delete Cities
router.route('/deleteCities').post(authorize(USER_ROLES.ADMIN), regionCtrl.deleteCities);

module.exports = router;
