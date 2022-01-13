const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const withSequelizeSearch = require('../utils/withSequelizeSearch');
const withScope = require('../utils/withScope');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const { search, scope } = pick(req.query, ['search', 'scope']);
  let options = pick(req.query, ['sortBy', 'page', 'limit']);
  options = withSequelizeSearch(search, ['name', 'email'])(options);
  const queryScope = withScope(req.user, {
    [scope || 'visible']: 'manageAuthors',
  });
  const result = await userService.queryUsers(options, queryScope);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const updateBody = pick(req.body, ['name', 'email', 'password', 'banned', 'emailVerified', 'role']);
  const updateOptions = pick(req.body, ['restore']);
  const currentUser = await userService.getUserById(req.params.userId, 'all');
  if (!currentUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateOptions.restore) {
    await currentUser.restore();
  }
  const user = await currentUser.update(updateBody);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
