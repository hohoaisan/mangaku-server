const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const pick = require('../utils/pick');

const mapRole =
  (rightActions = []) =>
  async (req, res, next) => {
    const { asPerm } = pick(req.query, ['asPerm']);
    const { user } = req;
    const userRights = user ? roleRights.get(user.role) : [];
    const hasRequiredRights = asPerm ? userRights.includes(asPerm) : true;
    if (!hasRequiredRights) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
    const matchActions = rightActions.find(({ rights }) => {
      if (rights && asPerm) {
        return rights.includes(asPerm);
      }
      if (!(rights.length || asPerm)) {
        return true;
      }
      return false;
    });
    if (matchActions) {
      return matchActions.action(req, res, next);
    }
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  };

module.exports = mapRole;
