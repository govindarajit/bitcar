const httpStatus = require('http-status');
const Countries = require('./countries.model');
const Cities = require('./cities.model');
const APIError = require('../../../helpers/APIError');

/**
 * POST /configure/regions/addCountries
 * Add Countries
 */
exports.addCountries = async (req, res, next) => {
  try {
    const countries = await new Countries();
    countries.country_name = req.body.country_name;
    countries.currency_unit = req.body.currency_unit;
    countries.distance_unit = req.body.distance_unit;
    countries.status = req.body.status;
    await countries.save();
    res.send(httpStatus.CREATED);
  } catch (err) {
    if (err.code === 11000) {
      const error = new APIError({
        message: 'Record Already Exists',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }

    if (err.name === 'ValidationError') {
      const error = new APIError({
        message: 'Country Name is required',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    return next(err);
  }
};

/**
 * GET /configure/regions/getCountries
 * Get Vehicle Type
 */
exports.getCountries = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
    };
    const { page, perPage } = query;
    const countriesLength = await Countries.count();
    const totalCount = countriesLength;
    const countries = await Countries.find()
      .skip((Number(page) - 1) * Number(perPage))
      .limit(Number(perPage))
      .sort({ created_at: -1 });
    res.status(httpStatus.OK).json({
      countries,
      total_count: totalCount,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /configure/regions/getSingleCountries
 * Get Details of selected Vehicle Type
 */

exports.getSingleCountries = async (req, res, next) => {
  try {
    const countries = await Countries.find({ _id: req.body.id });
    res.status(httpStatus.OK).json({
      countries,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /configure/regions/updateCountries
 * Update Countries
 */
exports.updateCountries = async (req, res, next) => {
  try {
    const countries = await Countries.findOne({ _id: req.body.id });
    countries.country_name = req.body.country_name;
    countries.currency_unit = req.body.currency_unit;
    countries.distance_unit = req.body.distance_unit;
    countries.status = req.body.status;
    await countries.save();
    res.send(httpStatus.OK);
  } catch (err) {
    if (err.code === 11000) {
      const error = new APIError({
        message: 'Record Already Exists',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    if (err.name === 'ValidationError') {
      const error = new APIError({
        message: 'Country Name is required',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    return next(err);
  }
};

/**
 * POST /configure/regions/deleteCountries
 * Delete Country
 */
exports.deleteCountries = async (req, res, next) => {
  try {
    const countries = await Countries.findOne({ _id: req.body.id });
    countries.delete();
    await Cities.find({ country_id: req.body.id }).remove();
    res.send(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /configure/regions/addCities
 * Add Cities
 */
exports.addCities = async (req, res, next) => {
  try {
    const countries = await Countries.findOne({ country_name: req.body.country_name });
    const id = countries._id;
    const cities = await Cities();
    cities.city_name = req.body.city_name;
    cities.country_id = id;
    cities.vehicle_type = req.body.vehicle_type;
    cities.status = req.body.status;
    await cities.save();
    res.send(httpStatus.CREATED);
  } catch (err) {
    if (err.code === 11000) {
      const error = new APIError({
        message: 'Record Already Exists',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    if (err.name === 'ValidationError') {
      const error = new APIError({
        message: 'City Name is required',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    return next(err);
  }
};

/**
 * GET /configure/regions/getCities
 * Get Cities
 */
exports.getCities = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
    };
    const { page, perPage } = query;
    const citiesLength = await Cities.count();
    const totalCount = citiesLength;
    const cities = await Cities.find()
      .skip((Number(page) - 1) * Number(perPage))
      .limit(Number(perPage))
      .populate('country_id', 'country_name')
      .populate('vehicle_type', 'vehicle_name')
      .sort({ created_at: -1 });
    res.status(httpStatus.OK).json({
      cities,
      total_count: totalCount,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /configure/regions/getSingleCities
 * Get Details of selected City
 */

exports.getSingleCities = async (req, res, next) => {
  try {
    const cities = await Cities.find({ _id: req.body.id })
      .populate('country_id', 'country_name')
      .populate('vehicle_type', 'vehicle_name');
    res.status(httpStatus.OK).json({
      cities,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /configure/vehicle/updateCities
 * Update City
 */
exports.updateCities = async (req, res, next) => {
  try {
    const cities = await Cities.findOne({ _id: req.body.id });
    cities.city_name = req.body.city_name;
    cities.vehicle_type = req.body.vehicle_type;
    cities.status = req.body.status;
    await cities.save();
    res.send(httpStatus.OK);
  } catch (err) {
    if (err.code === 11000) {
      const error = new APIError({
        message: 'Record Already Exists',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    if (err.name === 'ValidationError') {
      const error = new APIError({
        message: 'City Name is required',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    return next(err);
  }
};

/**
 * POST /configure/vehicle/deleteCities
 * Delete Cities
 */
exports.deleteCities = async (req, res, next) => {
  try {
    const cities = await Cities.findOne({ _id: req.body.id });
    cities.delete();
    res.send(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};
