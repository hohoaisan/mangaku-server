const httpStatus = require('http-status');
const { Review } = require('../models');
const ApiError = require('../utils/ApiError');

const getReviewById = async (comicId, userId) => {
  return Review.findOne({
    where: { comicId, userId },
  });
};

/**
 * Create a review
 * @param {Object} reviewBody
 * @returns {Promise<Review>}
 */

const createReview = async (reviewBody) => {
  const review = await Review.create(reviewBody);
  return review.toJSON();
};

/**
 * Update review by id
 * @param {ObjectId} reviewId
 * @param {Object} updateBody
 * @returns {Promise<Review>}
 */
const updateReviewById = async (comicId, userId, updateBody) => {
  const review = await getReviewById(comicId, userId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found or had been deleted');
  }
  review.set(updateBody);
  await review.save();
  return review;
};

/**
 * Delete review by id
 * @param {ObjectId} reviewId
 * @returns {Promise<Review>}
 */
const deleteReviewById = async (comicId, userId) => {
  const review = await getReviewById(comicId, userId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found or had been deleted');
  }
  await review.destroy();
  return review;
};

module.exports = {
  getReviewById,
  createReview,
  updateReviewById,
  deleteReviewById,
};
