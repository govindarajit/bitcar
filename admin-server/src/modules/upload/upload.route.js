const express = require('express');
const uploadCtrl = require('./upload.controller');

const router = express.Router();

/** POST /upload/image - Upload image */
router.route('/image').post(uploadCtrl.uploadImage);

module.exports = router;
