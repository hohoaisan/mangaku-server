const Joi = require('joi');
const { UUIDV4 } = require('./custom.validation');

const createFavorite = {
  body: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4).required(),
  }),
};

const getFavorites = {
  query: Joi.object().keys({
    search: Joi.string().allow('', null),
    sortBy: Joi.string(),
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
  }),
};

const getFavorite = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
  }),
};

const deleteFavorite = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
  }),
};

module.exports = {
  createFavorite,
  getFavorites,
  getFavorite,
  deleteFavorite,
};
