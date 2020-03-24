const httpStatus = require('http-status');
const User = require('mongoose').model('User');
const { DEFAULT_PAGE_LIMIT } = require('../../config/vars');

/**
 * GET /search
 * Search normal
 */
exports.searchNormal = async (req, res, next) => {
  try {
    if (req.query.target !== 'driver' || !req.query.keyword) {
      return res.status(httpStatus.OK).json([]);
    }
    const users = await User.find({
      role: 'driver',
      $or: [
        { 'name.first_name': { $regex: req.query.keyword, $options: 'i' } },
        { 'name.last_name': { $regex: req.query.keyword, $options: 'i' } },
        { email: { $regex: req.query.keyword, $options: 'i' } },
        { phone_number: { $regex: req.query.keyword, $options: 'i' } },
      ],
    })
      .sort({ created_at: -1 })
      .limit(req.query.limit || DEFAULT_PAGE_LIMIT);
    const usersTransformed = users.map(user => user.transform(['id', 'email', 'name', 'phone_number']));
    return res.status(httpStatus.OK).json(usersTransformed);
  } catch (err) {
    return next(err);
  }
};
