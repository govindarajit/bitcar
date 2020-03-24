const Joi = require('joi');

module.exports = {
  searchNormal: {
    query: {
      target: Joi.string().allow(''),
      keyword: Joi.string().allow(''),
      limit: Joi.number()
        .integer()
        .min(1)
        .max(100),
    },
  },
};
