const { Op } = require('sequelize');

const withSequelizeSearch =
  (query = null, field = []) =>
  (options) => {
    if (query && Array.isArray(field) && field.length) {
      const assignOpOr = [...field.map((value) => ({ [value]: { [Op.iLike]: `%${query}%` } }))];
      const newOptions = options;
      if (options.where && options.where[Op.or]) {
        newOptions.where[Op.or] = [...newOptions.where[Op.or], ...assignOpOr];
        return newOptions;
      }

      if (options.where) {
        newOptions.where = {
          ...newOptions.where,
          [Op.or]: assignOpOr,
        };
        return newOptions;
      }

      newOptions.where = {
        [Op.or]: assignOpOr,
      };
      return newOptions;
    }
    return options;
  };

module.exports = withSequelizeSearch;
