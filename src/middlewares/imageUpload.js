const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { MAX_FILE_SIZE, UPLOAD_DESTINATION, ALLOWED_FILE_TYPES } = require('../config/image');
const wrapper = require('./fileUpload');

function checkFileType(file, cb) {
  const allowedFileTypes = ALLOWED_FILE_TYPES;
  const checkExtName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const checkMimeType = allowedFileTypes.test(file.mimetype);
  if (checkMimeType && checkExtName) {
    return cb(null, true);
  }
  return cb(new ApiError(httpStatus.BAD_REQUEST, `Only ${ALLOWED_FILE_TYPES} format are allowed!`), false);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_DESTINATION);
  },
  filename(req, file, cb) {
    const newFileName = `${path.parse(file.originalname).name}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, newFileName); // Appending extension
  },
});

const imageUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter(_req, file, cb) {
    checkFileType(file, cb);
  },
});

const singleImageUpload = (field = 'file') => {
  return wrapper(imageUpload.single(field), (req, res, next) => {
    if (!req.file) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'An image is required'));
    }
    req.body.file = `/${req.file.path.replaceAll('\\', '/')}`;
    next();
  });
};

module.exports = imageUpload;

module.exports.singleImageUpload = singleImageUpload;
