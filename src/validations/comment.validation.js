const Joi = require('joi');
const { UUIDV4 } = require('./custom.validation');

const createComment = {
  body: Joi.object().keys({
    content: Joi.string().allow('').max(200),
  }),
};

const getComments = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
  }),
};

const getComment = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
    commentId: Joi.string().custom(UUIDV4),
  }),
};

const updateComment = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
    commentId: Joi.required().custom(UUIDV4),
  }),
  body: Joi.object()
    .keys({
      content: Joi.string().allow('').max(200),
    })
    .min(1),
};

const deleteComment = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
    commentId: Joi.string().custom(UUIDV4),
  }),
};

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
};
