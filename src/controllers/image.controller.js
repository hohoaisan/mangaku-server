const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { imageService } = require('../services');

const createImage = catchAsync(async (req, res) => {
  const value = {
    url: req.body.file,
    uploader: req.user.id,
  };
  const image = await imageService.createImage(value);
  res.status(httpStatus.CREATED).send(image);
});

module.exports = {
  createImage,
};
