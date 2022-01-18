/* eslint-disable camelcase */
const _ = require('lodash');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const sequelize = require('../models/db');
const { Comic, ComicAuthor, ComicGenre, ComicFormat, ComicCover } = require('../models');

const pick = require('../utils/pick');
const sortByConvert = require('../utils/sortByConvert');
const ApiError = require('../utils/ApiError');
const strings = require('../constraints/strings');

const {
  comic: { errors },
} = strings;
/**
 * Get comic by id
 * @param {ObjectId} id
 * @returns {Promise<Comic>}
 */
const getComicById = async (id, options) => {
  return Comic.findByPk(id, options);
};

/**
 * Create a comic
 * @param {Object} comicBody
 * @returns {Promise<Comic>}
 */

const createComic = async (comicBody, options) => {
  const comic = await Comic.create(comicBody, {
    ...options,
    include: [
      { model: ComicAuthor, as: 'comic_authors' },
      { model: ComicGenre, as: 'comic_genres' },
      { model: ComicFormat, as: 'comic_formats' },
      { model: ComicCover, as: 'comic_covers' },
    ],
  });
  return comic.toJSON();
};

/**
 * Query for comics
 * @returns {Promise<QueryResult>}
 */
const queryComics = async (options) => {
  const paginationOptions = _.omit(options, ['include']);
  const result = await Comic.paginate(paginationOptions);
  const detailOptions = {
    where: {
      id: { [Op.in]: result.data.map((cover) => cover.id) },
    },
    paranoid: false,
    order: options.sortBy ? sortByConvert(options.sortBy) : [['createdAt', 'ASC']],
    ..._.pick(options, ['include', 'attributes']),
  };
  const comics = await Comic.findAll(detailOptions);
  result.data = comics;
  return result;
};

/**
 * Query for comics
 * @returns {Promise<QueryResult>}
 */
const customQueryComics = async (options, paginationOptions) => {
  const result = await Comic.customPaginate(paginationOptions);
  const detailOptions = {
    where: {
      id: { [Op.in]: result.data.map((comic) => comic.id) },
    },
    paranoid: false,
    order: options.sortBy ? sortByConvert(options.sortBy) : [['createdAt', 'ASC']],
    ..._.pick(options, ['include', 'attributes']),
  };
  const comics = await Comic.findAll(detailOptions);
  result.data = comics;
  return result;
};

/**
 * Update comic by id
 * @param {ObjectId} comicId
 * @param {Object} updateBody
 * @returns {Promise<Comic>}
 */
const updateComicById = async (comicId, updateBody, options) => {
  const comicBody = pick(updateBody, ['title', 'description', 'approval_status']);
  const t = pick(updateBody, ['comic_authors', 'comic_genres', 'comic_formats', 'comic_covers']);
  const comic = await getComicById(comicId, options);
  if (!comic) return null;
  const transaction = await sequelize.transaction();
  try {
    await Promise.all(
      [
        { model: ComicAuthor, data: t.comic_authors, idColumn: 'authorId' },
        { model: ComicFormat, data: t.comic_formats, idColumn: 'formatId' },
        { model: ComicGenre, data: t.comic_genres, idColumn: 'genreId' },
        {
          model: ComicCover,
          data: t.comic_covers,
          idColumn: 'imageId',
        },
      ].map(
        ({ model, data, idColumn }) =>
          // eslint-disable-next-line no-async-promise-executor
          new Promise(async (resolve, reject) => {
            if (!(data && data.length)) {
              resolve();
            }
            try {
              await model.bulkCreate(
                data.map((value) => ({ ...value, comicId: comic.id })),
                {
                  ignoreDuplicates: true,
                  transaction,
                }
              );
              await model.destroy(
                {
                  where: { comicId: comic.id, [idColumn]: { [Op.notIn]: data.map((value) => value[idColumn]) } },
                },
                {
                  transaction,
                }
              );
              resolve();
            } catch (err) {
              reject(err);
            }
          })
      )
    );
    // TODO: Workaround since bulkCreate with updateOnDuplicate bug
    if (t.comic_covers && t.comic_covers.length) {
      const [oldDefaultCover] = comic.toJSON().covers;
      const newDefaultCover = t.comic_covers.find((cover) => cover.default);
      if (oldDefaultCover && oldDefaultCover.id !== newDefaultCover.imageId) {
        const currentDefaultCoverInDb =
          oldDefaultCover &&
          oldDefaultCover.id &&
          (await ComicCover.findOne({
            where: { imageId: oldDefaultCover.id, comicId: comic.id },
          }));
        const newDefaultCoverInDb = await ComicCover.findOne({
          where: {
            imageId: newDefaultCover.imageId,
            comicId: comic.id,
          },
        });
        if (currentDefaultCoverInDb) {
          await currentDefaultCoverInDb.update({ default: false }, { transaction });
          await currentDefaultCoverInDb.save();
        }
        if (newDefaultCoverInDb) {
          await newDefaultCoverInDb.update({ default: true }, { transaction });
          await newDefaultCoverInDb.save();
        }
      }
    }
    await comic.update(comicBody, {
      transaction,
    });
    await comic.save();
    await transaction.commit();
    return comic;
  } catch (err) {
    await transaction.rollback();
    throw new Error(err);
  }
};

/**
 * Delete comic by id
 * @param {ObjectId} comicId
 * @returns {Promise<Comic>}
 */
const deleteComicById = async (comicId) => {
  const comic = await getComicById(comicId);
  if (!comic) {
    throw new ApiError(httpStatus.NOT_FOUND, errors.notFound);
  }
  await comic.destroy();
  return comic;
};

const increaseViewCount = async (comicId) => {
  await Comic.increment(
    { viewCount: 1 },
    {
      where: {
        id: comicId,
      },
    }
  );
  return true;
};

const getComicByAuthor = async (comicId, authorId) => {
  return ComicAuthor.findOne({
    comicId,
    authorId,
  });
};

module.exports = {
  createComic,
  queryComics,
  getComicById,
  updateComicById,
  deleteComicById,
  increaseViewCount,
  customQueryComics,
  getComicByAuthor,
};
