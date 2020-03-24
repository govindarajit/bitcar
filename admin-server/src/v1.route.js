const express = require('express');
const authRoutes = require('./modules/authentication/auth.route');
const uploadRoutes = require('./modules/upload/upload.route');
const driverRoutes = require('./modules/user/driver.route');
const branchRoutes = require('./modules/branch/branch.route');
const contactRoutes = require('./modules/contact/contact.route');
const searchRoutes = require('./modules/search/search.route');
const riderRoutes = require('./modules/user/rider.route');
const vehicleRoutes = require('./modules/configure/vehicle/vehicle.route');
const regionRoutes = require('./modules/configure/regions/regions.route');
const commonRoutes = require('./modules/common/common.route');
const tripRoutes = require('./modules/user/trip.route');
const favouritesRoutes = require('./modules/favourites/favourites.route');

const router = express.Router();

/** GET /status - Check server status */
router.get('/status', (req, res) => {
  res.json({ message: 'OK' });
});

/** Mount authentication routes */
router.use('/auth', authRoutes);

/** Mount common routes */
router.use('/common', commonRoutes);

/** Mount upload routes */
router.use('/upload', uploadRoutes);

/** Mount driver routes */
router.use('/drivers', driverRoutes);

/** Mount driver routes */
router.use('/riders', riderRoutes);
/** Mount branch routes */
router.use('/branches', branchRoutes);

/** Mount contact routes */
router.use('/contacts', contactRoutes);

/** Mount search routes */
router.use('/search', searchRoutes);

/** Mount vehicle routes */
router.use('/configure/vehicle', vehicleRoutes);

/** Mount regions routes */
router.use('/configure/regions', regionRoutes);

/** Mount trip routes */
router.use('/trip', tripRoutes);

/** Mount favourites routes */
router.use('/favourites', favouritesRoutes);

module.exports = router;
