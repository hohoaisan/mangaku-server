const Joi = require('joi');
const { UUIDV4 } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    content: Joi.string().allow('').max(200),
    rating: Joi.number().allow(null).min(1).max(5),
  }),
};

const getReview = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
    userId: Joi.string().custom(UUIDV4),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
    userId: Joi.string().custom(UUIDV4),
  }),
  body: Joi.object().keys({
    content: Joi.string().allow('').max(200),
    rating: Joi.number().allow(null).min(1).max(5),
  }),
};

const deleteReview = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
    userId: Joi.string().custom(UUIDV4),
  }),
};

module.exports = {
  createReview,
  getReview,
  updateReview,
  deleteReview,
};
