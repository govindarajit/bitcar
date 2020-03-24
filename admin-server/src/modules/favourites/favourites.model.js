const mongoose = require('mongoose');

/**
 * Favourites schema
 */
const FavouritesSchema = new mongoose.Schema({
  latitude: { type: String },
  longitude: { type: String },
  title_name: { type: String, trim: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: { type: String },
});

module.exports = mongoose.model('Favourites', FavouritesSchema);
