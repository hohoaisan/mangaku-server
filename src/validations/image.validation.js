const Joi = require('joi');

const createImage = {
  body: Joi.object()
    .keys({
      file: Joi.string().required(),
    })
    .unknown(true),
};

module.exports = {
  createImage,
};
