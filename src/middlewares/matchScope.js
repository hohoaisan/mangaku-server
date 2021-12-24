const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

const DEFAULT_SCOPE = 'defaultScope';

const matchScope =
  (scopePerms, defaultScope = DEFAULT_SCOPE) =>
  (req, res, next) => {
    if (!req.query.scope) {
      req.query.scope = defaultScope;
    }
    const { scope } = req.query;
    const { user } = req;
    const userRights = user ? roleRights.get(user.role) : [];
    if (scope !== defaultScope && !(scope in scopePerms)) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Provided scope not allowed'));
    }
    const requiredRights = scopePerms[scope];
    if (requiredRights && requiredRights.length) {
      const hasRequiredRights = requiredRights.some((requiredRight) => userRights.includes(requiredRight));
      if (hasRequiredRights) {
        return next();
      }
      return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
    next();
  };

module.exports = matchScope;
