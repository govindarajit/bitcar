const mongoose = require('mongoose');
/**
 * Vehicle schema
 */
const VehicleSchema = new mongoose.Schema({
  picture: {
    type: String,
    trim: true,
  },
  vehicle_name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  short_description: {
    type: String,
    trim: true,
  },
  long_description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Vehicles', VehicleSchema);
