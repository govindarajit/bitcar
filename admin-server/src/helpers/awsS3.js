const path = require('path');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const uuidv4 = require('uuid/v4');
const { awsKeyId, awsSecretKey, awsRegion } = require('../config/config');

// Define vars
const AWS_S3_BUCKET = 'bitcar.s3';
const ACL = 'public-read';
const CACHE_CONTROL = 'public, max-age=31536000';

// S3 credential
const s3Credential = {
  accessKeyId: awsKeyId,
  secretAccessKey: awsSecretKey,
  region: awsRegion,
};

// Register credential
aws.config.update(s3Credential);

// Initialize S3 service
const s3 = new aws.S3();

// AWS S3 Storage config
exports.s3Storage = multerS3({
  s3,
  bucket: AWS_S3_BUCKET,
  acl: ACL,
  cacheControl: CACHE_CONTROL,
  metadata: (req, file, cb) => {
    cb(null, Object.assign({}, req.body));
  },
  key: (req, file, cb) => {
    const extName = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4().replace(/-/g, '_')}_o${extName}`);
  },
});
