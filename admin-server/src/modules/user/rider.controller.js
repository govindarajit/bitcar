const httpStatus = require('http-status');
const { omit } = require('lodash');
const voucherCodes = require('voucher-code-generator');
const User = require('mongoose').model('User');
const Branch = require('mongoose').model('Branch');
const Trip = require('./trip.model');
const APIError = require('../../helpers/APIError');
const { sendEmail } = require('../../helpers/email');
const { generateTokens } = require('../authentication/auth.controller');
const { USER_ROLES } = require('../../config/vars');

const notify = require('../../send');

function makeid() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 28; i += 1) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
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
 * PUT /Rider/me
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
 * GET /rider
 * Get list ofriders
 */
exports.getUsers = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
      role: USER_ROLES.RIDER,
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
 * GET /rider/:user_id
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
      ]),
    );

/** POST /rider/pre_create
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
 * POST /rider
 * Create a new driver
 */
exports.createUser = async (req, res, next) => {
  try {
    // Find existing user
    const [existingUser] = await Promise.all([
      User.findOne({
        $or: [{ email: req.body.email }, { phone_number: req.body.phone_number }],
      }),
    ]);
    if (existingUser) {
      const err = new APIError({
        message: 'This account already exists',
        status: httpStatus.CONFLICT,
        isPublic: true,
      });
      return next(err);
    }
    // Create new user
    const user = await new User();
    user.role = USER_ROLES.RIDER;
    user.email = req.body.email;
    user.phone_number = req.body.phone_number;
    user.passport_number = req.body.passport_number;
    user.phone_verified = true;
    user.name = req.body.name;
    user.referral_code = req.body.referral_code;
    const userSaved = await user.save();
    // Generate tokens and response
    const tokens = await generateTokens(userSaved, user.token());
    res.status(httpStatus.CREATED).json({
      user: userSaved.transform(['id', 'email', 'phone_number', 'name', 'role', 'passport_number']),
      tokens,
    });
  } catch (err) {
    return next(err);
  }
};
/**
 * PUT /Riders/:user_id
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
 * POST /rider/
 * Login  user
 */
exports.riderLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ phone_number: req.body.phone_number });
    if (!user) {
      const error = new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    res.send(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};
/**
 * POST /rider/
 * validate user
 */
exports.validateUser = async (req, res, next) => {
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
    res.send(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};
/**
 * POST /rider/
 * BookingRide
 */
exports.bookingRide = async (req, res, next) => {
  try {
    const passangerId = req.body.passanger_id;
    const pickupAddress = req.body.pickup_address;
    const lat1 = req.body.latitude;
    const lon1 = req.body.longitude;
    const dropAddress = req.body.drop_address;
    const carType = req.body.car_type;
    const approxPrice = req.body.approx_price;
    const approxDistance = req.body.approx_distance;
    // const pickupDate = req.body.pickup_date;
    const paymentType = req.body.payment_type;
    // const Distance = req.body.distance;
    const unit = 'K';
    const user = await User.find({
      $and: [
        { car_type: carType },
        { activation_status: 'active' },
        { role: 'driver' },
        { verified: true },
        { driver_booking_status: '0' },
      ],
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
      // if (dist >= 5) {
      //   return 0;
      // }
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
    const usr = await User.find({ email: { $in: useridarray } })
      .sort({ driver_ride_count: 1 })
      .limit(1);
    if (!usr) {
      const error = new APIError({
        message: 'No Driver Avalilable',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    let latedatepick;
    if (req.body.latepickdate) {
      const latedate = new Date(req.body.latepickdate).getTime();
      const diff = latedate - Date.now();
      if (diff / 1000 <= 3600) {
        latedatepick = null;
      } else {
        latedatepick = req.body.latepickdate;
      }
    }
    const tripdata = await Trip.findOne({ driver: usr[0]._id, booking_status: 'accepted' });
    if (!tripdata) {
      const title = 'waiting For Driver';
      const body = 'please accept request';
      notify.data.pushNotification(usr[0].device_token, makeid(), title, body);
      const driverId = usr[0]._id;
      const trip = await new Trip();
      trip.driver = driverId;
      trip.requestId = await makeid();
      trip.rider = passangerId;
      trip.pickupAddress = pickupAddress;
      trip.dropAddress = dropAddress;
      trip.approxPrice = approxPrice;
      trip.approxDistance = approxDistance;
      trip.payment_type = paymentType;
      trip.rider_latitude = lat1;
      trip.rider_longitude = lon1;
      trip.pickupDate = Date.now();
      trip.latePickupDate = latedatepick;
      trip.actualPickuptime = req.body.latepickdate;
      await trip.save();
      res.send(httpStatus.OK);
    } else {
      const triptime = tripdata.actualPickuptime.getTime() - Date.now();
      if (triptime / 1000 <= 3600) {
        const assignanotherdriverusr = await User.find({
          _id: { $ne: tripdata.driver },
          email: { $in: useridarray },
          driver_booking_status: '0',
        })
          .sort({ driver_ride_count: 1 })
          .limit(1);
        if (!assignanotherdriverusr) {
          const error = new APIError({
            message: 'No Driver Avalilable',
            status: httpStatus.NOT_FOUND,
            isPublic: true,
          });
          return next(error);
        }
        const title = 'waiting For Driver';
        const body = 'please accept request';
        notify.data.pushNotification(usr[0].device_token, makeid(), title, body);
        const driverId = assignanotherdriverusr[0]._id;
        const trip = await new Trip();
        trip.driver = driverId;
        trip.requestId = await makeid();
        trip.rider = passangerId;
        trip.pickupAddress = pickupAddress;
        trip.dropAddress = dropAddress;
        trip.approxPrice = approxPrice;
        trip.approxDistance = approxDistance;
        trip.payment_type = paymentType;
        trip.rider_latitude = lat1;
        trip.rider_longitude = lon1;
        trip.pickupDate = Date.now();
        trip.latePickupDate = latedatepick;
        trip.actualPickuptime = req.body.latepickdate;
        await trip.save();
        res.send(httpStatus.OK);
      } else {
        const title = 'waiting For Driver';
        const body = 'please accept request';
        notify.data.pushNotification(usr[0].device_token, makeid(), title, body);
        const driverId = usr[0]._id;
        const trip = await new Trip();
        trip.driver = driverId;
        trip.requestId = await makeid();
        trip.rider = passangerId;
        trip.pickupAddress = pickupAddress;
        trip.dropAddress = dropAddress;
        trip.approxPrice = approxPrice;
        trip.approxDistance = approxDistance;
        trip.payment_type = paymentType;
        trip.rider_latitude = lat1;
        trip.rider_longitude = lon1;
        trip.pickupDate = Date.now();
        trip.latePickupDate = latedatepick;
        trip.actualPickuptime = req.body.latepickdate;
        await trip.save();
        res.send(httpStatus.OK);
      }
    }
  } catch (err) {
    return next(err);
  }
};
/**
 * POST /rider/
 * reBookingtrip
 */
exports.reBookingRide = async (req, res, next) => {
  try {
    const request = req.body.tripId;
    const trip = await Trip.findOne({ requestId: request });
    const driverid = trip.driver;
    const passangerId = trip.rider;
    const pickupaddress = trip.pickupAddress;
    const lat1 = trip.rider_latitude;
    const lon1 = trip.rider_longitude;
    const dropaddress = trip.dropAddress;
    // const carType = trip.car_type;
    const approxprice = trip.approxPrice;
    const approxdistance = trip.approxDistance;
    // const pickupDate = req.body.pickup_date;
    const paymentType = trip.payment_type;
    const unit = 'K';
    const user = await User.find({
      _id: { $ne: driverid },
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
      // if (dist >= 5) {
      //   return 0;
      // }
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
    const usr = await User.find({ email: { $in: useridarray } })
      .sort({ driver_ride_count: 1 })
      .limit(1);
    if (!usr) {
      const error = new APIError({
        message: 'No Driver Avalilable',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    const title = 'waiting For Driver';
    const body = 'please accept request';
    notify.data.pushNotification(usr[0].device_token, request, title, body);
    const driverId = usr[0]._id;
    // const trip = await new Trip();
    trip.driver = driverId;
    trip.requestId = request;
    trip.rider = passangerId;
    trip.booking_status = 'pending';
    trip.pickupAddress = pickupaddress;
    trip.dropAddress = dropaddress;
    trip.approxPrice = approxprice;
    trip.approxDistance = approxdistance;
    trip.payment_type = paymentType;
    trip.rider_latitude = lat1;
    trip.rider_longitude = lon1;
    trip.pickupDate = Date.now();
    await trip.save();
    res.send(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};
/**
 * POST /rider/
 * cancleRide
 */
exports.CancleRide = async (req, res, next) => {
  try {
    const tripdata = req.body.tripId;
    const trip = await Trip.findOneAndUpdate({ requestId: tripdata }).populate([
      {
        path: 'driver',
        model: 'User',
      },
    ]);
    notify.data.pushNotification(trip.driver.device_token, tripdata, 'title', 'body');
    trip.booking_status = 'passenger_canceled';
    trip.save();
    res.send(httpStatus.OK);
    // console.log(user.driver.device_token);
    if (!trip) {
      const error = new APIError({
        message: 'No Ride Found',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
  } catch (err) {
    return next(err);
  }
};
/**
 * POST /rider/
 * update deviceToken of user
 */
exports.updateDeviceToken = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      const error = new APIError({
        message: 'No User Found',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    user.device_token = req.body.device_token;
    await user.save();
    res.send(httpStatus.CREATED);
  } catch (err) {
    return next(err);
  }
};
