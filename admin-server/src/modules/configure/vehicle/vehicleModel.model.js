const mongoose = require('mongoose');
/**
 * Vehicle schema
 */
const VehicleModelSchema = new mongoose.Schema({
  vehicle_model: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicles',
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

module.exports = mongoose.model('VehicleModel', VehicleModelSchema);
