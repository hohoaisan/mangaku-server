const multer = require('multer');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

/**
 * Wrapper middleware for multer and handling both error and uploaded file within a callback
 * @param {function} multerUploadHandler
 * @param {function} callback
 * @returns {ExpressMiddleware}
 */

const wrapper = (multerUploadHandler, callback) => (req, res, next) => {
  multerUploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(new ApiError(httpStatus.BAD_REQUEST, err.message));
    }
    if (err) {
      return next(err);
    }
    if (typeof callback === 'function') return callback(req, res, next);
    next();
  });
};

module.exports = wrapper;
