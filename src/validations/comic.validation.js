const Joi = require('joi');
const { statuses } = require('../constraints/approvalStatus');
const { UUIDV4 } = require('./custom.validation');

const createComic = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    comic_authors: Joi.array()
      .required()
      .items(
        Joi.object().keys({
          authorId: Joi.string().custom(UUIDV4),
        })
      ),
    comic_covers: Joi.array()
      .required()
      .items(
        Joi.object().keys({
          imageId: Joi.string().custom(UUIDV4),
          default: Joi.boolean(),
        })
      )
      .custom((arr, helper) => {
        const isNoOneDefaultTrue = arr.every((value) => !value.default);
        if (isNoOneDefaultTrue) {
          return helper.message('A default cover is required');
        }
        return arr;
      }),
    comic_formats: Joi.array()
      .required()
      .items(
        Joi.object().keys({
          formatId: Joi.string().custom(UUIDV4),
        })
      ),
    comic_genres: Joi.array()
      .required()
      .items(
        Joi.object().keys({
          genreId: Joi.string().custom(UUIDV4),
        })
      ),
  }),
};

const getComics = {
  query: Joi.object().keys({
    search: Joi.string().allow('', null),
    scope: Joi.string().allow('', null),
    sortBy: Joi.string(),
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
  }),
};

const getComic = {
  query: Joi.object().keys({
    scope: Joi.string().allow('', null),
  }),
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
  }),
};

const updateComic = {
  params: Joi.object().keys({
    comicId: Joi.required().custom(UUIDV4),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    approval_status: Joi.string()
      .allow(null)
      .valid(...statuses, null),
    restore: Joi.string().allow(true),
    comic_authors: Joi.array().items(
      Joi.object().keys({
        authorId: Joi.string().custom(UUIDV4),
      })
    ),
    comic_covers: Joi.array()
      .items(
        Joi.object().keys({
          imageId: Joi.string().custom(UUIDV4),
          default: Joi.boolean(),
        })
      )
      .custom((arr, helper) => {
        const isNoOneDefaultTrue = arr.every((value) => !value.default);
        if (isNoOneDefaultTrue) {
          return helper.message('A default cover is required');
        }
        return arr;
      }),
    comic_formats: Joi.array().items(
      Joi.object().keys({
        formatId: Joi.string().custom(UUIDV4),
      })
    ),
    comic_genres: Joi.array().items(
      Joi.object().keys({
        genreId: Joi.string().custom(UUIDV4),
      })
    ),
  }),
};

const deleteComic = {
  params: Joi.object().keys({
    comicId: Joi.string().custom(UUIDV4),
  }),
};

module.exports = {
  createComic,
  getComics,
  getComic,
  updateComic,
  deleteComic,
};
