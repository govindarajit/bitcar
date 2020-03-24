const httpStatus = require('http-status');
const Trip = require('./trip.model');
const { DEFAULT_PAGE_LIMIT } = require('../../config/vars');
/**
 * GET /trip/getNowTrips
 * Get list of trips going on right now
 */
exports.getNowTrips = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
    };
    const { page, per_page: perPage = DEFAULT_PAGE_LIMIT, ...otherQuery } = query;
    let query1 = {
      $or: [
        { booking_status: 'pending' },
        { booking_status: 'no_drivers_available' },
        { booking_status: 'accepted' },
        { booking_status: 'driver_arrived' },
        { booking_status: 'on_the_trip' },
      ],
      $and: [{ laterPickupDate: null }],
    };
    if (Object.keys(otherQuery).length > 0) {
      query1 = otherQuery;
      query1.laterPickupDate = null;
    }
    const docLength = await Trip.find(query1).count();
    const totalCount = docLength;
    const trips = await Trip.find(query1)
      .skip((Number(page) - 1) * Number(perPage))
      .limit(Number(perPage))
      .populate('rider', 'name')
      .populate('driver', 'name')
      .sort({ created_at: -1 });
    res.status(httpStatus.OK).json({
      trips,
      total_count: totalCount,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /trip/getHistoryTrips
 * Get list of trips which are history
 */
exports.getHistoryTrips = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
    };
    const { page, per_page: perPage = DEFAULT_PAGE_LIMIT, ...otherQuery } = query;
    let query1 = {
      $or: [
        { booking_status: 'driver_canceled' },
        { booking_status: 'passenger_canceled' },
        { booking_status: 'admin_canceled' },
        { booking_status: 'wait_for_review' },
        { booking_status: 'completed' },
      ],
      $and: [{ laterPickupDate: null }],
    };
    if (Object.keys(otherQuery).length > 0) {
      query1 = otherQuery;
      query1.laterPickupDate = null;
    }
    const docLength = await Trip.find(query1).count();
    const totalCount = docLength;
    const trips = await Trip.find(query1)
      .skip((Number(page) - 1) * Number(perPage))
      .limit(Number(perPage))
      .populate('rider', 'name')
      .populate('driver', 'name')
      .sort({ created_at: -1 });
    res.status(httpStatus.OK).json({
      trips,
      total_count: totalCount,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /trip/getLaterTrips
 * Get list of trips which are history
 */
exports.getLaterTrips = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
    };
    const { page, per_page: perPage = DEFAULT_PAGE_LIMIT, ...otherQuery } = query;
    let query1 = { laterPickupDate: { $ne: null } };
    if (Object.keys(otherQuery).length > 0) {
      query1 = otherQuery;
      query1.laterPickupDate = { $ne: null };
    }
    const docLength = await Trip.find(query1).count();
    const totalCount = docLength;
    const trips = await Trip.find(query1)
      .skip((Number(page) - 1) * Number(perPage))
      .limit(Number(perPage))
      .populate('rider', 'name')
      .populate('driver', 'name')
      .sort({ created_at: -1 });
    res.status(httpStatus.OK).json({
      trips,
      total_count: totalCount,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /trip/getTripInfo
 * Get the trip info
 */
exports.getTripInfo = async (req, res, next) => {
  try {
    const trips = await Trip.findOne({ _id: req.body.id })
      .populate('rider', 'name phone_number')
      .populate('driver', 'name phone_number');
    res.status(httpStatus.OK).json(trips);
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /trip/
 * Driver Trip History
 */
exports.driverTripHistory = async (req, res, next) => {
  try {
    await Trip.find({ driver: req.body.id })
      .populate([
        {
          path: 'rider',
          model: 'User',
        },
      ])
      .exec((err, doc) => {
        if (err) {
          res.status(404).send(err);
        } else {
          res.status(httpStatus.CREATED).send(doc);
        }
      });
  } catch (err) {
    next(err);
  }
};
/**
 * POST /trip/
 * Rider Trip History
 */
exports.riderTripHistory = async (req, res, next) => {
  try {
    await Trip.find({ driver: req.body.id })
      .populate([
        {
          path: 'driver',
          model: 'User',
        },
      ])
      .exec((err, doc) => {
        if (err) {
          res.status(404).send(err);
        } else {
          res.status(httpStatus.CREATED).send(doc);
        }
      });
  } catch (err) {
    next(err);
  }
};
