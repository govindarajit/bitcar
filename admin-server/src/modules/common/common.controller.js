const httpStatus = require('http-status');
// const Branch = require('mongoose').model('Branch');
const Countries = require('../configure/regions/countries.model');
const Cities = require('../configure/regions/cities.model');

/**
 * GET /common/getCountries
 * Get list of countries
 */
exports.getCountries = async (req, res, next) => {
  try {
    const countries = await Countries.find();
    res.status(httpStatus.OK).json(countries);
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /common/getCities
 * Get list of cities belong to a country
 */
exports.getCities = async (req, res, next) => {
  try {
    const cities = await Cities.find({ country_id: req.body.id });
    res.status(httpStatus.OK).json(cities);
  } catch (err) {
    return next(err);
  }
};
