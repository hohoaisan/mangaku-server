const _ = require('lodash');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { roleRights, enumRole } = require('../config/roles');
const { status } = require('../constraints/approvalStatus');
const { authorService } = require('../services');
const ApiError = require('../utils/ApiError');

const getProfile = catchAsync(async (req, res) => {
  const { user } = req;
  user.permissions = roleRights.get(user.role);
  res.status(httpStatus.OK).send(user);
});

const getUserAuthor = catchAsync(async (req, res) => {
  const userId = req.user.id;
  if (req.user.role !== enumRole.USER && req.user.role !== enumRole.AUTHOR) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Must be an user or author to do that');
  }
  const existingAuthor = await authorService.getAuthorByUserId(userId);
  res.send(existingAuthor);
});

const becomeAuthorCreate = catchAsync(async (req, res) => {
  const userId = req.user.id;
  if (req.user.role === enumRole.AUTHOR) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have already become an author');
  }
  if (req.user.role !== enumRole.USER) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Must be an user to become author');
  }
  const existingAuthor = await authorService.getAuthorByUserId(userId);
  // console.log((await existingAuthor).toJSON());
  if (existingAuthor) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are aleady registered to become an author');
  }
  const createBody = {
    ..._.pick(req.body, ['name', 'description']),
    userId,
    approval_status: status.PENDING,
  };
  const author = await authorService.createAuthor(createBody);
  res.send(author);
});

module.exports = {
  getProfile,
  becomeAuthorCreate,
  getUserAuthor,
};
