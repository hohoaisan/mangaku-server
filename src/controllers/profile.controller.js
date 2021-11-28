const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { roleRights } = require('../config/roles');

const getProfile = catchAsync(async (req, res) => {
  const { user } = req;
  user.permissions = roleRights.get(user.role);
  res.status(httpStatus.OK).send(user);
});

module.exports = {
  getProfile,
};
