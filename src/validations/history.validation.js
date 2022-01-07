const Joi = require('joi');
const { UUIDV4 } = require('./custom.validation');

const getAllComicHistory = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string().allow('', null),
  }),
};

const getComicLastRead = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
  }),
};

const deleteComicHistory = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
  }),
};

const createComicChapterRead = {
  params: Joi.object().keys({
    comicId: Joi.required().custom(UUIDV4),
    chapterId: Joi.required().custom(UUIDV4),
  }),
};

module.exports = {
  getAllComicHistory,
  getComicLastRead,
  deleteComicHistory,
  createComicChapterRead,
};
