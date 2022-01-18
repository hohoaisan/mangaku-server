const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const strings = require('../constraints/strings');

const {
  auth: { errors },
} = strings;

const verifyCallback = (req, resolve, reject, requiredRights, options) => async (err, user, info) => {
  const { anonymous } = options;

  if (info && info.constructor.name === 'TokenExpiredError') {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, errors.tokenExpired));
  }

  if (!anonymous && (err || info || !user)) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, errors.unauthorized));
  }

  req.user = user;

  if (!anonymous && requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth =
  (requiredRights = [], options = { anonymous: false }) =>
  async (req, res, next) => {
    if (!Array.isArray(requiredRights) && typeof requiredRights !== 'object') {
      // eslint-disable-next-line no-param-reassign
      requiredRights = [requiredRights];
    }
    if (!Array.isArray(requiredRights) && typeof requiredRights === 'object') {
      // eslint-disable-next-line no-param-reassign
      options = Object.assign(options, requiredRights);
      // eslint-disable-next-line no-param-reassign
      requiredRights = [];
    }
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights, options))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
