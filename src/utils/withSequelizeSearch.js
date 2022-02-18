const { Op, where, fn, col } = require('sequelize');

const withSequelizeSearch =
  (query = null, field = []) =>
  (options = {}) => {
    if (query && Array.isArray(field) && field.length) {
      const assignOpOr = [
        ...field.map((value) => where(fn('unaccent', col(value)), { [Op.iLike]: fn('unaccent', `%${query}%`) })),
      ];
      const newOptions = options;

      if (options.where) {
        newOptions.where = {
          [Op.and]: newOptions.where,
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
