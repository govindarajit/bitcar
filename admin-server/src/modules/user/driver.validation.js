const Joi = require('joi');
const { objectId } = require('../../config/regexValidation');

module.exports = {
  getUsers: {
    query: {
      page: Joi.number()
        .min(1)
        .integer(),
      per_page: Joi.number()
        .min(1)
        .max(100)
        .integer(),
    },
  },

  preCreateUser: {
    body: {
      branch: Joi.string().regex(objectId), // Required has to be added
      branch_city: Joi.string()
        .max(128)
        .allow(''),
      name: {
        first_name: Joi.string().max(64),
        last_name: Joi.string().max(64),
        full_name: Joi.string().max(255),
      },
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(128)
        .required(),
      identity_card_id: Joi.string()
        .max(16)
        .required(),
      referral_code: Joi.string().max(16),
    },
  },

  createUser: {
    body: {
      branch: Joi.string().regex(objectId), // Required has to be added
      branch_city: Joi.string()
        .max(128)
        .allow(''),
      name: {
        first_name: Joi.string()
          .max(64)
          .required(),
        last_name: Joi.string()
          .max(64)
          .required(),
        full_name: Joi.string().max(255),
      },
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(128)
        .required(),
      identity_card_id: Joi.string()
        .max(16)
        .required(),
      referral_code: Joi.string()
        .max(16)
        .allow(''),
      // account_kit_code: Joi.string()
      //   .max(1024)
      //   .required(),
      // account_kit_csrf_nonce: Joi.string()
      //   .max(36)
      //   .required(),
    },
  },

  updateUser: {
    body: {
      branch: Joi.string().regex(objectId), // Required has to be added
      branch_city: Joi.string()
        .max(128)
        .allow(''),
      name: {
        first_name: Joi.string()
          .max(64)
          .required(),
        last_name: Joi.string()
          .max(64)
          .required(),
        full_name: Joi.string().max(255),
      },
      email: Joi.string()
        .email()
        .required(),
      phone_number: Joi.string()
        .max(16)
        .required(),
      activation_status: Joi.string(), // TODO: update me
      picture: Joi.string().uri(),
      invite_code: Joi.string().max(32),
      documents: {
        identity_card: {
          id: Joi.string()
            .max(16)
            .required(),
          issue_date: Joi.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/), // TODO: update validation
          image_front: Joi.string().uri(),
          image_back: Joi.string().uri(),
        },
        vehicle: {
          license_plate: Joi.string().max(16),
          color: Joi.string().max(32),
          model: Joi.string().max(64),
          capacity: Joi.number()
            .integer()
            .min(2),
          images: Joi.array().items(Joi.string().uri()),
        },
        vehicle_insurance: {
          company: Joi.string().max(255),
          expiry_date: Joi.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/), // TODO: update validation
          image_front: Joi.string().uri(),
          image_back: Joi.string().uri(),
        },
        driving_license: {
          id: Joi.string().max(16),
          issue_date: Joi.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/), // TODO: update validation
          class: Joi.string().max(8),
          image_front: Joi.string().uri(),
          image_back: Joi.string().uri(),
          state: Joi.string().max(64),
        },
        reports: {
          puskakom: {
            image_front: Joi.string()
              .uri()
              .allow(''),
            image_back: Joi.string()
              .uri()
              .allow(''),
          },
          medical: {
            image_front: Joi.string()
              .uri()
              .allow(''),
            image_back: Joi.string()
              .uri()
              .allow(''),
          },
        },
        psv_license: {
          image_front: Joi.string()
            .uri()
            .allow(''),
          image_back: Joi.string()
            .uri()
            .allow(''),
          expiry_date: Joi.string()
            .regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)
            .allow(''), // TODO: update validation
        },
      },
    },
  },
};
