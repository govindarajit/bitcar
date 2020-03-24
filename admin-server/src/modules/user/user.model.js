const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../../helpers/APIError');
const {
  USER_ROLES,
  DRIVER_ACTIVATION_STATUS,
  DRIVING_LICENSE_CLASS,
  DEFAULT_PAGE_LIMIT,
} = require('../../config/vars');
const { env, jwtSecret, accessTokenExpiry } = require('../../config/config');

/**
 * ENUM - User roles, Activation status, Driving license class
 */
const roles = Object.values(USER_ROLES);
const activationStatus = Object.values(DRIVER_ACTIVATION_STATUS);
const drivingLicenseClass = Object.values(DRIVING_LICENSE_CLASS);

/**
 * User schema
 */
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordToken: {
      type: String,
    },
    phone_number: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    phone_verified: {
      type: Boolean,
      default: false,
    },
    // passport_number: {
    //   type: String,
    //   // unique: true,
    //   trim: true,
    // },
    verified: {
      type: Boolean,
      default: false,
    },
    authyId: {
      type: String,
      default: 12346,
    },
    password: {
      type: String,
      // required: true,
      minlength: 6,
      maxlength: 128,
    },
    role: {
      type: String,
      enum: roles,
      default: USER_ROLES.RIDER,
    },
    driver_ride_count: {
      type: Number,
      default: 0,
    },
    activation_status: {
      type: String,
      enum: activationStatus,
      default: DRIVER_ACTIVATION_STATUS.ACTIVE,
    },
    picture: {
      type: String,
      trim: true,
    },
    name: {
      first_name: { type: String, trim: true },
      last_name: { type: String, trim: true },
      full_name: { type: String, trim: true },
    },

    car_type: { type: String },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      province: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    driver_location: {
      driver_latitude: { type: String },
      driver_longitude: { type: String },
      driver_direction: { type: String },
    },
    driver_booking_status: {
      type: String,
      default: '0',
    },
    birthday: {
      type: Date,
    },
    gender: {
      type: String,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
    },
    branch_city: {
      type: String,
      trim: true,
    },
    invite_code: {
      type: String,
      unique: true,
      sparse: true,
    },
    referral_code: {
      type: String,
      trim: true,
    },
    documents: {
      identity_card: {
        id: { type: String, trim: true },
        issue_date: { type: String, trim: true },
        image_front: { type: String, trim: true },
        image_back: { type: String, trim: true },
      },
      vehicle: {
        license_plate: { type: String, trim: true },
        color: { type: String, trim: true },
        model: { type: String, trim: true },
        capacity: { type: Number },
        images: [String],
      },
      vehicle_insurance: {
        company: { type: String, trim: true },
        expiry_date: { type: String, trim: true },
        image_front: { type: String, trim: true },
        image_back: { type: String, trim: true },
      },
      driving_license: {
        id: { type: String, trim: true },
        issue_date: { type: String, trim: true },
        class: { type: String, enum: drivingLicenseClass },
        image_front: { type: String, trim: true },
        image_back: { type: String, trim: true },
        state: { type: String, trim: true },
      },
      reports: {
        puskakom: {
          image_front: { type: String, trim: true },
          image_back: { type: String, trim: true },
        },
        medical: {
          image_front: { type: String, trim: true },
          image_back: { type: String, trim: true },
        },
      },
      psv_license: {
        image_front: { type: String, trim: true },
        image_back: { type: String, trim: true },
        expiry_date: { type: String, trim: true },
      },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

/**
 * Pre save
 */
UserSchema.pre('save', async function save(next) {
  try {
    // Hash the password
    if (!this.isModified('password')) return next();
    const rounds = env === 'test' ? 1 : 10;
    // Auto-gen a salt and hash
    this.password = await bcrypt.hash(this.password, rounds);
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Methods
 */
UserSchema.method({
  /** Transform into JSON */
  transform(fields) {
    const transformed = {};
    const _fields =
      fields && fields.length ? fields : ['id', 'name', 'email', 'picture', 'phone_verified', 'email_verified'];
    _fields.forEach(field => {
      transformed[field] = this[field];
    });
    return transformed;
  },
  /** Generate access token */
  token() {
    const payload = {
      exp: moment()
        .add(accessTokenExpiry, 'minutes')
        .unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.sign(payload, jwtSecret);
  },
  /** Validate user password */
  async validPassword(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
UserSchema.statics = {
  /** User roles */
  roles,
  /** Get user */
  async get(query) {
    try {
      if (query._id && !mongoose.Types.ObjectId.isValid(query._id)) {
        return undefined;
      }
      return await this.findOne(query);
    } catch (err) {
      throw err;
    }
  },
  /** Get list users */
  list({ page = 1, per_page: perPage = DEFAULT_PAGE_LIMIT, ...otherQuery }) {
    const query = omitBy(otherQuery, isNil);
    if (otherQuery.keyword) {
      query.$or = [
        { 'name.first_name': { $regex: otherQuery.keyword, $options: 'i' } },
        { 'name.last_name': { $regex: otherQuery.keyword, $options: 'i' } },
        { email: { $regex: otherQuery.keyword, $options: 'i' } },
        { phone_number: { $regex: otherQuery.keyword, $options: 'i' } },
      ];
      delete query.keyword;
    }
    return this.find(query)
      .sort({ created_at: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
  /** Find user and generate token */
  async findAndGenerateToken({ email, password, refreshObject }) {
    try {
      const user = await this.findOne({ email });
      if (password) {
        if (!user || !(await user.validPassword(password))) {
          throw new APIError({
            message: 'Incorrect email or password',
            status: httpStatus.UNAUTHORIZED,
            isPublic: true,
          });
        }
        return { user, accessToken: user.token() };
      }
      if (refreshObject && refreshObject.user_email === email) {
        if (moment(refreshObject.expires).isBefore()) {
          throw new APIError({
            message: 'Invalid refresh token',
            status: httpStatus.UNAUTHORIZED,
            isPublic: true,
          });
        }
        return { user, accessToken: user.token() };
      }
      throw new APIError({
        message: 'Incorrect email or refresh_token',
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
      });
    } catch (err) {
      throw err;
    }
  },
};

module.exports = mongoose.model('User', UserSchema);
