const Joi = require('joi');
const { roles } = require('../config/roles');
const { password, UUIDV4 } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    scope: Joi.string().allow(null),
    search: Joi.string().allow('', null),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(UUIDV4),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(UUIDV4),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      role: Joi.string()
        .allow(null)
        .valid(...roles),
      banned: Joi.boolean(),
      emailVerified: Joi.boolean(),
      restore: Joi.string().allow(true),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(UUIDV4),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
