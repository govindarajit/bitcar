const mongoose = require('mongoose');
/**
 * Vehicle schema
 */
const CountriesSchema = new mongoose.Schema({
  country_name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  currency_unit: {
    type: String,
    trim: true,
  },
  distance_unit: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Countries', CountriesSchema);
