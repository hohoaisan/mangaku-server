const _ = require('lodash');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { roleRights, enumRole } = require('../config/roles');
const { status } = require('../constraints/approvalStatus');
const { authorService, userService } = require('../services');
const ApiError = require('../utils/ApiError');
const strings = require('../constraints/strings');

const {
  author: { errors },
} = strings;

const getProfile = catchAsync(async (req, res) => {
  const { user } = req;
  user.permissions = roleRights.get(user.role);
  res.status(httpStatus.OK).send(user);
});

const updateProfile = catchAsync(async (req, res) => {
  const { user } = req;
  user.permissions = roleRights.get(user.role);
  const updateBody = _.pick(req.body, ['name', 'email', 'oldPassword', 'newPassword']);
  const updatedUser = await userService.updateUserProfileById(user.id, updateBody);
  res.status(httpStatus.OK).send(updatedUser);
});

const getUserAuthor = catchAsync(async (req, res) => {
  const userId = req.user.id;
  if (req.user.role !== enumRole.USER && req.user.role !== enumRole.AUTHOR) {
    throw new ApiError(httpStatus.BAD_REQUEST, errors.mustBeAuthor);
  }
  const existingAuthor = await authorService.getAuthorByUserId(userId);
  res.send(existingAuthor);
});

const becomeAuthorCreate = catchAsync(async (req, res) => {
  const userId = req.user.id;
  if (req.user.role === enumRole.AUTHOR) {
    throw new ApiError(httpStatus.BAD_REQUEST, errors.alreadyAuthor);
  }
  if (req.user.role !== enumRole.USER) {
    throw new ApiError(httpStatus.BAD_REQUEST, errors.mustBeUser);
  }
  const existingAuthor = await authorService.getAuthorByUserId(userId);
  // console.log((await existingAuthor).toJSON());
  if (existingAuthor) {
    throw new ApiError(httpStatus.BAD_REQUEST, errors.alreadyRegister);
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
  updateProfile,
};
