const { Image } = require('../models');

const createImage = async (imageBody) => {
  const image = await Image.create(imageBody);
  return image.toJSON();
};

module.exports = {
  createImage,
};
