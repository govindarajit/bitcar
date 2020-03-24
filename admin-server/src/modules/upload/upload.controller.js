const httpStatus = require('http-status');
const { multerImage } = require('../../config/multer');

// Multer single upload
const upload = multerImage.single('image');

/**
 * POST /upload/image
 * Upload image
 */
exports.uploadImage = (req, res, next) => {
  upload(req, res, err => {
    if (err) {
      return next(err);
    }
    res.status(httpStatus.OK).json({
      url: req.file.location,
    });
  });
};
