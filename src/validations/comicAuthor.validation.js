const Joi = require('joi');
const { UUIDV4 } = require('./custom.validation');

const createComic = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
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

const updateComic = {
  params: Joi.object().keys({
    comicId: Joi.required().custom(UUIDV4),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
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

module.exports = {
  createComic,
  updateComic,
};
