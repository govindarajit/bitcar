const httpStatus = require('http-status');
const Vehicles = require('./vehicle.model');
const VehicleModel = require('./vehicleModel.model');
const APIError = require('../../../helpers/APIError');

/**
 * POST /configure/vehicle/addVehicleType
 * Add Vehicle Type
 */
exports.addVehicleType = async (req, res, next) => {
  try {
    const vehicle = await new Vehicles();
    vehicle.picture = req.body.picture;
    vehicle.vehicle_name = req.body.vehicle_name;
    vehicle.short_description = req.body.short_description;
    vehicle.long_description = req.body.long_description;
    vehicle.status = req.body.status;
    await vehicle.save();
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
        message: 'Vehicle Name is required',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    return next(err);
  }
};

/**
 * GET /configure/vehicle/getVehicleType
 * Get Vehicle Type
 */
exports.getVehicleType = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
    };
    const { page, perPage } = query;
    const docCount = await Vehicles.count();
    const totalCount = docCount;
    const vehicles = await Vehicles.find()
      .skip((Number(page) - 1) * Number(perPage))
      .limit(Number(perPage))
      .sort({ created_at: -1 });

    res.status(httpStatus.OK).json({
      vehicles,
      total_count: totalCount,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /configure/vehicle/getSingleVehicleType
 * Get Details of selected Vehicle Type
 */

exports.getSingleVehicleType = async (req, res, next) => {
  try {
    const vehicle = await Vehicles.find({ _id: req.body.id });
    res.status(httpStatus.OK).json({
      vehicle,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /configure/vehicle/updateVehicleType
 * Update Vehicle Type
 */
exports.updateVehicleType = async (req, res, next) => {
  try {
    const vehicle = await Vehicles.findOne({ _id: req.body.id });
    vehicle.picture = req.body.picture;
    vehicle.vehicle_name = req.body.vehicle_name;
    vehicle.short_description = req.body.short_description;
    vehicle.long_description = req.body.long_description;
    vehicle.status = req.body.status;
    await vehicle.save();
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
        message: 'Vehicle Name is required',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    return next(err);
  }
};

/**
 * POST /configure/vehicle/deleteVehicleType
 * Delete Vehicle Type
 */
exports.deleteVehicleType = async (req, res, next) => {
  try {
    const vehicle = await Vehicles.findOne({ _id: req.body.id });
    vehicle.delete();
    await VehicleModel.find({ vehicle_id: req.body.id }).remove();
    res.send(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /configure/vehicle/addVehicleModel
 * Add Vehicle Model
 */
exports.addVehicleModel = async (req, res, next) => {
  try {
    const vehicle = await Vehicles.findOne({ vehicle_name: req.body.vehicle_name });
    const id = vehicle._id;
    const vehicleModel = await VehicleModel();
    vehicleModel.vehicle_model = req.body.vehicle_model;
    vehicleModel.short_description = req.body.short_description;
    vehicleModel.long_description = req.body.long_description;
    vehicleModel.status = req.body.status;
    vehicleModel.vehicle_id = id;
    await vehicleModel.save();
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
        message: 'Vehicle Model is required',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    return next(err);
  }
};

/**
 * GET /configure/vehicle/getVehicleModel
 * Get Vehicle Type
 */
exports.getVehicleModel = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
    };
    const { page, perPage } = query;
    const docCount = await VehicleModel.count();
    const totalCount = docCount;
    const vehiclemodels = await VehicleModel.find()
      .skip((Number(page) - 1) * Number(perPage))
      .limit(Number(perPage))
      .populate('vehicle_id', 'vehicle_name')
      .sort({ created_at: -1 });
    res.status(httpStatus.OK).json({
      vehiclemodels,
      total_count: totalCount,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /configure/vehicle/getSingleVehicleModel
 * Get Details of selected Vehicle Model
 */

exports.getSingleVehicleModel = async (req, res, next) => {
  try {
    const vehiclemodels = await VehicleModel.find({ _id: req.body.id }).populate('vehicle_id', 'vehicle_name');
    res.status(httpStatus.OK).json({
      vehiclemodels,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /configure/vehicle/updateVehicleType
 * Update Vehicle Type
 */
exports.updateVehicleModel = async (req, res, next) => {
  try {
    const vehiclemodels = await VehicleModel.findOne({ _id: req.body.id });
    vehiclemodels.vehicle_model = req.body.vehicle_model;
    vehiclemodels.short_description = req.body.short_description;
    vehiclemodels.long_description = req.body.long_description;
    vehiclemodels.status = req.body.status;
    await vehiclemodels.save();
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
        message: 'Vehicle Model is required',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(error);
    }
    return next(err);
  }
};

/**
 * POST /configure/vehicle/deleteVehicleType
 * Delete Vehicle Type
 */
exports.deleteVehicleModel = async (req, res, next) => {
  try {
    const vehiclemodels = await VehicleModel.findOne({ _id: req.body.id });
    vehiclemodels.delete();
    res.send(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};
