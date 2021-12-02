const Joi = require('joi');
const { UUIDV4 } = require('./custom.validation');

const createGenre = {
  body: Joi.object().keys({
    key: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow(''),
  }),
};

const getGenres = {
  query: Joi.object().keys({
    search: Joi.string().allow('', null),
  }),
};

const getGenre = {
  params: Joi.object().keys({
    genreId: Joi.string().custom(UUIDV4),
  }),
};

const updateGenre = {
  params: Joi.object().keys({
    genreId: Joi.required().custom(UUIDV4),
  }),
  body: Joi.object()
    .keys({
      key: Joi.string(),
      name: Joi.string(),
      description: Joi.string().allow(''),
    })
    .min(1),
};

const deleteGenre = {
  params: Joi.object().keys({
    genreId: Joi.string().custom(UUIDV4),
  }),
};

module.exports = {
  createGenre,
  getGenres,
  getGenre,
  updateGenre,
  deleteGenre,
};
