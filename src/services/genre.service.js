const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Genre } = require('../models');
const ApiError = require('../utils/ApiError');
const strings = require('../constraints/strings');

const {
  genre: { errors },
} = strings;
/**
 * Get genre by id
 * @param {ObjectId} id
 * @returns {Promise<Genre>}
 */
const getGenreById = async (id, options) => {
  return Genre.findByPk(id, options);
};

/**
 * Get genre by id
 * @param {ObjectId} key
 * @returns {Promise<Genre>}
 */
const getGenreByKey = async (key, options = {}) => {
  const { excludeKey, ...restOptions } = options;
  if (excludeKey) {
    return Genre.findOne({ where: { key: { [Op.eq]: key, [Op.not]: excludeKey } }, ...options });
  }
  return Genre.findOne({ where: { key }, ...restOptions });
};

/**
 * Create a genre
 * @param {Object} genreBody
 * @returns {Promise<Genre>}
 */

const createGenre = async (genreBody) => {
  const genre = await Genre.create(genreBody);
  return genre.toJSON();
};

/**
 * Query for genres
 * @returns {Promise<QueryResult>}
 */
const queryGenres = async (options) => {
  const genres = await Genre.findAll(options);
  return genres;
};

/**
 * Update genre by id
 * @param {ObjectId} genreId
 * @param {Object} updateBody
 * @returns {Promise<Genre>}
 */
const updateGenreById = async (genreId, updateBody) => {
  const genre = await getGenreById(genreId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, errors.notFound);
  }
  genre.set(updateBody);
  await genre.save();
  return genre;
};

/**
 * Delete genre by id
 * @param {ObjectId} genreId
 * @returns {Promise<Genre>}
 */
const deleteGenreById = async (genreId) => {
  const genre = await getGenreById(genreId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, errors.notFound);
  }
  await genre.destroy();
  return genre;
};

module.exports = {
  createGenre,
  queryGenres,
  getGenreById,
  getGenreByKey,
  updateGenreById,
  deleteGenreById,
};
