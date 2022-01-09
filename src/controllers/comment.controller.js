const _ = require('lodash');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');

const getComment = catchAsync(async (req, res) => {
  const { comicId, commentId } = req.params;
  const comment = await commentService.getCommentByIds({ id: commentId, comicId });
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  res.send(comment);
});

const createComment = catchAsync(async (req, res) => {
  const { comicId } = req.params;
  const userId = req.user.id;
  const commentBody = {
    comicId,
    userId,
    content: req.body.content,
  };
  const comment = await commentService.createComment(commentBody);

  res.status(httpStatus.CREATED).send(comment);
});

const deleteComment = catchAsync(async (req, res) => {
  const { comicId, commentId } = req.params;
  const userId = req.user.id;
  const comment = await commentService.getCommentByIds({
    id: commentId,
    comicId,
    userId,
  });
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment not found or you don't have permission to do that");
  }
  await commentService.deleteCommentById(comment.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateComment = catchAsync(async (req, res) => {
  const { comicId, commentId } = req.params;
  const userId = req.user.id;
  const comment = await commentService.getCommentByIds({
    id: commentId,
    comicId,
    userId,
  });
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment not found or you don't have permission to do that");
  }
  const updateBody = {
    content: req.body.content,
  };
  const updatedComment = await commentService.updateCommentById(comment.id, updateBody);
  res.send(updatedComment);
});

const getComments = catchAsync(async (req, res) => {
  const { comicId } = req.params;
  const userId = req.user.id;
  const options = _.pick(req.query, ['sortBy', 'page', 'limit']);
  const comments = await commentService.queryComments(comicId, options);
  if (comments.data) {
    comments.data = comments.data.map((comment) => ({
      ...(comment.toJSON ? comment.toJSON() : comment),
      isEditable: userId === comment.userId,
    }));
  }
  res.send(comments);
});

module.exports = {
  getComment,
  createComment,
  deleteComment,
  updateComment,
  getComments,
};
