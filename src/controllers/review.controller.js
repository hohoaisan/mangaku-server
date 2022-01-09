const _ = require('lodash');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');

const getReview = catchAsync(async (req, res) => {
  const { comicId, userId } = req.params;
  const review = await reviewService.getReviewById(comicId, userId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  res.send(review);
});

const createReview = catchAsync(async (req, res) => {
  const { comicId } = req.params;
  const userId = req.user.id;
  const currentReview = await reviewService.getReviewById(comicId, userId);
  if (currentReview) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You have reviewed this comic');
  }
  const reviewBody = {
    comicId,
    userId,
    ..._.pick(req.body, ['content', 'rating']),
  };
  const review = await reviewService.createReview(reviewBody);
  res.status(httpStatus.CREATED).send(review);
});

const deleteReview = catchAsync(async (req, res) => {
  const { comicId, userId } = req.params;
  if (req.user.id !== userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You don't have permission to do that");
  }
  await reviewService.deleteReviewById(comicId, userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateReview = catchAsync(async (req, res) => {
  const { comicId, userId } = req.params;
  if (req.user.id !== userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You don't have permission to do that");
  }
  const updateBody = _.pick(req.body, ['content', 'rating']);
  const updatedReview = await reviewService.updateReviewById(comicId, userId, updateBody);
  res.send(updatedReview);
});

module.exports = {
  getReview,
  createReview,
  deleteReview,
  updateReview,
};
