const httpStatus = require('http-status');
const _ = require('lodash');
const { Comment, User } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * Get comment by id
 * @param {ObjectId} id
 * @returns {Promise<Comment>}
 */
const getCommentById = async (id) => {
  return Comment.findByPk(id);
};

const getCommentByIds = async ({ id, comicId, userId }) => {
  return Comment.findOne({
    where: {
      ...(id && { id }),
      ...(comicId && { comicId }),
      ...(userId && { userId }),
    },
  });
};

/**
 * Create a comment
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
 */

const createComment = async (commentBody) => {
  const comment = await Comment.create(commentBody);
  return comment.toJSON();
};

/**
 * Query for comments
 * @returns {Promise<QueryResult>}
 */
const queryComments = async (comicId, options) => {
  const queryOptions = _.extend(options, {
    where: {
      comicId,
    },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'user',
        required: true,
        attributes: ['id', 'name'],
      },
    ],
  });
  const comments = await Comment.paginate(queryOptions);
  return comments;
};

/**
 * Update comment by id
 * @param {ObjectId} commentId
 * @param {Object} updateBody
 * @returns {Promise<Comment>}
 */
const updateCommentById = async (commentId, updateBody) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found or had been deleted');
  }
  comment.set(updateBody);
  await comment.save();
  return comment;
};

/**
 * Delete comment by id
 * @param {ObjectId} commentId
 * @returns {Promise<Comment>}
 */
const deleteCommentById = async (commentId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found or had been deleted');
  }
  await comment.destroy();
  return comment;
};

module.exports = {
  getCommentById,
  getCommentByIds,
  createComment,
  queryComments,
  updateCommentById,
  deleteCommentById,
};
