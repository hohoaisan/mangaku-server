const Joi = require('joi');

const createImage = {
  body: Joi.object().keys({
    file: Joi.string().required(),
  }),
};

module.exports = {
  createImage,
};
