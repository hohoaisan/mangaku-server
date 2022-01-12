const Joi = require('joi');
const { statuses } = require('../constraints/approvalStatus');
const { UUIDV4 } = require('./custom.validation');

const createChapter = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
  }),
  body: Joi.object().keys({
    number: Joi.number().min(0).required(),
    name: Joi.string().required(),
    volume: Joi.number().min(1).required(),
    pages: Joi.array()
      .required()
      .items(
        Joi.object().keys({
          imageId: Joi.string().required().custom(UUIDV4),
          order: Joi.number().min(1).required(),
        })
      ),
  }),
};

const getChapters = {
  query: Joi.object().keys({
    scope: Joi.string().allow('', null),
    sortBy: Joi.string(),
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
  }),
};

const getChapter = {
  query: Joi.object().keys({
    scope: Joi.string().allow('', null),
  }),
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
    chapterId: Joi.string().custom(UUIDV4),
  }),
};

const updateChapter = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
    chapterId: Joi.string().custom(UUIDV4),
  }),
  body: Joi.object().keys({
    restore: Joi.boolean().allow(true),
    number: Joi.number().min(0),
    name: Joi.string(),
    volume: Joi.number().min(1),
    approval_status: Joi.string()
      .allow(null)
      .valid(...statuses, null),
    pages: Joi.array().items(
      Joi.object().keys({
        imageId: Joi.string().required().custom(UUIDV4),
        order: Joi.number().min(1).required(),
      })
    ),
  }),
};

const deleteChapter = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
    chapterId: Joi.string().custom(UUIDV4),
  }),
};

module.exports = {
  createChapter,
  getChapter,
  getChapters,
  deleteChapter,
  updateChapter,
};
