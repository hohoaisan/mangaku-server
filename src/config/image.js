const { staticPath } = require('./config').file;

const MAX_IMAGE_FILE_SIZE = 5242880;
const UPLOAD_DESTINATION = `${staticPath}/images/`;
const ALLOWED_FILE_TYPES = /jpeg|jpg|png/;

module.exports = {
  MAX_IMAGE_FILE_SIZE,
  UPLOAD_DESTINATION,
  ALLOWED_FILE_TYPES,
};
