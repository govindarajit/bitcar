const httpStatus = require('http-status');
const { omit } = require('lodash');
const voucherCodes = require('voucher-code-generator');
const User = require('mongoose').model('User');
const cron = require('node-cron');
const Branch = require('mongoose').model('Branch');
const APIError = require('../../helpers/APIError');
// const { verifyCode } = require('../../helpers/accountKit');
const { sendEmail } = require('../../helpers/email');
const { generateTokens } = require('../authentication/auth.controller');
const { USER_ROLES, DRIVER_ACTIVATION_STATUS, TRIP_STATE } = require('../../config/vars');
const Trip = require('./trip.model');
const notify = require('../../send');

/**
 * Load user when API with userId route parameter is hit
 */
exports.load = async (req, res, next, userId) => {
  try {
    const user = await User.get({ _id: userId });
    if (!user) {
      const error = new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * PUT /drivers/me
 * Update my profile
 */
exports.updateMe = async (req, res, next) => {
  try {
    const userUpdated = omit(req.body, ['role', 'activation_status', 'invite_code', 'phone_number']);
    const user = Object.assign(req.me, userUpdated);
    const inviteCode = voucherCodes.generate({
      length: 8,
    })[0];
    user.invite_code = inviteCode;
    const userSaved = await user.save();
    res
      .status(httpStatus.OK)
      .json(
        userSaved.transform([
          'id',
          'name',
          'email',
          'picture',
          'phone_number',
          'branch',
          'branch_city',
          'activation_status',
          'invite_code',
          'documents',
        ]),
      );
    // Send email
    sendEmail({
      sender: {
        Email: 'marketing@gobitcar.com',
        Name: '[BitCar] Marketing Team',
      },
      recipients: [
        {
          Email: user.email,
          Name: user.name.first_name,
        },
      ],
      templateId: 597558,
      subject: 'Invite your friends to get 3% referral reward.',
      variables: {
        referralCode: user.invite_code,
        referralLink: `${req.body.domain}?ref=${user.invite_code}`,
      },
    }).then();
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /drivers
 * Get list of drivers
 */
exports.getUsers = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
      role: USER_ROLES.DRIVER,
    };
    const { page, per_page: perPage, ...otherQuery } = query;
    const [users, totalCount] = await Promise.all([User.list(query), User.countDocuments(otherQuery)]);
    const transformedUsers = users.map(user => {
      const transformedUser = user.transform([
        'id',
        'name',
        'picture',
        'email',
        'phone_number',
        'branch',
        'activation_status',
        'documents',
      ]);
      if (transformedUser.documents && transformedUser.documents.identity_card) {
        transformedUser.identity_card_id = transformedUser.documents.identity_card.id;
        delete transformedUser.documents;
      }
      return transformedUser;
    });
    res.status(httpStatus.OK).json({
      users: transformedUsers,
      total_count: totalCount,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /drivers/:user_id
 * Get user by ID
 */
exports.getUser = (req, res) =>
  res
    .status(httpStatus.OK)
    .json(
      req.user.transform([
        'id',
        'name',
        'email',
        'picture',
        'phone_number',
        'branch',
        'branch_city',
        'activation_status',
        'invite_code',
        'documents',
        'verified',
      ]),
    );

/** POST /drivers/pre_create
 *  Check existing and validate fields before create user
 */
exports.preCreateUser = async (req, res, next) => {
  try {
    // Find existing user
    const [existingUser, branch] = await Promise.all([
      User.get({ email: req.body.email }),
      Branch.get({ _id: req.body.branch }),
    ]);
    if (existingUser) {
      const err = new APIError({
        message: 'This account already exists',
        status: httpStatus.CONFLICT,
        isPublic: true,
      });
      return next(err);
    }
    if (!branch) {
      const err = new APIError({
        message: 'Branch does not exists',
        status: httpStatus.CONFLICT,
        isPublic: true,
      });
      return next(err);
    }
    res.status(httpStatus.NO_CONTENT).end();
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /drivers
 * Create a new driver
 */
exports.createUser = async (req, res, next) => {
  try {
    // Find existing user
    const [existingUser] = await Promise.all([
      User.findOne({
        $or: [{ email: req.body.email }, { phone_number: req.body.phone_number }],
      }),
      Branch.get({ _id: req.body.branch }),
    ]);
    if (existingUser) {
      const err = new APIError({
        message: 'This account already exists',
        status: httpStatus.CONFLICT,
        isPublic: true,
      });
      return next(err);
    }
    // if (!branch) {
    //   const err = new APIError({
    //     message: 'Branch does not exists',
    //     status: httpStatus.CONFLICT,
    //     isPublic: true,
    //   });
    //   return next(err);
    // }
    // Create new user
    const user = await new User();
    user.role = USER_ROLES.DRIVER;
    user.activation_status = DRIVER_ACTIVATION_STATUS.INACTIVE;
    user.branch = req.body.branch;
    user.branch_city = req.body.branch_city;
    user.email = req.body.email;
    user.phone_number = req.body.phone_number;
    user.phone_verified = false;
    user.name = req.body.name;
    user.car_type = req.body.car_type;

    user.documents = {
      identity_card: {
        id: req.body.identity_card_id,
      },
    };
    user.referral_code = req.body.referral_code;
    const userSaved = await user.save();
    // Generate tokens and response
    const tokens = await generateTokens(userSaved, user.token());
    res.status(httpStatus.CREATED).json({
      user: userSaved.transform(['id', 'branch', 'branch_city', 'email', 'phone_number', 'name', 'documents']),
      tokens,
    });
    // Send email
    sendEmail({
      sender: {
        Email: 'account@gobitcar.com',
        Name: '[BitCar] Account Team',
      },
      recipients: [
        {
          Email: req.body.email,
          Name: req.body.name.first_name,
        },
      ],
      templateId: 597563,
      subject: 'Update Your Informations',
      variables: {
        name: req.body.name.first_name,
        updateLink: `${req.body.domain}/update-documents`,
        contactLink: `${req.body.domain}/contact`,
      },
    }).then();
  } catch (err) {
    return next(err);
  }
};

/**
 * PUT /drivers/:user_id
 * Update existing user
 */
exports.updateUser = async (req, res, next) => {
  try {
    const userUpdated = omit(req.body, []);
    const user = Object.assign(req.user, userUpdated);
    const userSaved = await user.save();
    res
      .status(httpStatus.OK)
      .json(
        userSaved.transform([
          'id',
          'name',
          'email',
          'picture',
          'phone_number',
          'branch',
          'branch_city',
          'activation_status',
          'invite_code',
          'documents',
        ]),
      );
  } catch (err) {
    return next(err);
  }
};
/**
 * POST /drivers/verifyDriver
 * Update drivers verification status
 */
exports.verifyDriver = async (req, res, next) => {
  try {
    const driver = await User.findOne({ _id: req.body.id });
    driver.verified = true;
    await driver.save();
    res.send(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};
/**
 * POST /drivers/validateDriver
 * Validate existing user
 */
exports.validateDriver = async (req, res, next) => {
  try {
    const user = await User.findOne({
      $and: [{ phone_number: req.body.phone_number }, { authyId: req.body.authyId }],
    });
    if (!user) {
      const error = new APIError({
        message: 'Wrong verifaction Code',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    user.phone_verified = true;
    user.authyId = '';
    user.save();
    res.sendStatus(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};
/**
 * POST /drivers/driverLogin
 * Login existing user
 */
exports.driverLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      $and: [{ phone_number: req.body.phone_number }, { phone_verified: true }, { verified: true }],
    });
    if (!user) {
      const error = new APIError({
        message: 'Please Wait For Admin Approval ',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    user.authyId = '123456';
    user.save();
    res.sendStatus(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};
/**
 * POST /drivers/
 * Update Driver Location
 */
exports.updateLocation = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const error = new APIError({
        message: 'Driver Not Found ',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    user.driver_location = req.body.driver_location;
    user.save();
    res.sendStatus(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /drivers/
 * nearbyDriver  Location
 */
exports.nearbyDriver = async (req, res, next) => {
  try {
    const lat1 = req.body.latitude;
    const lon1 = req.body.longitude;
    // const Distance = req.body.distance;
    const unit = 'K';
    const user = await User.find({
      $and: [{ activation_status: 'active' }, { role: 'driver' }, { verified: true }, { driver_booking_status: '0' }],
    });
    const userdata = [];
    user.filter(driverlocation => {
      const id = driverlocation.email;

      const lat2 = driverlocation.driver_location.driver_latitude;
      const lon2 = driverlocation.driver_location.driver_longitude;
      if (lat1 === lat2 && lon1 === lon2) {
        return 0;
      }
      const radlat1 = (Math.PI * lat1) / 180;
      const radlat2 = (Math.PI * lat2) / 180;
      const theta = lon1 - lon2;
      const radtheta = (Math.PI * theta) / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === 'K') {
        dist *= 1.609344;
      }
      if (unit === 'N') {
        dist *= 0.8684;
      }
      if (dist >= 5) {
        return 0;
      }
      const users = {};
      users.dist = dist;
      users.email = id;
      userdata.push(users);
      return userdata;
    });
    const useridarray = [];
    userdata.filter(userstatus => {
      useridarray.push(userstatus.email);
      return 0;
    });
    const usr = await User.find({ email: { $in: useridarray } });
    if (!usr) {
      const error = new APIError({
        message: 'No Driver Avalilable',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    res.send(usr);
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /drivers/
 * Driver accept the request
 */
exports.acceptRequest = async (req, res, next) => {
  try {
    await Trip.findOne({
      requestId: req.body.requestId,
      booking_status: TRIP_STATE.PENDING,
    })
      .populate([
        {
          path: 'rider',
          model: 'User',
        },
      ])
      .exec((error, doc) => {
        const trip = doc;
        if (error) {
          res.status(404).send(error);
        } else {
          if (!trip) {
            const err = new APIError('The request is not available', httpStatus.NOT_FOUND, 1012);
            return next(err);
          }
          trip.booking_status = TRIP_STATE.ACCEPTED;
          trip.driver = req.body.driver_id;
          trip.save();
          User.findOne({ _id: req.body.driver_id }, (errror, result) => {
            if (errror) res.status(404).send(errror);
            else {
              const results = result;
              const driverRideCount = results.driver_ride_count + 1;
              results.driver_ride_count = driverRideCount;

              const diff = trip.actualPickuptime.getTime() - Date.now();
              if (diff / 1000 >= 3600) {
                results.driver_booking_status = 0; // driver currently free
              } else if (diff / 1000 < 3600) {
                results.driver_booking_status = 1; // driver accepted the trip
              }
              results.actualPickupTime = JSON.stringify(trip.actualPickuptime);
              results.save();
              const token = req.body.device_token;
              const { requestId } = req.body;
              const title = 'Request Accepted by Driver';
              const body = 'Your request is accepted by driver';
              notify.data.pushNotificationDriverAccpt(token, requestId, title, body, results, trip.actualPickuptime);
              res.status(201).send(results);
            }
          });
        }
      });
  } catch (err) {
    next(err);
  }
};
/**
 * POST /drivers/
 * Driver reject the request
 */
exports.rejectRequest = async (req, res, next) => {
  try {
    await Trip.findOne({
      requestId: req.body.requestId,
      booking_status: TRIP_STATE.PENDING,
    })
      .populate([
        {
          path: 'rider',
          model: 'User',
        },
      ])
      .exec((error, doc) => {
        if (error) {
          res.status(404).send(error);
        } else {
          const trip = doc;
          if (!trip) {
            const err = new APIError('The request is not available', httpStatus.NOT_FOUND, 1012);
            return next(err);
          }
          trip.driver = req.body.driver_id;
          trip.save();
          User.findOne({ _id: req.body.driver_id }, (errror, result) => {
            if (errror) res.status(404).send(errror);
            else {
              const results = result;
              const driverRideCount = results.driver_ride_count + 1;
              results.driver_ride_count = driverRideCount;
              results.save();
              const token = req.body.device_token;
              const { requestId } = req.body;
              const title = 'Request Rejected by Driver';
              const body = 'Your request is rejected by driver';
              notify.data.pushNotification(token, requestId, title, body);
              res.sendStatus(httpStatus.OK);
            }
          });
        }
      });
  } catch (err) {
    next(err);
  }
};
/**
 * POST /drivers/
 * Driver is arriving to pick up rider
 */
exports.driverArriving = async (req, res, next) => {
  try {
    await Trip.findOne({
      requestId: req.body.requestId,
      driver: req.body.driver_id,
      booking_status: TRIP_STATE.ACCEPTED,
    })
      .populate([
        {
          path: 'rider',
          model: 'User',
        },
      ])
      .exec((error, doc) => {
        if (error) {
          res.status(404).send(error);
        } else {
          const trip = doc;
          if (!trip) {
            const err = new APIError('The trip is not available', httpStatus.NOT_FOUND, 1012);
            return next(err);
          }
          trip.booking_status = TRIP_STATE.DRIVER_ARRIVED;
          trip.save();
          User.findOne({ _id: req.body.driver_id }, (errror, result) => {
            if (errror) res.status(404).send(errror);
            else {
              const results = result;
              results.driver_booking_status = 2; // driver arriving
              results.save();
              const token = req.body.device_token;
              const { requestId } = req.body;
              const title = 'Driver is arriving';
              const body = 'Driver is arriving to pick up you on your location';
              notify.data.pushNotification(token, requestId, title, body);
              res.sendStatus(httpStatus.OK);
            }
          });
        }
      });
  } catch (err) {
    next(err);
  }
};
/**
 * POST /drivers/
 * Driver begins the trip
 */
exports.beginTrip = async (req, res, next) => {
  try {
    await Trip.findOne({
      requestId: req.body.requestId,
      driver: req.body.driver_id,
      $or: [{ booking_status: TRIP_STATE.ACCEPTED }, { booking_status: TRIP_STATE.DRIVER_ARRIVED }],
    })
      .populate([
        {
          path: 'rider',
          model: 'User',
        },
      ])
      .exec((error, doc) => {
        if (error) {
          res.status(404).send(error);
        } else {
          const trip = doc;
          if (!trip) {
            const err = new APIError('The trip is not available', httpStatus.NOT_FOUND, 1012);
            return next(err);
          }
          trip.booking_status = TRIP_STATE.ON_THE_TRIP;
          trip.save();
          User.findOne({ _id: req.body.driver_id }, (errror, result) => {
            if (errror) res.status(404).send(errror);
            else {
              const results = result;
              results.driver_booking_status = 3; // driver start trip
              results.save();
              const token = req.body.device_token;
              const { requestId } = req.body;
              const title = 'Trip started';
              const body = 'Driver begins the trip';
              notify.data.pushNotification(token, requestId, title, body);
              res.sendStatus(httpStatus.OK);
            }
          });
        }
      });
  } catch (err) {
    next(err);
  }
};
/**
 * POST /drivers/
 * Driver end trip
 */
exports.endTrip = async (req, res, next) => {
  try {
    await Trip.findOne({
      requestId: req.body.requestId,
      driver: req.body.driver_id,
      $or: [
        { booking_status: TRIP_STATE.ACCEPTED },
        { booking_status: TRIP_STATE.DRIVER_ARRIVED },
        { booking_status: TRIP_STATE.ON_THE_TRIP },
      ],
    })
      .populate([
        {
          path: 'rider',
          model: 'User',
        },
      ])
      .exec((error, doc) => {
        if (error) {
          res.status(404).send(error);
        } else {
          const trip = doc;
          if (!trip) {
            const err = new APIError('The trip is not available', httpStatus.NOT_FOUND, 1012);
            return next(err);
          }
          trip.booking_status = TRIP_STATE.COMPLETED;
          trip.total_fare = req.body.total_fare;
          trip.total_distance = req.body.total_distance;
          trip.latePickupDate = null;
          trip.save();
          User.findOne({ _id: req.body.driver_id }, (errror, result) => {
            if (errror) res.status(404).send(errror);
            else {
              const results = result;
              results.driver_booking_status = 0; // driver ends trip
              results.save();
              const token = req.body.device_token;
              const { requestId } = req.body;
              const title = 'Trip ended';
              const body = 'Driver ends the trip';
              notify.data.pushNotification(token, requestId, title, body);
              res.sendStatus(httpStatus.OK);
            }
          });
        }
      });
  } catch (err) {
    next(err);
  }
};
/**
 * POST /drivers/
 * Driver cancel the trip
 */
exports.cancelTrip = async (req, res, next) => {
  try {
    await Trip.findOne({
      requestId: req.body.requestId,
      driver: req.body.driver_id,
      $or: [{ booking_status: TRIP_STATE.ACCEPTED }, { booking_status: TRIP_STATE.DRIVER_ARRIVED }],
    })
      .populate([
        {
          path: 'rider',
          model: 'User',
        },
      ])
      .exec((error, doc) => {
        if (error) {
          res.status(404).send(error);
        } else {
          const trip = doc;
          if (!doc) {
            const err = new APIError('The trip is not available', httpStatus.NOT_FOUND, 1012);
            return next(err);
          }
          trip.booking_status = TRIP_STATE.DRIVER_CANCELED;
          trip.latePickupDate = null;
          trip.cancellation_reason = {
            canceled_by: req.body.driver_id,
            cancel_reason: req.body.cancel_reason,
            timestamp: Date.now(),
          };
          trip.save();
          User.findOne({ _id: req.body.driver_id }, (errror, result) => {
            if (errror) res.status(404).send(errror);
            else {
              const results = result;
              results.driver_booking_status = 0; // driver cancels trip
              results.save();
              const token = req.body.device_token;
              const { requestId } = req.body;
              const title = 'Trip canceled';
              const body = 'Driver cancel the trip';
              notify.data.pushNotification(token, requestId, title, body);
              res.sendStatus(httpStatus.OK);
            }
          });
        }
      });
  } catch (err) {
    next(err);
  }
};
/**
 * POST /drivers/
 * Get Driver's location
 */
exports.getDriverLocation = async (req, res, next) => {
  try {
    await Trip.find({ driver: req.body.driver_id })
      .populate([
        {
          path: 'driver',
          model: 'User',
        },
      ])
      .exec((error, doc) => {
        if (error) {
          res.status(404).send(error);
        } else {
          const trip = doc;
          if (!trip) {
            const err = new APIError('The trip is not available', httpStatus.NOT_FOUND, 1012);
            return next(err);
          }
          res.status(httpStatus.CREATED).send(trip[0].driver.driver_location);
        }
      });
  } catch (err) {
    next(err);
  }
};
/**
 * Cron Scheduler to reset ride count of Driver at 12AM everyday
 */
cron.schedule('0 0 0 * * *', () => {
  User.updateMany({ role: 'driver' }, { $set: { driver_ride_count: 0 } }, () => {});
});

/**
 * POST /drivers/
 * Upcoming ride Scheduled trip
 */
exports.upcomingRide = async (req, res, next) => {
  try {
    await Trip.find({ driver: req.body.driver_id, latePickupDate: { $ne: null } }, (err, doc) => {
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
