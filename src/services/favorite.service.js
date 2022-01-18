const _ = require('lodash');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Favorite } = require('../models');
const ApiError = require('../utils/ApiError');
const comicQuery = require('../queries/comic.queries');
const withSequelizeSearch = require('../utils/withSequelizeSearch');
const sortByConvert = require('../utils/sortByConvert');
const strings = require('../constraints/strings');

const {
  favorite: { errors },
} = strings;
/**
 * Get favorite by id
 * @param {ObjectId} id
 * @returns {Promise<Favorite>}
 */
const getFavorite = async (userId, comicId) => {
  return Favorite.findOne({
    where: {
      userId,
      comicId,
    },
  });
};

/**
 * Create a favorite
 * @param {Object} favoriteBody
 * @returns {Promise<Favorite>}
 */

const createFavorite = async (userId, comicId) => {
  const existed = await getFavorite(userId, comicId);
  if (existed) {
    return existed;
  }
  const favorite = await Favorite.create({
    userId,
    comicId,
  });
  return favorite;
};

/**
 * Query for favorites
 * @returns {Promise<QueryResult>}
 */
const queryFavorites = async (userId, options) => {
  const { search } = _.pick(options, ['search']);
  const ommitedOptions = _.omit(options, ['search']);
  const paginationOptions = _.extend(
    {
      where: {
        userId,
      },
      order: options.sortBy ? sortByConvert(options.sortBy) : [['createdAt', 'DESC']],
      include: [
        {
          association: 'comic',
          ...withSequelizeSearch(search, ['title', 'description'])(),
          attributes: [],
        },
      ],
    },
    ommitedOptions
  );
  const paginatedFavirotes = await Favorite.paginate(paginationOptions);
  const ids = paginatedFavirotes.data.map(({ comicId }) => comicId);
  const detailedOptions = _.extend(
    {
      where: {
        userId,
        comicId: { [Op.in]: ids },
      },
      order: options.sortBy ? sortByConvert(options.sortBy) : [['createdAt', 'DESC']],
      include: [
        {
          association: 'comic',
          ..._.pick(comicQuery.default, ['include', 'attributes']),
        },
      ],
    },
    ommitedOptions
  );

  const favorites = await Favorite.findAll(detailedOptions);
  paginatedFavirotes.data = favorites;
  return paginatedFavirotes;
};

/**
 * Delete favorite by id
 * @param {ObjectId} favoriteId
 * @returns {Promise<Favorite>}
 */
const deleteFavorite = async (userId, comicId) => {
  const favorite = await getFavorite(userId, comicId);
  if (!favorite) {
    throw new ApiError(httpStatus.BAD_REQUEST, errors.notFavorited);
  }
  await favorite.destroy();
  return favorite;
};

module.exports = {
  getFavorite,
  queryFavorites,
  createFavorite,
  deleteFavorite,
};
