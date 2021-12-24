const Joi = require('joi');
const { UUIDV4 } = require('./custom.validation');

const createAuthor = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
  }),
};

const getAuthors = {
  query: Joi.object().keys({
    search: Joi.string().allow('', null),
    scope: Joi.string().allow('', null),
    sortBy: Joi.string(),
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
  }),
};

const getAuthor = {
  params: Joi.object().keys({
    authorId: Joi.string().custom(UUIDV4),
  }),
};

const updateAuthor = {
  params: Joi.object().keys({
    authorId: Joi.required().custom(UUIDV4),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().allow(null),
      description: Joi.string().allow(''),
      restricted: Joi.boolean().allow(null),
      restore: Joi.string().allow(true),
    })
    .min(1),
};

const deleteAuthor = {
  params: Joi.object().keys({
    authorId: Joi.string().custom(UUIDV4),
  }),
};

module.exports = {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
