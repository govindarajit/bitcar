const path = require('path');
const httpStatus = require('http-status');
const multer = require('multer');
const { s3Storage } = require('../helpers/awsS3');
const APIError = require('../helpers/APIError');

// Limit size of image uploaded (5MB) (5 * 1024 * 1024)
const LIMIT_IMAGE_SIZE = 5242880;

// Set storage
const storage = s3Storage;

// Image limit configs
const imageLimits = { fileSize: LIMIT_IMAGE_SIZE };

// Image filter
const imageFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|bmp/;
  const mimeType = fileTypes.test(file.mimetype);
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  }
  const err = new APIError({
    message: `Image upload only supports the following types - ${fileTypes}`,
    status: httpStatus.BAD_REQUEST,
    isPublic: true,
  });
  cb(err);
};

exports.multerImage = multer({ storage, limits: imageLimits, fileFilter: imageFilter });
