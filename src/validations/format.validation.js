const Joi = require('joi');
const { UUIDV4 } = require('./custom.validation');

const createFormat = {
  body: Joi.object().keys({
    key: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow(''),
  }),
};

const getFormats = {
  query: Joi.object().keys({
    search: Joi.string().allow('', null),
  }),
};

const getFormat = {
  params: Joi.object().keys({
    formatId: Joi.string().custom(UUIDV4),
  }),
};

const updateFormat = {
  params: Joi.object().keys({
    formatId: Joi.required().custom(UUIDV4),
  }),
  body: Joi.object()
    .keys({
      key: Joi.string(),
      name: Joi.string(),
      description: Joi.string().allow(''),
    })
    .min(1),
};

const deleteFormat = {
  params: Joi.object().keys({
    formatId: Joi.string().custom(UUIDV4),
  }),
};

module.exports = {
  createFormat,
  getFormats,
  getFormat,
  updateFormat,
  deleteFormat,
};
