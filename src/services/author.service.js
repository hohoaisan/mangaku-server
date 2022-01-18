const httpStatus = require('http-status');
// const { Op } = require('sequelize');
const { Author } = require('../models');
const ApiError = require('../utils/ApiError');
const strings = require('../constraints/strings');

const {
  author: { errors },
} = strings;
/**
 * Get author by id
 * @param {ObjectId} id
 * @returns {Promise<Author>}
 */
const getAuthorById = async (id, scope = 'all') => {
  const ScopedAuthor = Author.scope(scope);
  return ScopedAuthor.findByPk(id);
};

const getAuthorByUserId = async (userId, scope = 'all') => {
  const ScopedAuthor = Author.scope(scope);
  return ScopedAuthor.findOne({
    where: {
      userId,
    },
  });
};

/**
 * Create a author
 * @param {Object} authorBody
 * @returns {Promise<Author>}
 */

const createAuthor = async (authorBody) => {
  const author = await Author.create(authorBody);
  return author.toJSON();
};

/**
 * Query for authors
 * @returns {Promise<QueryResult>}
 */
const queryAuthors = async (options, scope) => {
  const ScopedAuthor = Author.scope(scope);
  const authors = await ScopedAuthor.paginate(options);
  return authors;
};

/**
 * Update author by id
 * @param {ObjectId} authorId
 * @param {Object} updateBody
 * @returns {Promise<Author>}
 */
const updateAuthorById = async (authorId, updateBody) => {
  const author = await getAuthorById(authorId);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, errors.notFound);
  }
  author.set(updateBody);
  await author.save();
  return author;
};

/**
 * Delete author by id
 * @param {ObjectId} authorId
 * @returns {Promise<Author>}
 */
const deleteAuthorById = async (authorId) => {
  const author = await getAuthorById(authorId);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, errors.notFound);
  }
  await author.destroy();
  return author;
};

module.exports = {
  createAuthor,
  queryAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
  getAuthorByUserId,
};
