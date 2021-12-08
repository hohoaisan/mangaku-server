const { roleRights } = require('../config/roles');
/**
 * Determine s
 * @returns {null} Default Sequelize scope
 * @returns {string} Single sequelize scope
 * @returns {string[]} Multiple sequelize scope
 */
const withScope = (user, scopesObj = {}) => {
  if (!(user && user.role)) return 'defaultScope';
  const scopes = Object.keys(scopesObj);

  const userRights = roleRights.get(user.role);

  const scope = scopes.filter((scopeName) => {
    const requiredRights = Array.isArray(scopesObj[scopeName]) ? scopesObj[scopeName] : [scopesObj[scopeName]];
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    return hasRequiredRights;
  });

  if (scope.length && scope.length > 1) return scope;

  if (scope.length) return scope[0];

  return 'defaultScope';
};

module.exports = withScope;
