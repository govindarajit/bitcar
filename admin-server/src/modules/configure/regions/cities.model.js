const mongoose = require('mongoose');
/**
 * Vehicle schema
 */
const CitiesModelSchema = new mongoose.Schema({
  city_name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Countries',
    required: true,
  },
  vehicle_type: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicles',
    },
  ],
  status: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Cities', CitiesModelSchema);
