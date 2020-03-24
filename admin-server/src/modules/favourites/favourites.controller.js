const httpStatus = require('http-status');
const FavouritesModel = require('./favourites.model');

/**
 * POST /Favourites/
 * Add Favourites
 */
exports.addFavourites = async (req, res, next) => {
  try {
    const fav = new FavouritesModel({
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      title_name: req.body.title_name,
      user_id: req.body.user_id,
      address: req.body.address,
    });
    await fav.save();
    res.sendStatus(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};
/**
 * GET /Favourites/
 * Get Favourites Locations
 */
exports.getFavLocations = async (req, res, next) => {
  try {
    await FavouritesModel.find({ user_id: req.body.id }, (err, result) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(httpStatus.CREATED).send(result);
      }
    });
  } catch (err) {
    return next(err);
  }
};
